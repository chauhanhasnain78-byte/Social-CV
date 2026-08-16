// ATS Scoring Engine - 5 weighted dimensions
const TECH_KEYWORDS = [
  'javascript','typescript','python','java','react','angular','vue','node','express','django','flask','spring',
  'aws','gcp','azure','docker','kubernetes','terraform','ci/cd','git','github','linux','sql','nosql','mongodb',
  'postgresql','mysql','redis','graphql','rest','api','microservices','agile','scrum','figma','html','css',
  'tailwind','next.js','vite','webpack','jest','cypress','machine learning','deep learning','tensorflow','pytorch',
  'data science','analytics','tableau','power bi','excel','communication','leadership','teamwork','problem solving',
  'collaboration','project management','cross-functional','stakeholder','metrics','performance','optimization',
];

const ACTION_VERBS = [
  'achieved','built','created','designed','developed','drove','engineered','grew','implemented','improved',
  'increased','launched','led','managed','optimized','reduced','scaled','shipped','solved','streamlined',
  'architected','automated','collaborated','delivered','established','maintained','mentored','migrated',
  'modernized','orchestrated','owned','refactored','researched','resolved','spearheaded','transformed',
];

const QUANTIFIER_PATTERNS = [
  /\d+%/,/\$\d+/,/\d+x/,/\d+\+/,/increased by \d+/i,/reduced by \d+/i,/saved \d+/i,
  /\d+ (users|customers|clients|engineers|teams|projects|services|systems|features|bugs)/i,
];

export function scoreResume(resume) {
  const fullText = JSON.stringify(resume).toLowerCase();
  const { personal, experience, education, skills, projects } = resume;

  // 1. Keywords (40 pts)
  const techFound = TECH_KEYWORDS.filter((k) => fullText.includes(k.toLowerCase()));
  const keywordScore = Math.min(40, Math.round((techFound.length / 20) * 40));

  // 2. Action Verbs (20 pts)
  const verbsFound = ACTION_VERBS.filter((v) => fullText.includes(v));
  const verbScore = Math.min(20, Math.round((verbsFound.length / 8) * 20));

  // 3. Quantified Impact (15 pts)
  const allBullets = experience.flatMap((e) => e.bullets || []).join(' ');
  const quantMatches = QUANTIFIER_PATTERNS.filter((p) => p.test(allBullets)).length;
  const quantScore = Math.min(15, quantMatches * 5);

  // 4. Section Completeness (15 pts)
  let sectionScore = 0;
  if (personal.name && personal.email) sectionScore += 3;
  if (personal.summary?.length > 50) sectionScore += 3;
  if (experience.length > 0) sectionScore += 3;
  if (education.length > 0) sectionScore += 3;
  if (skills.length >= 5) sectionScore += 3;
  sectionScore = Math.min(15, sectionScore);

  // 5. Contact & Links (10 pts)
  let contactScore = 0;
  if (personal.email) contactScore += 3;
  if (personal.phone) contactScore += 2;
  if (personal.linkedin) contactScore += 3;
  if (personal.github || personal.website) contactScore += 2;
  contactScore = Math.min(10, contactScore);

  const total = keywordScore + verbScore + quantScore + sectionScore + contactScore;

  const grade = total >= 85 ? 'Excellent 🏆' : total >= 70 ? 'Good ✅' : total >= 50 ? 'Needs Work ⚠️' : 'Poor ❌';
  const gradeColor = total >= 85 ? '#10b981' : total >= 70 ? '#22c55e' : total >= 50 ? '#eab308' : '#ef4444';

  const tips = [];
  if (keywordScore < 30) tips.push({ category: 'Keywords', priority: 'high', icon: '🔍', tip: 'Add more technical skills and tools to your resume. Target job descriptions often list 10-20 specific technologies.', example: 'React, Node.js, PostgreSQL, Docker, AWS' });
  if (verbScore < 12) tips.push({ category: 'Action Verbs', priority: 'high', icon: '⚡', tip: 'Start each bullet point with a strong action verb to make your impact clear.', example: '"Led a team of 5 engineers" or "Reduced load time by 40%"' });
  if (quantScore < 8) tips.push({ category: 'Quantified Impact', priority: 'medium', icon: '📊', tip: 'Add numbers and metrics to your experience bullets. Recruiters love measurable results.', example: '"Grew revenue by 30%" or "Served 50K+ users"' });
  if (!personal.summary || personal.summary.length < 50) tips.push({ category: 'Summary', priority: 'medium', icon: '📝', tip: 'Add a 2-3 sentence professional summary at the top. It\'s the first thing recruiters read.', example: '"Full-stack engineer with 3+ years building scalable React/Node.js applications…"' });
  if (!personal.linkedin) tips.push({ category: 'LinkedIn', priority: 'low', icon: '🔗', tip: 'Add your LinkedIn URL. 87% of recruiters use LinkedIn to verify candidates.' });

  return {
    score: total,
    grade,
    gradeColor,
    breakdown: { keywords: keywordScore, actionVerbs: verbScore, quantified: quantScore, sections: sectionScore, contact: contactScore },
    tips,
    techFound: techFound.slice(0, 30),
    verbsFound: verbsFound.slice(0, 10),
  };
}
