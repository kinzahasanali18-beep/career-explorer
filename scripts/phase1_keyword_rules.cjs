// scripts/phase1_keyword_rules.cjs
//
// The industry keyword rules from the Phase 1 audit, extracted so that later
// passes can reuse them instead of restating them. Phase 1 uses them forwards
// (does the title's keyword contradict the assigned industry?); the demotion
// cleanup uses them backwards (is there any keyword evidence in this career for
// the industry we are about to keep?).
//
// Single source of truth — editing a keyword here changes both.

const HC = "Healthcare & Medicine";
const TECH = "Tech & Engineering";
const ARTS = "Arts & Performance";
const LAW = "Law & Government";
const DESIGN = "Design & Creative";
const SCI = "Science & Research";
const EDU = "Education & Coaching";
const SPORT = "Sports & Fitness";
const FOOD = "Food & Culinary";
const AVI = "Aviation & Transportation";
const CYBER = "Cybersecurity";
const GAME = "Gaming & Esports";
const MKT = "Marketing & Communications";
const MEDIA = "Media & Journalism";
const FIN = "Business & Finance";
const ARCH = "Architecture & Urban Planning";
const SUPPLY = "Supply Chain & Operations";
const ENV = "Environment & Sustainability";
const SOCIAL = "Social Impact & Nonprofit";
const FASHION = "Fashion & Beauty";
const HOSP = "Hospitality & Events";

const RULES = [
  // ── Healthcare & Medicine ──
  { kw: "Psychiatrist", ok: [HC], w: 10 },
  { kw: "Physician", ok: [HC], w: 10 },
  { kw: "Nurse", ok: [HC], w: 10 },
  { kw: "Surgeon", ok: [HC], w: 10 },
  { kw: "Dentist", ok: [HC], w: 10 },
  { kw: "Pharmacist", ok: [HC], w: 10 },
  { kw: "Pharmacy", ok: [HC], w: 8 },
  { kw: "Radiologist", ok: [HC], w: 10 },
  { kw: "Paramedic", ok: [HC], w: 10 },
  { kw: "Midwife", ok: [HC], w: 10 },
  { kw: "Veterinarian", ok: [HC, SCI], w: 10 },
  { kw: "Epidemiologist", ok: [HC, SCI], w: 10 },
  { kw: "Anesthesiologist", ok: [HC], w: 10 },
  { kw: "Pediatric", ok: [HC], w: 8 },
  { kw: "Oncology", ok: [HC], w: 8 },
  { kw: "Cardiac", ok: [HC], w: 8 },
  { kw: "Therapist", ok: [HC, SPORT, EDU, SOCIAL], w: 8 },
  { kw: "Therapy", ok: [HC, SPORT, EDU, SOCIAL], w: 5 },
  { kw: "Clinical", ok: [HC, SCI], w: 5 },
  { kw: "Medical", ok: [HC, SCI], w: 5 },
  { kw: "Patient", ok: [HC], w: 3 },
  { kw: "Counselor", ok: [HC, EDU, SOCIAL, LAW], w: 5 },
  { kw: "Diagnosis", ok: [HC], w: 5 },
  { kw: "Hospital", ok: [HC], w: 5 },

  // ── Tech & Engineering / Cybersecurity ──
  { kw: "Software", ok: [TECH, GAME, CYBER], w: 8 },
  { kw: "Developer", ok: [TECH, GAME, CYBER, MEDIA], w: 8 },
  { kw: "Programmer", ok: [TECH, GAME], w: 8 },
  { kw: "DevOps", ok: [TECH, CYBER], w: 10 },
  { kw: "Backend", ok: [TECH, GAME], w: 10 },
  { kw: "Frontend", ok: [TECH, GAME], w: 10 },
  { kw: "Full-Stack", ok: [TECH, GAME], w: 10 },
  { kw: "Cloud", ok: [TECH, CYBER], w: 5 },
  { kw: "Database", ok: [TECH, CYBER], w: 5 },
  { kw: "Machine Learning", ok: [TECH, SCI], w: 10 },
  { kw: "Data Scientist", ok: [TECH, SCI], w: 10 },
  { kw: "Algorithm", ok: [TECH, SCI, GAME], w: 5 },
  { kw: "API", ok: [TECH, GAME], w: 5 },
  // "Engineer"/"Systems"/"IT" only count with tech-adjacent context nearby.
  { kw: "Engineer", ok: [TECH, CYBER, GAME], w: 3,
    ctx: /\b(software|code|coding|cloud|data|platform|backend|frontend|devops|api|server|network|database|machine learning|programming|application|web|digital|computing|firmware|embedded)\b/i },
  { kw: "Systems", ok: [TECH, CYBER, SUPPLY], w: 3,
    ctx: /\b(software|code|cloud|data|platform|server|network|database|computing|digital|it infrastructure)\b/i },
  { kw: "IT", ok: [TECH, CYBER], w: 3,
    ctx: /\b(software|network|server|helpdesk|infrastructure|support|systems|hardware|computing)\b/i },
  { kw: "Cybersecurity", ok: [CYBER, TECH], w: 10 },
  { kw: "Penetration Test", stem: true, ok: [CYBER, TECH], w: 10 },
  { kw: "Malware", ok: [CYBER, TECH], w: 10 },
  { kw: "Encryption", ok: [CYBER, TECH], w: 8 },

  // ── Arts & Performance ──
  { kw: "Auctioneer", ok: [ARTS, FIN], w: 10 },
  { kw: "Musician", ok: [ARTS], w: 10 },
  { kw: "Performer", ok: [ARTS, SPORT], w: 10 },
  { kw: "Organ Builder", ok: [ARTS], w: 10 },
  { kw: "Sound Designer", ok: [ARTS, MEDIA, GAME], w: 10 },
  { kw: "Choreographer", ok: [ARTS], w: 10 },
  { kw: "Dancer", ok: [ARTS, SPORT], w: 10 },
  { kw: "Actor", ok: [ARTS, MEDIA], w: 10 },
  { kw: "Composer", ok: [ARTS, MEDIA, GAME], w: 10 },
  { kw: "Sculptor", ok: [ARTS], w: 10 },
  { kw: "Painter", ok: [ARTS], w: 8 },
  { kw: "Orchestra", ok: [ARTS], w: 10 },
  { kw: "Theatre", ok: [ARTS], w: 8 },
  { kw: "Theater", ok: [ARTS], w: 8 },
  { kw: "Luthier", ok: [ARTS], w: 10 },

  // ── Law & Government ──
  { kw: "Compliance", ok: [LAW, FIN, HC, CYBER, ENV, SUPPLY], w: 5 },
  { kw: "Legal", ok: [LAW, FIN], w: 8 },
  { kw: "Attorney", ok: [LAW], w: 10 },
  { kw: "Lawyer", ok: [LAW], w: 10 },
  { kw: "Paralegal", ok: [LAW], w: 10 },
  { kw: "Immigration", ok: [LAW, SOCIAL], w: 8 },
  { kw: "Inspector", ok: [LAW, ENV, ARCH, SUPPLY, FOOD, AVI], w: 5 },
  { kw: "Judiciary", stem: true, ok: [LAW], w: 10 },
  { kw: "Prosecutor", ok: [LAW], w: 10 },
  { kw: "Policy Analyst", ok: [LAW, SOCIAL, ENV], w: 8 },
  { kw: "Regulatory", stem: true, ok: [LAW, HC, FIN, ENV], w: 5 },

  // ── Design & Creative / Fashion ──
  { kw: "Graphic Design", stem: true, ok: [DESIGN, MKT, MEDIA], w: 10 },
  { kw: "UX", ok: [DESIGN, TECH, GAME], w: 10 },
  { kw: "UI Design", stem: true, ok: [DESIGN, TECH, GAME], w: 10 },
  { kw: "Illustrator", ok: [DESIGN, ARTS, MEDIA], w: 8 },
  { kw: "Typograph", stem: true, ok: [DESIGN, ARTS], w: 10 },
  { kw: "Fashion", ok: [FASHION, DESIGN, ARTS], w: 8 },
  { kw: "Cosmetolog", stem: true, ok: [FASHION, HC], w: 10 },
  { kw: "Makeup", ok: [FASHION, ARTS, MEDIA], w: 8 },
  { kw: "Hairstylist", ok: [FASHION], w: 10 },
  { kw: "Barber", ok: [FASHION], w: 10 },
  { kw: "Manicurist", ok: [FASHION], w: 10 },

  // ── Architecture & Urban Planning ──
  { kw: "Architect", ok: [ARCH, TECH, DESIGN], w: 8 },
  { kw: "Urban Plan", stem: true, ok: [ARCH, ENV, LAW], w: 10 },
  { kw: "Surveyor", ok: [ARCH, ENV, SUPPLY], w: 8 },
  { kw: "Landscape Architect", ok: [ARCH, ENV, DESIGN], w: 10 },

  // ── Aviation & Transportation ──
  { kw: "Pilot", ok: [AVI, SPORT], w: 10 },
  { kw: "Aviation", ok: [AVI], w: 10 },
  { kw: "Aircraft", ok: [AVI], w: 10 },
  { kw: "Air Traffic", ok: [AVI], w: 10 },
  { kw: "Aerospace", ok: [AVI, TECH, SCI], w: 8 },
  { kw: "Locomotive", ok: [AVI, SUPPLY], w: 10 },
  { kw: "Maritime", ok: [AVI, SUPPLY, ENV], w: 8 },

  // ── Food & Culinary ──
  { kw: "Chef", ok: [FOOD, HOSP], w: 10 },
  { kw: "Culinary", ok: [FOOD, HOSP], w: 10 },
  { kw: "Baker", ok: [FOOD], w: 10 },
  { kw: "Bakery", ok: [FOOD], w: 10 },
  { kw: "Sommelier", ok: [FOOD, HOSP], w: 10 },
  { kw: "Butcher", ok: [FOOD, SUPPLY], w: 10 },
  { kw: "Barista", ok: [FOOD, HOSP], w: 10 },
  { kw: "Brewer", ok: [FOOD], w: 10 },
  { kw: "Brewery", ok: [FOOD], w: 10 },

  // ── Sports & Fitness ──
  { kw: "Athletic", ok: [SPORT, HC, EDU], w: 8 },
  { kw: "Coach", ok: [SPORT, EDU, FIN, SOCIAL], w: 5 },
  { kw: "Fitness", ok: [SPORT, HC], w: 8 },
  { kw: "Personal Trainer", ok: [SPORT, HC], w: 10 },
  { kw: "Referee", ok: [SPORT], w: 10 },

  // ── Gaming & Esports ──
  { kw: "Esports", ok: [GAME, SPORT, MEDIA], w: 10 },
  { kw: "Game Design", stem: true, ok: [GAME, DESIGN, TECH], w: 10 },
  { kw: "Level Designer", ok: [GAME, DESIGN], w: 10 },

  // ── Media & Journalism ──
  { kw: "Journalist", ok: [MEDIA], w: 10 },
  { kw: "Reporter", ok: [MEDIA], w: 10 },
  { kw: "Editor", ok: [MEDIA, DESIGN, ARTS, MKT], w: 5 },
  { kw: "Broadcast", ok: [MEDIA, ARTS], w: 8 },
  { kw: "Podcast", ok: [MEDIA, ARTS, MKT], w: 8 },
  { kw: "Cinematograph", stem: true, ok: [MEDIA, ARTS], w: 10 },
  { kw: "Videographer", ok: [MEDIA, ARTS, MKT], w: 8 },

  // ── Marketing & Communications ──
  { kw: "Marketing", ok: [MKT, FIN, MEDIA], w: 8 },
  { kw: "Brand Strateg", stem: true, ok: [MKT, FIN, DESIGN], w: 10 },
  { kw: "SEO", ok: [MKT, TECH, MEDIA], w: 10 },
  { kw: "Public Relations", ok: [MKT, MEDIA, SOCIAL], w: 10 },
  { kw: "Advertising", ok: [MKT, MEDIA, DESIGN], w: 8 },
  { kw: "Copywriter", ok: [MKT, MEDIA, DESIGN], w: 8 },

  // ── Business & Finance ──
  { kw: "Accountant", ok: [FIN], w: 10 },
  { kw: "Actuary", ok: [FIN, SCI], w: 10 },
  { kw: "Auditor", ok: [FIN, LAW], w: 8 },
  { kw: "Investment", ok: [FIN], w: 8 },
  { kw: "Underwriter", ok: [FIN], w: 10 },
  { kw: "Bookkeep", stem: true, ok: [FIN], w: 10 },
  { kw: "Financial Analyst", ok: [FIN], w: 10 },

  // ── Science & Research ──
  { kw: "Biologist", ok: [SCI, ENV, HC], w: 10 },
  { kw: "Chemist", ok: [SCI, HC, ENV], w: 10 },
  { kw: "Physicist", ok: [SCI, TECH], w: 10 },
  { kw: "Geologist", ok: [SCI, ENV], w: 10 },
  { kw: "Astronomer", ok: [SCI], w: 10 },
  { kw: "Laboratory", ok: [SCI, HC], w: 5 },
  { kw: "Microbiolog", stem: true, ok: [SCI, HC, ENV], w: 10 },

  // ── Environment & Sustainability ──
  { kw: "Sustainability", ok: [ENV, FIN, SUPPLY, ARCH], w: 8 },
  { kw: "Conservation", ok: [ENV, SCI, SOCIAL], w: 8 },
  { kw: "Renewable", ok: [ENV, TECH], w: 8 },
  { kw: "Ecolog", stem: true, ok: [ENV, SCI], w: 8 },
  { kw: "Forestry", ok: [ENV, SCI, SUPPLY], w: 10 },

  // ── Education & Coaching ──
  { kw: "Teacher", ok: [EDU], w: 10 },
  { kw: "Professor", ok: [EDU, SCI], w: 10 },
  { kw: "Curriculum", ok: [EDU], w: 8 },
  { kw: "Tutor", ok: [EDU], w: 10 },
  { kw: "Instructional Design", stem: true, ok: [EDU, DESIGN, TECH], w: 10 },

  // ── Social Impact & Nonprofit ──
  { kw: "Nonprofit", ok: [SOCIAL, FIN], w: 8 },
  { kw: "Social Worker", ok: [SOCIAL, HC, EDU], w: 10 },
  { kw: "Philanthrop", stem: true, ok: [SOCIAL, FIN], w: 8 },
  { kw: "Humanitarian", ok: [SOCIAL, HC], w: 8 },

  // ── Supply Chain & Operations ──
  { kw: "Logistics", ok: [SUPPLY, AVI], w: 8 },
  { kw: "Warehouse", ok: [SUPPLY], w: 8 },
  { kw: "Procurement", ok: [SUPPLY, FIN], w: 8 },
  { kw: "Inventory", ok: [SUPPLY, FIN], w: 5 },
  { kw: "Supply Chain", ok: [SUPPLY], w: 10 },

  // ── Hospitality & Events ──
  { kw: "Hotel", ok: [HOSP], w: 10 },
  { kw: "Event Planner", ok: [HOSP, MKT], w: 10 },
  { kw: "Concierge", ok: [HOSP], w: 10 },
  { kw: "Tourism", ok: [HOSP, AVI, ENV], w: 8 },
];

// Industry -> the keywords that would support it, inverted from RULES above.
const KEYWORDS_BY_INDUSTRY = new Map();
for (const r of RULES) {
  for (const ind of r.ok) {
    if (!KEYWORDS_BY_INDUSTRY.has(ind)) KEYWORDS_BY_INDUSTRY.set(ind, []);
    KEYWORDS_BY_INDUSTRY.get(ind).push(r);
  }
}

/**
 * Compile a rule's matcher. Kept here so every pass matches identically.
 *
 * Default is whole-word with an optional plural — `\bCoach(?:e?s)?\b` — which is
 * what stops "Orchestra" firing on "orchestrating" and "Patient" on "patiently".
 * Rules wanting prefix matching (Cosmetolog -> cosmetologist/cosmetology) set
 * `stem: true`. All-caps keywords match case-SENSITIVELY, because a
 * case-insensitive `\bIT\b` hits the pronoun "it".
 */
function compileRule(r) {
  const esc = r.kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const body = r.stem ? `\\b${esc}` : `\\b${esc}(?:e?s)?\\b`;
  return new RegExp(body, /^[A-Z]+$/.test(r.kw) ? "" : "i");
}

function compileRules(rules = RULES) {
  for (const r of rules) if (!r.re) r.re = compileRule(r);
  return rules;
}

module.exports = { RULES, KEYWORDS_BY_INDUSTRY, compileRule, compileRules };
