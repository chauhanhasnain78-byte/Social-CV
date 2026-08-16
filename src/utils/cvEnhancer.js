/**
 * AI CV Enhancer — reads ATS result and intelligently improves the resume data.
 * No external API needed: uses smart rule-based enhancement based on the score.
 */

const STRONG_ACTION_VERBS = [
  'Developed', 'Built', 'Designed', 'Implemented', 'Led', 'Managed',
  'Optimized', 'Delivered', 'Architected', 'Streamlined', 'Launched',
  'Engineered', 'Drove', 'Established', 'Collaborated', 'Automated',
  'Improved', 'Scaled', 'Transformed', 'Spearheaded',
];

const SUGGESTED_KEYWORDS = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python',
  'REST API', 'Git', 'Docker', 'Agile', 'Problem Solving',
  'Communication', 'Teamwork', 'Leadership', 'PostgreSQL',
];

/**
 * Upgrades a bullet point to start with a strong action verb.
 * e.g. "handling goods in correct order" → "Managed goods handling and ensured correct order"
 */
function upgradeBullet(bullet) {
  if (!bullet || bullet.trim().length === 0) return bullet;
  const lower = bullet.trim().toLowerCase();

  // Already starts with an action verb — check if quantified
  const alreadyHasVerb = STRONG_ACTION_VERBS.some(
    (v) => lower.startsWith(v.toLowerCase())
  );

  // Add a strong verb prefix if missing
  let upgraded = bullet.trim();

  if (!alreadyHasVerb) {
    // Prepend a contextual action verb based on content keywords
    if (/manag|handl|oversee|supervis/i.test(lower)) upgraded = `Managed ${bullet.trim()}`;
    else if (/develop|build|creat|code|program/i.test(lower)) upgraded = `Developed ${bullet.trim()}`;
    else if (/design|plan|architect/i.test(lower)) upgraded = `Designed ${bullet.trim()}`;
    else if (/improv|enhanc|optimiz|reduc/i.test(lower)) upgraded = `Optimized ${bullet.trim()}`;
    else if (/communic|coordinat|collaborat/i.test(lower)) upgraded = `Collaborated on ${bullet.trim()}`;
    else if (/lead|led|direct/i.test(lower)) upgraded = `Led ${bullet.trim()}`;
    else if (/analyz|research|investigat/i.test(lower)) upgraded = `Analyzed ${bullet.trim()}`;
    else upgraded = `Delivered ${bullet.trim()}`;
  }

  // Capitalize first letter
  upgraded = upgraded.charAt(0).toUpperCase() + upgraded.slice(1);

  return upgraded;
}

/**
 * Infers a professional summary from the resume data if missing or too short.
 */
function generateSummary(resume) {
  const { personal, experience, skills } = resume;
  const name = personal.name?.split(' ')[0] || 'Professional';
  const title = personal.title || 'Professional';
  const yearsExp = experience.length > 0 ? `${experience.length}+ years of` : '';
  const topSkills = skills.slice(0, 3).join(', ') || 'modern technologies';
  const latestRole = experience[0]?.role || '';
  const latestCompany = experience[0]?.company || '';

  const parts = [
    `${yearsExp ? `${yearsExp} ` : ''}${title} with hands-on experience in ${topSkills}.`,
    latestRole && latestCompany
      ? `Previously ${latestRole} at ${latestCompany}, driving impactful results through technical expertise.`
      : '',
    'Passionate about delivering high-quality solutions and collaborating within cross-functional teams to achieve measurable business goals.',
  ].filter(Boolean);

  return parts.join(' ');
}

/**
 * Main enhancer function.
 * Returns an enhanced copy of the resume based on ATS tips.
 */
export function enhanceResumeWithAI(resume, atsResult) {
  // Deep clone
  const enhanced = JSON.parse(JSON.stringify(resume));
  const { tips, breakdown } = atsResult;
  const changes = [];

  // Fix 1: Upgrade bullet points to start with action verbs
  if (breakdown.actionVerbs < 16) {
    let bulletUpgradeCount = 0;
    enhanced.experience = enhanced.experience.map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) => {
        const upgraded = upgradeBullet(b);
        if (upgraded !== b) bulletUpgradeCount++;
        return upgraded;
      }),
    }));
    if (bulletUpgradeCount > 0) {
      changes.push(`✅ Upgraded ${bulletUpgradeCount} bullet point${bulletUpgradeCount > 1 ? 's' : ''} with strong action verbs`);
    }
  }

  // Fix 2: Add quantified impact to bullets that lack numbers
  if (breakdown.quantified < 10) {
    const IMPACT_SUFFIXES = [
      ', improving efficiency by 20%',
      ', resulting in measurable performance gains',
      ', boosting team productivity',
      ', reducing turnaround time significantly',
      ', contributing to a 15% improvement in outcomes',
    ];
    let quantCount = 0;
    enhanced.experience = enhanced.experience.map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b, i) => {
        // Only add to bullets that have no numbers already
        if (!/\d/.test(b) && i < 2 && quantCount < 2) {
          const suffix = IMPACT_SUFFIXES[quantCount % IMPACT_SUFFIXES.length];
          quantCount++;
          return b + suffix;
        }
        return b;
      }),
    }));
    if (quantCount > 0) {
      changes.push(`✅ Added measurable impact metrics to ${quantCount} bullet point${quantCount > 1 ? 's' : ''}`);
    }
  }

  // Fix 3: Generate/improve professional summary
  if (!enhanced.personal.summary || enhanced.personal.summary.length < 50) {
    enhanced.personal.summary = generateSummary(enhanced);
    changes.push('✅ Generated a professional summary section');
  }

  // Fix 4: Add missing important keywords as skills
  if (breakdown.keywords < 30) {
    const existingSkillsLower = enhanced.skills.map((s) => s.toLowerCase());
    const missingKeywords = SUGGESTED_KEYWORDS.filter(
      (kw) => !existingSkillsLower.some((s) => s.includes(kw.toLowerCase()))
    ).slice(0, 4);

    if (missingKeywords.length > 0) {
      enhanced.skills = [...new Set([...enhanced.skills, ...missingKeywords])];
      changes.push(`✅ Added ${missingKeywords.length} high-value keywords: ${missingKeywords.join(', ')}`);
    }
  }

  // Fix 5: Ensure LinkedIn placeholder is hinted
  // (We can't add their actual URL, so we leave a reminder in changes)
  if (!enhanced.personal.linkedin) {
    changes.push('💡 Tip: Add your LinkedIn URL in Personal Info to boost your score by 3 points');
  }

  return { enhanced, changes };
}
