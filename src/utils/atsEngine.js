/**
 * ATS Scoring Engine v3 — Hybrid AI + Local Fallback
 *
 * Strategy:
 *   1. First tries Gemini AI for a real, intelligent ATS analysis.
 *   2. If AI fails (rate limit, network error, no key), silently falls back
 *      to the local rule-based engine. User never sees an error.
 *
 * Privacy:
 *   Personal identifiers (name, email, phone, LinkedIn, GitHub) are STRIPPED
 *   before sending to Gemini. Only professional content is analyzed.
 */

// No SDK needed — using Gemini REST API v1 directly via fetch()

// ─── LOCAL ENGINE DATA ────────────────────────────────────────────────────────

const TECH_KEYWORDS = [
  'javascript','typescript','python','java','react','angular','vue','node','express',
  'django','flask','spring','aws','gcp','azure','docker','kubernetes','terraform',
  'ci/cd','git','github','linux','sql','nosql','mongodb','postgresql','mysql','redis',
  'graphql','rest','api','microservices','agile','scrum','figma','html','css',
  'tailwind','next.js','vite','webpack','jest','cypress','machine learning',
  'deep learning','tensorflow','pytorch','data science','analytics','tableau',
  'power bi','excel','communication','leadership','teamwork','problem solving',
  'collaboration','project management','cross-functional','stakeholder',
  'metrics','performance','optimization','adobe','photoshop','illustrator',
];

const ACTION_VERBS = [
  'achieved','built','created','designed','developed','drove','engineered','grew',
  'implemented','improved','increased','launched','led','managed','optimized',
  'reduced','scaled','shipped','solved','streamlined','architected','automated',
  'collaborated','delivered','established','maintained','mentored','migrated',
  'modernized','orchestrated','owned','refactored','researched','resolved',
  'spearheaded','transformed','coordinated','supervised','analysed','presented',
];

const QUANTIFIER_PATTERNS = [
  /\d+%/,
  /₹\d+/,
  /\$\d+/,
  /\d+x\b/,
  /\d+\+/,
  /increased by \d+/i,
  /reduced by \d+/i,
  /saved \d+/i,
  /\d+\s*(users|customers|clients|engineers|teams|projects|services|systems|features|bugs|months|years|days)/i,
];

// ─── TEXT CORPUS BUILDER (LOCAL) ──────────────────────────────────────────────

function buildTextCorpus(resume) {
  const parts = [];
  const p = resume.personal || {};
  if (p.title)    parts.push(p.title);
  if (p.summary)  parts.push(p.summary);

  (resume.experience || []).forEach((exp) => {
    if (exp.company) parts.push(exp.company);
    if (exp.role)    parts.push(exp.role);
    (exp.bullets || []).forEach((b) => { if (b) parts.push(b); });
  });

  (resume.education || []).forEach((edu) => {
    if (edu.school) parts.push(edu.school);
    if (edu.degree) parts.push(edu.degree);
    if (edu.field)  parts.push(edu.field);
  });

  (resume.skills || []).forEach((sk) => { if (sk) parts.push(sk); });

  (resume.projects || []).forEach((proj) => {
    if (proj.name)        parts.push(proj.name);
    if (proj.tech)        parts.push(proj.tech);
    if (proj.description) parts.push(proj.description);
  });

  (resume.languages || []).forEach((lang) => {
    if (lang.language) parts.push(lang.language);
  });

  (resume.certifications || []).forEach((cert) => {
    if (cert.name)   parts.push(cert.name);
    if (cert.issuer) parts.push(cert.issuer);
  });

  return parts.join(' ').toLowerCase();
}

// ─── PRIVACY SAFE TEXT FOR GEMINI (No PII) ───────────────────────────────────

function buildPrivacySafeText(resume) {
  const lines = [];

  const p = resume.personal || {};
  if (p.title)   lines.push(`Job Title: ${p.title}`);
  if (p.summary) lines.push(`Summary: ${p.summary}`);

  if ((resume.skills || []).length > 0)
    lines.push(`Skills: ${resume.skills.join(', ')}`);

  if ((resume.experience || []).length > 0) {
    lines.push('\nWork Experience:');
    resume.experience.forEach((exp) => {
      lines.push(`- Role: ${exp.role || ''} at ${exp.company || ''}`);
      (exp.bullets || []).forEach((b) => { if (b) lines.push(`  • ${b}`); });
    });
  }

  if ((resume.projects || []).length > 0) {
    lines.push('\nProjects:');
    resume.projects.forEach((proj) => {
      lines.push(`- ${proj.name || ''}: ${proj.description || ''} | Tech: ${proj.tech || ''}`);
    });
  }

  if ((resume.certifications || []).length > 0) {
    lines.push('\nCertifications:');
    resume.certifications.forEach((cert) => {
      lines.push(`- ${cert.name || ''} by ${cert.issuer || ''}`);
    });
  }

  return lines.join('\n');
}

// ─── LOCAL SCORING ENGINE (Fallback) ─────────────────────────────────────────

function scoreLocal(resume) {
  const fullText = buildTextCorpus(resume);
  const { personal, experience, education, skills, projects, languages, certifications } = resume;

  const techFound    = TECH_KEYWORDS.filter((k) => fullText.includes(k.toLowerCase()));
  const keywordScore = Math.min(40, Math.round((techFound.length / 20) * 40));

  const verbsFound = ACTION_VERBS.filter((v) => fullText.includes(v));
  const verbScore  = Math.min(20, Math.round((verbsFound.length / 8) * 20));

  const allBullets   = (experience || []).flatMap((e) => e.bullets || []).join(' ');
  const quantMatches = QUANTIFIER_PATTERNS.filter((p) => p.test(allBullets)).length;
  const quantScore   = Math.min(15, quantMatches * 5);

  let sectionScore = 0;
  if (personal?.name && personal?.email)       sectionScore += 3;
  if ((personal?.summary || '').length > 50)   sectionScore += 3;
  if ((experience || []).length > 0)            sectionScore += 3;
  if ((education  || []).length > 0)            sectionScore += 3;
  if ((skills     || []).length >= 5)           sectionScore += 3;
  sectionScore = Math.min(15, sectionScore);

  let contactScore = 0;
  if (personal?.email)                      contactScore += 3;
  if (personal?.phone)                      contactScore += 2;
  if (personal?.linkedin)                   contactScore += 3;
  if (personal?.github || personal?.website) contactScore += 2;
  contactScore = Math.min(10, contactScore);

  const total      = keywordScore + verbScore + quantScore + sectionScore + contactScore;
  const grade      = total >= 85 ? 'Excellent 🏆' : total >= 70 ? 'Good ✅' : total >= 50 ? 'Needs Work ⚠️' : 'Poor ❌';
  const gradeColor = total >= 85 ? '#10b981'       : total >= 70 ? '#22c55e'  : total >= 50 ? '#eab308'       : '#ef4444';

  const tips = [];
  if (keywordScore < 30)
    tips.push({ category: 'Keywords', priority: 'high', icon: '🔍', tip: 'Add more technical skills and industry tools. Target job descriptions often mention 10–20 specific technologies.', example: 'React, Node.js, PostgreSQL, Docker, AWS' });
  if (verbScore < 12)
    tips.push({ category: 'Action Verbs', priority: 'high', icon: '⚡', tip: 'Begin every bullet with a strong action verb to immediately show impact.', example: '"Led a team of 5 engineers" or "Reduced load time by 40%"' });
  if (quantScore < 8)
    tips.push({ category: 'Quantified Impact', priority: 'medium', icon: '📊', tip: 'Add numbers and metrics to experience bullets. Recruiters respond to measurable results.', example: '"Grew revenue by 30%" or "Served 50K+ daily users"' });
  if (!personal?.summary || personal.summary.length < 50)
    tips.push({ category: 'Summary', priority: 'medium', icon: '📝', tip: 'Add a 2–3 sentence professional summary. It\'s the first thing a recruiter reads.', example: '"Full-stack engineer with 3+ years building scalable React/Node.js applications…"' });
  if (!personal?.linkedin)
    tips.push({ category: 'LinkedIn', priority: 'low', icon: '🔗', tip: 'Add your LinkedIn URL. 87% of recruiters use LinkedIn to verify candidates.' });
  if (!(languages || []).length)
    tips.push({ category: 'Languages', priority: 'low', icon: '🌐', tip: 'Adding languages (even "English – Fluent") boosts your profile, especially for multinational companies.' });

  return {
    score: total, grade, gradeColor,
    breakdown: { keywords: keywordScore, actionVerbs: verbScore, quantified: quantScore, sections: sectionScore, contact: contactScore },
    tips,
    techFound:  techFound.slice(0, 30),
    verbsFound: verbsFound.slice(0, 10),
    aiPowered:  false,
    aiSummary:  null,
  };
}

// ─── GEMINI AI SCORING ENGINE ─────────────────────────────────────────────────

async function scoreWithGemini(resume) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('No API key');

  const resumeText = buildPrivacySafeText(resume);

  const prompt = `
You are an expert ATS (Applicant Tracking System) analyst and career coach. Analyze the following resume content and return a JSON response ONLY. Do not add any text before or after the JSON.

Resume Content:
${resumeText}

Return this exact JSON structure:
{
  "score": <number between 0-100>,
  "grade": "<one of: Excellent 🏆 | Good ✅ | Needs Work ⚠️ | Poor ❌>",
  "gradeColor": "<one of: #10b981 | #22c55e | #eab308 | #ef4444>",
  "breakdown": {
    "keywords": <0-40>,
    "actionVerbs": <0-20>,
    "quantified": <0-15>,
    "sections": <0-15>,
    "contact": <0-10>
  },
  "aiSummary": "<2-3 sentence professional verdict on this resume's ATS readiness>",
  "tips": [
    {
      "category": "<category name>",
      "priority": "<high | medium | low>",
      "icon": "<emoji>",
      "tip": "<actionable specific advice>",
      "example": "<optional example string or null>"
    }
  ]
}

Rules:
- score must equal sum of all breakdown values
- grade: Excellent if score>=85, Good if >=70, Needs Work if >=50, else Poor
- gradeColor must match the grade
- Give 3-6 specific, actionable tips based on the actual content
- aiSummary should be honest and specific to this resume
`;

  // Direct REST API call — v1 endpoint, no SDK needed
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error ${response.status}: ${err?.error?.message || 'unknown'}`);
  }

  const data   = await response.json();
  const text   = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

  // Strip markdown code fences if Gemini wraps in ```json ... ```
  const cleaned  = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed   = JSON.parse(cleaned);

  return {
    ...parsed,
    techFound:  [],
    verbsFound: [],
    aiPowered:  true,
  };
}

// ─── MAIN EXPORT: Hybrid Engine ───────────────────────────────────────────────

/**
 * scoreResume(resume) — Public API
 *
 * Tries Gemini AI first. On any failure (rate limit, network, parse error),
 * silently falls back to the local rule-based engine.
 *
 * Returns an object with:
 *   score, grade, gradeColor, breakdown, tips,
 *   aiPowered (boolean), aiSummary (string | null)
 */
export async function scoreResume(resume) {
  try {
    const aiResult = await scoreWithGemini(resume);
    return aiResult;
  } catch (err) {
    // Silent fallback — user never sees this error
    console.warn('[ATS Engine] Gemini unavailable, using local engine:', err?.message || err);
    return scoreLocal(resume);
  }
}
