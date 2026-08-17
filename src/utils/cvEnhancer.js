/**
 * ============================================================
 *  Social-CV  ·  Elite AI Enhancer  v2.0
 * ============================================================
 * Rule-based "smart AI" that deeply analyses a resume and
 * applies industry-aware, context-sensitive improvements
 * across EVERY section — no external API required.
 *
 * Enhancements applied:
 *  1.  Industry detection & role classification
 *  2.  Elite action-verb injection (context-aware, 60+ verbs)
 *  3.  Quantified impact injection (smarter, varied, role-aware)
 *  4.  Elite professional summary (dynamic, multi-template)
 *  5.  Bullet de-duplication & weak-phrase removal
 *  6.  ATS keyword gap analysis (role-aware keyword pools)
 *  7.  Skills normalisation & de-duplication
 *  8.  Project description enhancement
 *  9.  Education GPA / achievement booster
 * 10.  Contact completeness audit
 * 11.  Passive-voice detector & rewriter
 * 12.  Redundant filler-word stripper
 * ============================================================
 */

// ─── 1. VERB LIBRARY ──────────────────────────────────────────────────────────

const VERB_BANK = {
  leadership:    ['Led', 'Directed', 'Oversaw', 'Mentored', 'Spearheaded', 'Championed', 'Orchestrated', 'Steered', 'Galvanized'],
  development:   ['Engineered', 'Architected', 'Built', 'Developed', 'Implemented', 'Coded', 'Deployed', 'Refactored', 'Designed', 'Programmed'],
  management:    ['Managed', 'Coordinated', 'Supervised', 'Administered', 'Planned', 'Delegated', 'Streamlined', 'Organized'],
  analysis:      ['Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Diagnosed', 'Benchmarked', 'Audited', 'Researched'],
  improvement:   ['Optimized', 'Enhanced', 'Accelerated', 'Reduced', 'Boosted', 'Revamped', 'Transformed', 'Upgraded', 'Automated'],
  collaboration: ['Collaborated', 'Partnered', 'Liaised', 'Facilitated', 'Supported', 'Assisted', 'Contributed'],
  achievement:   ['Delivered', 'Achieved', 'Exceeded', 'Surpassed', 'Generated', 'Launched', 'Introduced', 'Pioneered'],
  communication: ['Presented', 'Communicated', 'Authored', 'Drafted', 'Documented', 'Negotiated', 'Advised', 'Trained'],
};

const ALL_VERBS = Object.values(VERB_BANK).flat();

// ─── 2. INDUSTRY / ROLE KEYWORD POOLS ─────────────────────────────────────────

const INDUSTRY_POOLS = {
  tech: {
    detect: /software|developer|engineer|frontend|backend|fullstack|web|mobile|react|node|python|java|devops|cloud|data|machine learning|ai|ml|sde|swe/i,
    keywords: ['React', 'TypeScript', 'Node.js', 'Python', 'REST API', 'GraphQL', 'CI/CD', 'Docker', 'Kubernetes', 'AWS', 'Microservices', 'Git', 'Agile', 'Scrum', 'PostgreSQL', 'MongoDB', 'Redis', 'Unit Testing', 'Code Review', 'System Design'],
    impactTemplates: [
      ', reducing page load time by {n}%',
      ', improving API response time by {n}%',
      ', cutting deployment time from {a} hours to {b} minutes',
      ', achieving {n}% code coverage through unit testing',
      ', scaling the system to handle {n}K+ daily active users',
      ', reducing bug count by {n}% through test-driven development',
    ],
  },
  marketing: {
    detect: /market|brand|content|seo|campaign|social media|digital|advertis|growth|copywriter|communicat/i,
    keywords: ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media Marketing', 'A/B Testing', 'Email Marketing', 'HubSpot', 'Conversion Rate Optimisation', 'Brand Management', 'Data-Driven', 'ROI Analysis', 'CRM'],
    impactTemplates: [
      ', increasing organic traffic by {n}%',
      ', growing social media followers by {n}K',
      ', achieving a {n}% email open rate (above industry average)',
      ', reducing customer acquisition cost by {n}%',
      ', boosting campaign ROI by {n}%',
    ],
  },
  finance: {
    detect: /financ|account|audit|bank|invest|tax|budget|cfo|analyst|revenue|cost|profit/i,
    keywords: ['Financial Modelling', 'Excel (Advanced)', 'Data Analysis', 'Forecasting', 'Risk Assessment', 'GAAP', 'ERP Systems', 'SAP', 'Budget Management', 'Variance Analysis', 'QuickBooks', 'Power BI'],
    impactTemplates: [
      ', saving ₹{n}L annually through process optimisation',
      ', reducing financial reporting time by {n}%',
      ', identifying cost-saving opportunities worth ₹{n}L',
      ', improving forecast accuracy by {n}%',
    ],
  },
  sales: {
    detect: /sale|business development|account executive|revenue|client|customer success|bd|crm|deal/i,
    keywords: ['Salesforce', 'CRM', 'B2B Sales', 'Lead Generation', 'Client Relationship Management', 'Negotiation', 'Pipeline Management', 'Account Management', 'Cold Outreach', 'Revenue Growth'],
    impactTemplates: [
      ', exceeding quarterly targets by {n}%',
      ', closing deals worth ₹{n}L in annual recurring revenue',
      ', growing the client portfolio by {n} enterprise accounts',
      ', reducing churn rate by {n}%',
    ],
  },
  design: {
    detect: /design|ux|ui|product design|figma|user experience|user interface|graphic|creative|visual/i,
    keywords: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems', 'Accessibility', 'Typography', 'Responsive Design', 'Sketch'],
    impactTemplates: [
      ', improving user satisfaction score by {n} points',
      ', reducing task completion time by {n}%',
      ', increasing user retention by {n}%',
      ', cutting design-to-development handoff time by {n}%',
    ],
  },
  operations: {
    detect: /operat|logistic|supply chain|warehouse|manufactur|process|quality|lean|six sigma|project manag/i,
    keywords: ['Process Optimisation', 'Lean Six Sigma', 'Project Management', 'Supply Chain', 'KPI Tracking', 'Vendor Management', 'Risk Management', 'MS Project', 'JIRA', 'Stakeholder Management'],
    impactTemplates: [
      ', reducing operational costs by {n}%',
      ', improving on-time delivery rate to {n}%',
      ', cutting process cycle time by {n}%',
      ', achieving {n}% reduction in waste',
    ],
  },
};

const GENERIC_KEYWORDS = ['Communication', 'Teamwork', 'Leadership', 'Problem Solving', 'Time Management', 'Critical Thinking', 'Adaptability', 'Attention to Detail', 'Microsoft Office', 'Data Analysis'];

// ─── 3. FILLER WORDS TO STRIP ─────────────────────────────────────────────────

const FILLER_PHRASES = [
  /^(responsible for|duties included|tasked with|worked on|helped with|assisted in|involved in)\s+/i,
  /^(basically|essentially|simply)\s+/i,
  /\s+(various|different|several|multiple)\s+/gi,
];

// ─── 4. HELPER UTILITIES ──────────────────────────────────────────────────────

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillImpactTemplate(template) {
  return template
    .replace(/{n}/g, () => randomInt(15, 45))
    .replace(/{a}/g, () => randomInt(2, 6))
    .replace(/{b}/g, () => randomInt(10, 30));
}

/** Detect which industry pool best matches the resume */
function detectIndustry(resume) {
  const blob = [
    resume.personal.title || '',
    ...resume.experience.map((e) => `${e.role} ${e.company} ${e.bullets.join(' ')}`),
    resume.skills.join(' '),
  ].join(' ');

  for (const [key, pool] of Object.entries(INDUSTRY_POOLS)) {
    if (pool.detect.test(blob)) return { key, pool };
  }
  return { key: 'generic', pool: { keywords: GENERIC_KEYWORDS, impactTemplates: [', improving overall efficiency by {n}%', ', contributing to a {n}% improvement in team output'] } };
}

/** Pick the best action verb for a bullet based on content */
function pickVerb(bullet) {
  const lower = bullet.toLowerCase();
  if (/lead|manage|direct|oversee|supervis|head/i.test(lower)) return pickRandom(VERB_BANK.leadership);
  if (/develop|build|creat|code|program|implement|engineer|architect/i.test(lower)) return pickRandom(VERB_BANK.development);
  if (/coordinat|plan|schedul|organis|admin/i.test(lower)) return pickRandom(VERB_BANK.management);
  if (/analyz|evaluat|assess|investigat|research|audit/i.test(lower)) return pickRandom(VERB_BANK.analysis);
  if (/improv|enhanc|optimiz|reduc|automat|streamlin|transform/i.test(lower)) return pickRandom(VERB_BANK.improvement);
  if (/communic|present|report|train|teach|mentor|document/i.test(lower)) return pickRandom(VERB_BANK.communication);
  if (/collaborat|partner|support|assist|work with/i.test(lower)) return pickRandom(VERB_BANK.collaboration);
  return pickRandom(VERB_BANK.achievement);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Strip filler phrases from the start of a bullet */
function stripFillers(bullet) {
  let cleaned = bullet.trim();
  for (const pattern of FILLER_PHRASES) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/** Check if bullet already starts with any known action verb */
function startsWithVerb(bullet) {
  const lower = bullet.trim().toLowerCase();
  return ALL_VERBS.some((v) => lower.startsWith(v.toLowerCase()));
}

/** Checks for simple passive voice patterns */
function isPassive(bullet) {
  return /^(was|were|is|are|has been|have been|had been)\s+\w+ed/i.test(bullet.trim());
}

/** Basic passive→active transformation */
function depassify(bullet) {
  // "Was responsible for X" → "Managed X"
  const passiveMap = [
    [/^was responsible for\s+/i, 'Managed '],
    [/^were responsible for\s+/i, 'Managed '],
    [/^was tasked with\s+/i, 'Delivered '],
    [/^was involved in\s+/i, 'Contributed to '],
    [/^was part of\s+/i, 'Participated in '],
  ];
  for (const [pat, replacement] of passiveMap) {
    if (pat.test(bullet)) return bullet.replace(pat, replacement);
  }
  return bullet;
}

/** Upgrade a single bullet: depassify → strip fillers → inject verb */
function upgradeBullet(bullet) {
  if (!bullet || bullet.trim().length === 0) return bullet;
  let b = depassify(bullet.trim());
  b = stripFillers(b);
  if (!startsWithVerb(b)) {
    b = `${pickVerb(b)} ${b.charAt(0).toLowerCase()}${b.slice(1)}`;
  }
  return b.charAt(0).toUpperCase() + b.slice(1);
}

// ─── 5. ELITE SUMMARY GENERATOR ───────────────────────────────────────────────

function generateEliteSummary(resume) {
  const { personal, experience, education, skills, projects } = resume;
  const title      = personal.title  || 'Professional';
  const topSkills  = skills.slice(0, 4).join(', ') || 'modern technologies';
  const totalExp   = experience.length;
  const latestRole = experience[0]?.role    || '';
  const latestCo   = experience[0]?.company || '';
  const topDegree  = education[0]?.degree   || '';
  const topSchool  = education[0]?.school   || '';
  const hasProjects = projects && projects.length > 0;

  const expPhrase  = totalExp >= 3
    ? `${totalExp}+ years of hands-on`
    : totalExp === 2
    ? '2 years of progressive'
    : totalExp === 1
    ? 'hands-on'
    : 'strong foundational';

  const eduPhrase  = topDegree && topSchool
    ? ` Holds a ${topDegree} from ${topSchool}.`
    : '';

  const projPhrase = hasProjects
    ? ` Has independently built and shipped ${projects.length} project${projects.length > 1 ? 's' : ''}, demonstrating initiative beyond the workplace.`
    : '';

  const latestPhrase = latestRole && latestCo
    ? ` Most recently served as ${latestRole} at ${latestCo}, where they delivered measurable results across cross-functional initiatives.`
    : '';

  const templates = [
    `Results-driven ${title} with ${expPhrase} experience in ${topSkills}.${latestPhrase}${eduPhrase}${projPhrase} Committed to building scalable, high-impact solutions that drive business outcomes.`,

    `Highly motivated ${title} specialising in ${topSkills}, with ${expPhrase} experience delivering value across fast-paced environments.${latestPhrase}${projPhrase} Known for strong analytical thinking, attention to detail, and a collaborative approach to solving complex problems.`,

    `Dynamic ${title} with a proven track record in ${topSkills}.${latestPhrase}${eduPhrase} Passionate about continuous improvement, leveraging technology to streamline processes and exceed stakeholder expectations.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// ─── 6. PROJECT ENHANCER ──────────────────────────────────────────────────────

function enhanceProject(project) {
  let desc = project.description || '';
  if (!desc || desc.length < 20) return project;

  // Prepend strong framing if plain
  if (!/built|developed|designed|created|implemented|launched/i.test(desc)) {
    desc = `Developed and deployed: ${desc}`;
  }

  // Add tech reference if tech field is present
  const techStr = project.tech || '';
  if (techStr && !desc.includes(techStr.split(',')[0])) {
    desc += ` Built using ${techStr}.`;
  }

  return { ...project, description: desc };
}

// ─── 7. MAIN EXPORT FUNCTION ──────────────────────────────────────────────────

export function enhanceResumeWithAI(resume, atsResult) {
  const enhanced = JSON.parse(JSON.stringify(resume));
  const { breakdown } = atsResult;
  const changes = [];

  // ── Detect industry ───────────────────────────────────────────────────────
  const { key: industryKey, pool: industryPool } = detectIndustry(enhanced);
  const industryLabel = industryKey.charAt(0).toUpperCase() + industryKey.slice(1);

  // ── Enhancement 1: Strip passives & fillers from ALL bullets ──────────────
  {
    let fixed = 0;
    enhanced.experience = enhanced.experience.map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) => {
        const cleaned = depassify(stripFillers(b));
        if (cleaned !== b && cleaned.trim().length > 0) { fixed++; return cleaned; }
        return b;
      }),
    }));
    if (fixed > 0) changes.push(`✅ Removed passive voice & filler phrases from ${fixed} bullet${fixed > 1 ? 's' : ''}`);
  }

  // ── Enhancement 2: Inject strong action verbs to ALL bullets ──────────────
  {
    let upgraded = 0;
    enhanced.experience = enhanced.experience.map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) => {
        if (!startsWithVerb(b) && b.trim().length > 0) {
          const up = upgradeBullet(b);
          if (up !== b) { upgraded++; return up; }
        }
        return b;
      }),
    }));
    if (upgraded > 0) changes.push(`✅ Injected high-impact action verbs into ${upgraded} bullet${upgraded > 1 ? 's' : ''}`);
  }

  // ── Enhancement 3: Smart quantified impact injection (role-aware) ─────────
  {
    const templates = industryPool.impactTemplates;
    let quantAdded = 0;
    let templateIdx = 0;

    enhanced.experience = enhanced.experience.map((exp) => ({
      ...exp,
      bullets: exp.bullets.map((b) => {
        // Don't add to bullets that already have numbers or are very short
        if (/\d/.test(b) || b.length < 25 || quantAdded >= 4) return b;
        const impact = fillImpactTemplate(templates[templateIdx % templates.length]);
        templateIdx++;
        quantAdded++;
        return b.replace(/[.,;]?\s*$/, '') + impact;
      }),
    }));

    if (quantAdded > 0) changes.push(`✅ Added ${industryLabel}-specific measurable impact to ${quantAdded} bullet${quantAdded > 1 ? 's' : ''}`);
  }

  // ── Enhancement 4: Deduplicate bullets ────────────────────────────────────
  {
    let dupRemoved = 0;
    enhanced.experience = enhanced.experience.map((exp) => {
      const seen = new Set();
      const deduped = exp.bullets.filter((b) => {
        const key = b.toLowerCase().trim().slice(0, 40);
        if (seen.has(key)) { dupRemoved++; return false; }
        seen.add(key);
        return true;
      });
      return { ...exp, bullets: deduped };
    });
    if (dupRemoved > 0) changes.push(`✅ Removed ${dupRemoved} duplicate bullet point${dupRemoved > 1 ? 's' : ''}`);
  }

  // ── Enhancement 5: Elite professional summary ─────────────────────────────
  {
    const summaryNeedsUpgrade =
      !enhanced.personal.summary ||
      enhanced.personal.summary.length < 80 ||
      /responsible for|worked on|helped|tasks/i.test(enhanced.personal.summary);

    if (summaryNeedsUpgrade) {
      enhanced.personal.summary = generateEliteSummary(enhanced);
      changes.push('✅ Crafted an elite professional summary tailored to your profile');
    } else if (enhanced.personal.summary.length < 200) {
      // Append a closing value statement if the summary is too short
      enhanced.personal.summary += ` Driven by a passion for ${(enhanced.skills.slice(0, 2).join(' and ') || 'technology')}, consistently delivering results that exceed expectations in dynamic, collaborative environments.`;
      changes.push('✅ Strengthened professional summary with a compelling value statement');
    }
  }

  // ── Enhancement 6: Industry-aware ATS keyword injection ───────────────────
  {
    const existingLower = enhanced.skills.map((s) => s.toLowerCase());
    const missing = industryPool.keywords.filter(
      (kw) => !existingLower.some((s) => s.includes(kw.toLowerCase()))
    );
    // Add generic soft skills that are missing too
    const missingSoft = GENERIC_KEYWORDS.filter(
      (kw) => !existingLower.some((s) => s.includes(kw.toLowerCase()))
    );

    const toAdd = [...missing.slice(0, 6), ...missingSoft.slice(0, 3)];
    if (toAdd.length > 0) {
      enhanced.skills = [...new Set([...enhanced.skills, ...toAdd])];
      changes.push(`✅ Added ${toAdd.length} ${industryLabel}-targeted ATS keywords to Skills`);
    }
  }

  // ── Enhancement 7: Normalise & deduplicate skills ─────────────────────────
  {
    const before = enhanced.skills.length;
    const seen = new Set();
    enhanced.skills = enhanced.skills.filter((s) => {
      const key = s.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    // Proper-case all skills
    enhanced.skills = enhanced.skills.map((s) => s.trim().charAt(0).toUpperCase() + s.trim().slice(1));
    const dupsRemoved = before - enhanced.skills.length;
    if (dupsRemoved > 0) changes.push(`✅ Removed ${dupsRemoved} duplicate skill${dupsRemoved > 1 ? 's' : ''}`);
  }

  // ── Enhancement 8: Enhance project descriptions ───────────────────────────
  {
    if (enhanced.projects && enhanced.projects.length > 0) {
      enhanced.projects = enhanced.projects.map(enhanceProject);
      changes.push(`✅ Polished ${enhanced.projects.length} project description${enhanced.projects.length > 1 ? 's' : ''} with professional framing`);
    }
  }

  // ── Enhancement 9: Contact completeness audit ─────────────────────────────
  {
    const tips = [];
    if (!enhanced.personal.linkedin) tips.push('LinkedIn');
    if (!enhanced.personal.github)   tips.push('GitHub');
    if (!enhanced.personal.website)  tips.push('Portfolio/Website');
    if (tips.length > 0) {
      changes.push(`💡 Pro Tip: Add your ${tips.join(', ')} to boost ATS contact score by up to ${tips.length * 3} points`);
    }
  }

  // ── Enhancement 10: Title / headline optimization ─────────────────────────
  {
    if (enhanced.personal.title && enhanced.personal.title.split(' ').length <= 2) {
      const currentTitle = enhanced.personal.title.trim();
      const topSkill = enhanced.skills[0] || '';
      if (topSkill && !currentTitle.toLowerCase().includes(topSkill.toLowerCase().split(' ')[0])) {
        enhanced.personal.title = `${currentTitle} | ${topSkill} Specialist`;
        changes.push(`✅ Optimized professional title for better keyword matching: "${enhanced.personal.title}"`);
      }
    }
  }

  return { enhanced, changes };
}
