// scripts/daily_add_careers.cjs
// Runs daily via GitHub Actions.
// 1. Fetches all existing career names from Supabase
// 2. Generates 100 new unique careers via Claude
// 3. For each career, generates ALL fields in one Claude call
// 4. Pushes complete records to Supabase

const SUPABASE_URL = process.env.SUPABASE_URL || "https://qywesurzzunxdduvyquy.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const AK           = process.env.ANTHROPIC_KEY;

if (!SUPABASE_KEY || !AK) {
  console.error("❌ Missing SUPABASE_SERVICE_KEY or ANTHROPIC_KEY environment variables.");
  process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const TARGET = 100; // careers to add per run

// ─── Constants ───────────────────────────────────────────────────────────────

// Must stay in sync with INDUSTRY_CONFIG in src/App.jsx, which is what the app
// actually renders and filters by. This list previously held only 15 of the 22,
// so seven industries could never be assigned to a new career: Architecture &
// Urban Planning, Aviation & Transportation, Cybersecurity, Food & Culinary,
// Gaming & Esports, Marketing & Communications and Supply Chain & Operations.
// Those seven app filters were frozen — every row in them was legacy import
// data — and careers belonging to them were either collapsed into a neighbour
// or dropped entirely.
//
// The vocabulary is still duplicated across App.jsx, CareerTimeline.jsx,
// WhenToApply.jsx, ProfilePage.jsx, OnboardingQuiz.jsx and here. Unifying it
// behind one shared module is the proper fix (audit finding #16); until then,
// changes here need mirroring there.
const VALID_INDUSTRIES = [
  "Arts & Performance", "Business & Finance", "Design & Creative",
  "Education & Coaching", "Entrepreneurship", "Environment & Sustainability",
  "Fashion & Beauty", "Healthcare & Medicine", "Hospitality & Events",
  "Law & Government", "Media & Journalism", "Science & Research",
  "Social Impact & Nonprofit", "Sports & Fitness", "Tech & Engineering",
  "Architecture & Urban Planning", "Aviation & Transportation", "Cybersecurity",
  "Food & Culinary", "Gaming & Esports", "Marketing & Communications",
  "Supply Chain & Operations",
];

// Maps sub-industry names the model might use -> a valid industry.
// Grouped by target so gaps and mis-targets are visible. Several entries used to
// collapse into the wrong industry because the target did not exist in
// VALID_INDUSTRIES: cybersecurity -> Tech, architecture -> Design, marketing ->
// Media & Journalism, supply chain/logistics -> Business & Finance. Those now
// point at their real industries.
const INDUSTRY_MAP = {
  // Tech & Engineering
  "software engineering":"Tech & Engineering","information technology":"Tech & Engineering",
  "data science":"Tech & Engineering","artificial intelligence":"Tech & Engineering",
  "ai/ml":"Tech & Engineering","cloud computing":"Tech & Engineering",
  "devops":"Tech & Engineering","robotics":"Tech & Engineering",
  "quantum computing":"Tech & Engineering","fintech":"Tech & Engineering",
  "blockchain":"Tech & Engineering","web development":"Tech & Engineering",
  "telecommunications":"Tech & Engineering","engineering":"Tech & Engineering",
  // Cybersecurity  (was collapsed into Tech & Engineering)
  "cybersecurity":"Cybersecurity","information security":"Cybersecurity",
  "infosec":"Cybersecurity","network security":"Cybersecurity",
  // Healthcare & Medicine
  "healthcare":"Healthcare & Medicine","medicine":"Healthcare & Medicine",
  "medical":"Healthcare & Medicine","nursing":"Healthcare & Medicine",
  "mental health":"Healthcare & Medicine","public health":"Healthcare & Medicine",
  "dentistry":"Healthcare & Medicine","pharmacy":"Healthcare & Medicine",
  "optometry":"Healthcare & Medicine","physical therapy":"Healthcare & Medicine",
  "veterinary":"Healthcare & Medicine","veterinary medicine":"Healthcare & Medicine",
  "allied health":"Healthcare & Medicine","nutrition":"Healthcare & Medicine",
  // Business & Finance
  "finance":"Business & Finance","banking":"Business & Finance",
  "insurance":"Business & Finance","accounting":"Business & Finance",
  "real estate":"Business & Finance","investment":"Business & Finance",
  "actuarial science":"Business & Finance","economics":"Business & Finance",
  "financial services":"Business & Finance","business":"Business & Finance",
  "human resources":"Business & Finance","management":"Business & Finance",
  "consulting":"Business & Finance",
  // Supply Chain & Operations  (was collapsed into Business & Finance)
  "supply chain":"Supply Chain & Operations","logistics":"Supply Chain & Operations",
  "operations":"Supply Chain & Operations","procurement":"Supply Chain & Operations",
  "warehousing":"Supply Chain & Operations","manufacturing":"Supply Chain & Operations",
  // Education & Coaching
  "education":"Education & Coaching","coaching":"Education & Coaching",
  "training":"Education & Coaching","teaching":"Education & Coaching",
  "instructional design":"Education & Coaching","e-learning":"Education & Coaching",
  "higher education":"Education & Coaching",
  // Arts & Performance
  "arts":"Arts & Performance","performing arts":"Arts & Performance",
  "theater":"Arts & Performance","music":"Arts & Performance",
  "music production":"Arts & Performance","film":"Arts & Performance",
  "television":"Arts & Performance","dance":"Arts & Performance",
  "visual arts":"Arts & Performance",
  // Design & Creative
  "design":"Design & Creative","graphic design":"Design & Creative",
  "ux/ui":"Design & Creative","ux":"Design & Creative","user experience":"Design & Creative",
  "interior design":"Design & Creative","photography":"Design & Creative",
  "animation":"Design & Creative","industrial design":"Design & Creative",
  "product design":"Design & Creative",
  // Architecture & Urban Planning  (was collapsed into Design & Creative)
  "architecture":"Architecture & Urban Planning","urban planning":"Architecture & Urban Planning",
  "urban design":"Architecture & Urban Planning","landscape architecture":"Architecture & Urban Planning",
  "built environment":"Architecture & Urban Planning",
  // Gaming & Esports  (was collapsed into Tech & Engineering)
  "gaming":"Gaming & Esports","esports":"Gaming & Esports",
  "game development":"Gaming & Esports","game design":"Gaming & Esports",
  "video games":"Gaming & Esports",
  // Aviation & Transportation
  "aviation":"Aviation & Transportation","transportation":"Aviation & Transportation",
  "airline":"Aviation & Transportation","aeronautics":"Aviation & Transportation",
  "maritime":"Aviation & Transportation",
  // Food & Culinary  (was collapsed into Hospitality & Events)
  "food":"Food & Culinary","culinary":"Food & Culinary","culinary arts":"Food & Culinary",
  "food service":"Food & Culinary","food science":"Food & Culinary","beverage":"Food & Culinary",
  // Marketing & Communications  (was collapsed into Media & Journalism)
  "marketing":"Marketing & Communications","advertising":"Marketing & Communications",
  "public relations":"Marketing & Communications","communications":"Marketing & Communications",
  "branding":"Marketing & Communications","brand strategy":"Marketing & Communications",
  // Media & Journalism
  "media":"Media & Journalism","journalism":"Media & Journalism",
  "social media":"Media & Journalism","broadcasting":"Media & Journalism",
  "publishing":"Media & Journalism","content creation":"Media & Journalism",
  // Entrepreneurship
  "entrepreneurship":"Entrepreneurship","startup":"Entrepreneurship",
  "venture capital":"Entrepreneurship","small business":"Entrepreneurship",
  // Environment & Sustainability
  "environment":"Environment & Sustainability","environmental":"Environment & Sustainability",
  "sustainability":"Environment & Sustainability","agriculture":"Environment & Sustainability",
  "marine biology":"Environment & Sustainability","forestry":"Environment & Sustainability",
  "conservation":"Environment & Sustainability","ecology":"Environment & Sustainability",
  "renewable energy":"Environment & Sustainability","energy":"Environment & Sustainability",
  // Fashion & Beauty
  "fashion":"Fashion & Beauty","beauty":"Fashion & Beauty","cosmetics":"Fashion & Beauty",
  // Law & Government
  "law":"Law & Government","legal":"Law & Government","government":"Law & Government",
  "public policy":"Law & Government","military":"Law & Government",
  "criminal justice":"Law & Government","politics":"Law & Government",
  "political science":"Law & Government",
  // Science & Research
  "science":"Science & Research","research":"Science & Research",
  "biology":"Science & Research","chemistry":"Science & Research",
  "physics":"Science & Research","biotech":"Science & Research",
  "biotechnology":"Science & Research","neuroscience":"Science & Research",
  "aerospace":"Science & Research","space technology":"Science & Research",
  "materials science":"Science & Research",
  // Social Impact & Nonprofit
  "social work":"Social Impact & Nonprofit","nonprofit":"Social Impact & Nonprofit",
  "social impact":"Social Impact & Nonprofit","social services":"Social Impact & Nonprofit",
  "community development":"Social Impact & Nonprofit",
  // Hospitality & Events
  "hospitality":"Hospitality & Events","events":"Hospitality & Events",
  "tourism":"Hospitality & Events","hotel management":"Hospitality & Events",
  "event planning":"Hospitality & Events",
  // Sports & Fitness
  "sports":"Sports & Fitness","fitness":"Sports & Fitness",
  "sports management":"Sports & Fitness","recreation":"Sports & Fitness",
  "athletics":"Sports & Fitness","exercise science":"Sports & Fitness",
  "martial arts":"Sports & Fitness",
};

// ─── Industry resolution ─────────────────────────────────────────────────────
//
// The previous implementation fell back to `lower.includes(key)` over an
// insertion-ordered map, so any alias appearing anywhere inside the input won.
// Combined with the alias "it" -> Tech & Engineering, that made "Hospitality
// Management", "Digital Marketing" and "Political Science" all resolve to
// Tech & Engineering. Even with "it" removed, bare substring matching still
// collides: "ux" matches inside "luxury", "law" inside "lawn", "arts" inside
// "martial arts". This is the same defect class as the technology "architect"
// titles that had to be repaired by hand.
//
// Now: case-insensitive exact match, then whole-word alias matching with the
// longest alias winning, so "social media" beats "media" and "culinary arts"
// beats "arts". Aliases shorter than 4 characters are only ever matched exactly.
// Anything unresolved returns null, and the caller logs it rather than the value
// being quietly forced into a neighbouring industry.

const VALID_BY_LOWER = new Map(VALID_INDUSTRIES.map(i => [i.toLowerCase(), i]));
const ALIASES_LONGEST_FIRST = Object.keys(INDUSTRY_MAP).sort((a, b) => b.length - a.length);

function normIndustry(s) {
  return String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").replace(/[.,;:]+$/, "").trim();
}

function mapIndustry(raw) {
  const s = normIndustry(raw);
  if (!s) return null;
  if (VALID_BY_LOWER.has(s)) return VALID_BY_LOWER.get(s);
  if (INDUSTRY_MAP[s]) return INDUSTRY_MAP[s];
  for (const key of ALIASES_LONGEST_FIRST) {
    if (key.length < 4) continue;
    const esc = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Explicit boundaries rather than \b: some aliases contain "/" ("ux/ui"),
    // where \b semantics are surprising.
    if (new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`).test(s)) return INDUSTRY_MAP[key];
  }
  return null;
}

// All valid salary_range single-select values (em dash –)
const SALARY_OPTIONS = [
  "$0\u2013$500k+","$0\u2013$500k+ (returns vary)","$100k\u2013$180k","$100k\u2013$200k",
  "$120k\u2013$175k","$20k\u2013$150k","$25k\u2013$80k","$28k\u2013$50k","$28k\u2013$55k",
  "$30k\u2013$100k","$30k\u2013$200k+","$30k\u2013$45k","$30k\u2013$50k","$30k\u2013$55k",
  "$30k\u2013$60k","$30k\u2013$65k","$30k\u2013$70k","$30k\u2013$75k","$30k\u2013$80k",
  "$32k\u2013$52k","$32k\u2013$55k","$32k\u2013$65k","$35k\u2013$200k","$35k\u2013$50k",
  "$35k\u2013$55k","$35k\u2013$60k","$35k\u2013$65k","$35k\u2013$70k","$35k\u2013$75k",
  "$35k\u2013$80k","$35k\u2013$85k","$35k\u2013$90k","$37k\u2013$63k","$38k\u2013$52k",
  "$38k\u2013$56k","$38k\u2013$58k","$38k\u2013$60k","$38k\u2013$95k","$40k\u2013$100k",
  "$40k\u2013$120k","$40k\u2013$55k","$40k\u2013$58k","$40k\u2013$60k","$40k\u2013$65k",
  "$40k\u2013$70k","$40k\u2013$75k","$40k\u2013$85k","$42k\u2013$62k","$42k\u2013$65k",
  "$42k\u2013$70k","$42k\u2013$72k","$42k\u2013$78k","$42k\u2013$85k","$45k\u2013$100k",
  "$45k\u2013$105k","$45k\u2013$120k","$45k\u2013$150k","$45k\u2013$65k","$45k\u2013$68k",
  "$45k\u2013$70k","$45k\u2013$72k","$45k\u2013$75k","$45k\u2013$80k","$45k\u2013$85k",
  "$45k\u2013$90k","$45k\u2013$95k","$46k\u2013$78k","$48k\u2013$72k","$48k\u2013$77k",
  "$48k\u2013$82k","$48k\u2013$85k","$50k\u2013$100k","$50k\u2013$110k","$50k\u2013$150k",
  "$50k\u2013$200k+","$50k\u2013$72k","$50k\u2013$75k","$50k\u2013$78k","$50k\u2013$80k",
  "$50k\u2013$85k","$50k\u2013$90k","$50k\u2013$95k","$52k\u2013$72k","$52k\u2013$75k",
  "$52k\u2013$77k","$52k\u2013$78k","$52k\u2013$80k","$52k\u2013$85k","$52k\u2013$90k",
  "$52k\u2013$95k","$55k\u2013$100k","$55k\u2013$105k","$55k\u2013$110k","$55k\u2013$115k",
  "$55k\u2013$120k","$55k\u2013$130k","$55k\u2013$85k","$55k\u2013$90k","$55k\u2013$95k",
  "$58k\u2013$100k","$58k\u2013$105k","$58k\u2013$95k","$60k\u2013$100k","$60k\u2013$105k",
  "$60k\u2013$110k","$60k\u2013$120k","$60k\u2013$125k","$60k\u2013$130k","$60k\u2013$85k",
  "$60k\u2013$95k","$62k\u2013$115k","$62k\u2013$98k","$65k\u2013$100k","$65k\u2013$110k",
  "$65k\u2013$115k","$65k\u2013$120k","$65k\u2013$125k","$65k\u2013$130k","$65k\u2013$140k",
  "$65k\u2013$150k","$68k\u2013$110k","$70k\u2013$100k","$70k\u2013$115k","$70k\u2013$120k",
  "$70k\u2013$125k","$70k\u2013$130k","$70k\u2013$140k","$70k\u2013$145k","$70k\u2013$150k",
  "$70k\u2013$95k","$75k\u2013$120k","$75k\u2013$140k","$75k\u2013$98k","$77k\u2013$153k",
  "$78k\u2013$126k","$80k\u2013$130k","$80k\u2013$150k","$80k\u2013$160k","$82k\u2013$102k",
  "$82k\u2013$107k","$85k\u2013$150k","$85k\u2013$175k","$89k\u2013$107k","$90k\u2013$175k",
  "$95k\u2013$130k","$95k\u2013$150k","$95k\u2013$165k",
  // High bands. Without these the list topped out at a $120k floor, so any
  // genuinely high salary snapped to "$0\u2013$500k+" \u2014 swapping a wrong band for a
  // $0 floor. Physician/surgeon/specialist ranges need to be representable.
  "$130k\u2013$200k","$150k\u2013$250k","$180k\u2013$300k","$200k\u2013$350k",
  "$250k\u2013$450k","$300k\u2013$500k+",
];

// Parse one side of a salary range into thousands.
//
// The previous version required a literal "k" and returned 0 otherwise. That
// silently broke every salary the model wrote in full dollars \u2014 and since the
// model naturally writes high salaries that way ("$220,000"), both ends parsed
// to 0 and snapSalary picked the option nearest zero, which is "$30k\u2013$45k", the
// lowest-sum band in the list. That is why 154 careers, including
// Anesthesiologist and Cardiac Surgeon, carried the database's lowest salary.
//
// Now handles "$55k", "220k", "$220,000", "220000" and "$1.2M", and returns
// null (not 0) when there is no number at all, so callers can distinguish
// "unparseable" from a legitimate zero floor.
function parseK(s) {
  const t = String(s == null ? "" : s).replace(/,/g, "").trim();
  const m = t.match(/(\d+(?:\.\d+)?)\s*([kKmM])?/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const suffix = (m[2] || "").toLowerCase();
  if (suffix === "k") return Math.round(n);
  if (suffix === "m") return Math.round(n * 1000);
  // No suffix: >= 1000 is dollars, below that it is already thousands.
  return n >= 1000 ? Math.round(n / 1000) : Math.round(n);
}

// Snap a model-supplied range onto an allowed option.
// Returns null when the input cannot be parsed, so the caller can retry and
// then skip the career \u2014 previously an unparseable value was silently given a
// plausible-looking band, which is how bad data entered the table unnoticed.
function snapSalary(raw) {
  if (!raw) return null;
  const norm = String(raw).replace(/[-\u2013\u2014]/g, "\u2013").trim();
  if (SALARY_OPTIONS.includes(norm)) return norm;

  const parts = String(raw).split(/[-\u2013\u2014]/);
  const low = parseK(parts[0]);
  const high = parseK(parts[1] || "");
  if (low == null || high == null) return null;

  // A parsed floor above zero must never snap onto a $0-floor option: that is
  // how a $220k surgeon would land on "$0\u2013$500k+".
  const candidates = low > 0
    ? SALARY_OPTIONS.filter(opt => parseK(opt.split("\u2013")[0]) > 0)
    : SALARY_OPTIONS;

  let best = null, bestScore = Infinity;
  for (const opt of candidates) {
    const op = opt.split("\u2013");
    const score = Math.abs(parseK(op[0]) - low) + Math.abs(parseK(op[1] || "") - high);
    if (score < bestScore) { bestScore = score; best = opt; }
  }
  return best;
}

// ─── Source citation ─────────────────────────────────────────────────────────
//
// The prompt used to ask for a "Real URL from https://www.bls.gov/ooh/ or
// https://www.onetonline.org/link/summary/", and nothing checked the answer.
// 1,625 of 7,038 rows (23%) ended up with a conclusively broken citation: 639
// with O*NET SOC codes that do not exist, 986 with invented /ooh/<group>/ paths.
// Of the URLs citing bls.gov, 61% are broken.
//
// The model now returns only a SOC code. Everything else about the URL is
// constructed here, so the only thing it can get wrong is the code — and a code
// is checkable against the real taxonomy. bls.gov is dropped entirely: it cannot
// be validated from CI at all (403 to every scripted request) and accounted for
// most of the breakage. CareerOneStop, also a Department of Labor site, is keyed
// by the same SOC code and is what the app shows students.
const ONET_TAXONOMY_URL = "https://www.onetonline.org/find/all";
let validSocCodes = null;

async function loadSocTaxonomy() {
  const r = await fetch(ONET_TAXONOMY_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; sparq-career-generator)" },
  });
  if (!r.ok) throw new Error(`O*NET taxonomy fetch failed: HTTP ${r.status}`);
  const html = await r.text();
  const codes = new Set((html.match(/link\/summary\/(\d{2}-\d{4}\.\d{2})/g) || [])
    .map(m => m.replace("link/summary/", "")));
  if (codes.size < 900) throw new Error(`O*NET taxonomy looks wrong: only ${codes.size} codes parsed`);
  return codes;
}

function isValidSoc(code) {
  return validSocCodes ? validSocCodes.has(String(code || "").trim()) : false;
}

function onetUrlFor(code) {
  return `https://www.onetonline.org/link/summary/${String(code).trim()}`;
}

// ─── Duplicate detection ─────────────────────────────────────────────────────
//
// Deduplication used to compare raw lowercased names, which only ever caught
// character-identical titles. Everything that differs by a parenthetical
// qualifier, a hyphen or a plural slipped through, and the table accumulated
// 1,875 rows (27%) that collapse into 583 groups once normalised — 28 variants
// of "Fact Checker", 17 of "Social Media Manager", 17 of "Interaction Designer".
//
// Normalising strips parenthetical qualifiers, punctuation and trailing plurals
// so "Fact Checker (News Outlet)", "Fact-Checker (Journalism)" and "Fact
// Checkers" all reduce to "fact checker" and only the first survives.
function normalizeName(n) {
  const s = String(n == null ? "" : n)
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")     // drop "(News Outlet)" style qualifiers
    .replace(/[^a-z0-9]+/g, " ")    // punctuation and hyphens -> space
    .replace(/\s+/g, " ")
    .trim();
  // Crude de-pluralisation: enough for "Checkers" vs "Checker".
  return s.split(" ").map(w => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w)).join(" ");
}

// Split TARGET across industries: an even base share, with the remainder going
// to the least-populated industries first.
//
// The old prompt asked for "~6-7 careers per industry" in a single call and got
// nothing of the sort — the table ranges from 706 rows (Entrepreneurship) to 18
// (Architecture & Urban Planning). Allocating explicitly makes the spread a
// property of the code rather than a request the model may ignore.
function allocateQuotas(industries, countsByIndustry, target) {
  const base = Math.floor(target / industries.length);
  const quotas = new Map(industries.map(i => [i, base]));
  let remainder = target - base * industries.length;
  const smallestFirst = [...industries].sort(
    (a, b) => (countsByIndustry.get(a) || 0) - (countsByIndustry.get(b) || 0)
  );
  for (let i = 0; remainder > 0; i = (i + 1) % smallestFirst.length, remainder--) {
    quotas.set(smallestFirst[i], quotas.get(smallestFirst[i]) + 1);
  }
  return quotas;
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────

// Fetch every existing career's name AND industry. The industry is needed so
// each generation call can be shown the names that already exist in the industry
// it is generating for, rather than an arbitrary slice of the whole table.
//
// Note the explicit ORDER BY: paginating with LIMIT/OFFSET and no ordering has
// no stability guarantee in Postgres, so pages could silently overlap or skip
// rows — and a skipped name is a name that would pass the duplicate check.
async function fetchExistingCareers() {
  console.log("📋 Fetching existing careers...");
  const rows = [];
  const limit = 1000;
  let offset = 0;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/careers?select=name,primary_industry&order=id.asc&limit=${limit}&offset=${offset}`;
    const r = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
    });
    if (!r.ok) { console.error("Supabase error:", await r.text()); process.exit(1); }
    const data = await r.json();
    rows.push(...data.filter(row => row.name));
    if (data.length < limit) break;
    offset += limit;
  }

  console.log(`   ${rows.length} existing careers found.\n`);
  return rows;
}

async function createRecord(fields) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/careers`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(fields),
  });
  if (!r.ok) throw new Error("Supabase POST: " + await r.text());
}

// ─── Claude helpers ───────────────────────────────────────────────────────────

async function claude(prompt, maxTokens = 200) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": AK, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const d = await r.json();
  if (!r.ok) throw new Error("Claude API: " + d.error?.message);
  return d.content?.find(b => b.type === "text")?.text || "";
}

function parseJSON(text) {
  return JSON.parse(text.replace(/```json|```/gi, "").trim());
}

// ─── Step 1: Generate career names, one industry at a time ───────────────────
//
// Previously this was a single call for all 100 names, and the "do not duplicate
// these" list was truncated to the first 400 of 7,000+ names. The model was
// therefore blind to ~94% of the table, confidently proposed careers that
// already existed, and the (correct) duplicate check discarded them: the last
// run generated 105 names and kept 8. Yield fell from 37/day to 22/day as the
// table grew, because the visible fraction kept shrinking.
//
// Generating per industry lets each call see that industry's COMPLETE existing
// name list — 18 to 706 names, a few thousand tokens at worst — instead of an
// arbitrary slice of everything. It also makes the spread across industries
// explicit rather than a request the model may ignore.
async function generateNamesForIndustry(industry, existingInIndustry, count, rejectStats, seenNorm, allNorm) {
  // Ask for extra: some will be duplicates or unmappable.
  const ask = Math.max(count + 3, Math.ceil(count * 1.6));
  const avoid = existingInIndustry.length
    ? existingInIndustry.join(", ")
    : "(none yet — this industry is empty)";

  const text = await claude(`
You are building a career discovery database for students (ages 11-22).

Generate exactly ${ask} new career titles for the industry: "${industry}"

Careers ALREADY in this industry — do not repeat these, and do not produce a
variant that differs only by a parenthetical, a hyphen or a plural:
${avoid}

Rules:
- Every career must genuinely belong to "${industry}"
- Be specific ("Orthodontist" not "Doctor", "Site Reliability Engineer" not "Tech Worker")
- A qualifier in brackets does NOT make a career new: if "Fact Checker" exists,
  "Fact Checker (Sports)" is a duplicate. Propose a distinct job, not a variant.
- Favour emerging, overlooked and niche roles over obvious ones

Return ONLY a valid JSON array, no markdown:
[{"name":"Career Title"},...]
`, 2048);

  let proposed;
  try {
    proposed = parseJSON(text);
  } catch (e) {
    console.log(`   ⚠ ${industry}: unparseable response (${e.message})`);
    rejectStats.unparseable++;
    return [];
  }
  if (!Array.isArray(proposed)) { rejectStats.unparseable++; return []; }

  const accepted = [];
  for (const c of proposed) {
    if (accepted.length >= count) break;
    const name = (c && typeof c.name === "string" ? c.name : "").trim();
    if (!name) { rejectStats.empty++; continue; }
    const norm = normalizeName(name);
    if (!norm) { rejectStats.empty++; continue; }
    if (allNorm.has(norm)) { rejectStats.duplicateExisting++; continue; }
    if (seenNorm.has(norm)) { rejectStats.duplicateInRun++; continue; }
    seenNorm.add(norm);
    accepted.push({ name, primary_industry: industry });
  }
  rejectStats.proposed += proposed.length;
  return accepted;
}

// ─── Step 2: Generate all fields for one career in a single Claude call ───────

async function generateAllFields(name, primary) {
  const prompt = `You are filling a career database for students (ages 11-22).

Career: "${name}"
Primary industry: "${primary}"

Valid secondary industry values (use ONLY these, verbatim):
${VALID_INDUSTRIES.join(", ")}

Return ONLY valid JSON, no markdown or explanation:
{
  "description": "One punchy sentence starting with 'You' describing day-to-day work and impact. Be vivid and specific.",
  "traits": "3-4 personality traits comma-separated (e.g. Analytical,Creative,Detail-oriented)",
  "keywords": "4-5 lowercase work-style keywords comma-separated (e.g. data,independent,creative,fast-paced)",
  "salary_range": "Realistic US range like $55k-$90k (hyphen, not dash)",
  "soc_code": "The O*NET-SOC code of the closest matching occupation, exactly 8 digits in the form NN-NNNN.NN (e.g. 27-1027.00). Use a real code from the O*NET taxonomy. Do NOT invent detail suffixes like .01 unless that exact code exists. Return the code only, not a URL.",
  "secondary_industries": "1-2 other industries this career overlaps (comma-separated, from valid list, exclude primary)",
  "crossover_label": "Short crossover label like 'Tech + Health' or 'Design + Business'",
  "work_style": "Remote or Hybrid or In-person or Field-based",
  "schedule_type": "Traditional 9-5 or Flexible or Shift-based or Project-based or Autonomous",
  "work_environment": "Office or Lab or Studio or Outdoors or Travel-heavy or Varies",
  "degree_required": "Yes or No or Sometimes",
  "entry_level_friendly": "Yes or No",
  "requirements": "One sentence on education and certifications needed"
}`;

  const text = await claude(prompt, 700);
  const fields = parseJSON(text);

  // Snap salary to a valid option. Throwing on an unparseable value lets the
  // retry loop have another go and, failing that, skips the career — better a
  // visible gap than a row silently stamped with the wrong band.
  const raw = fields.salary_range;
  fields.salary_range = snapSalary(raw);
  if (!fields.salary_range) throw new Error(`unparseable salary_range: ${JSON.stringify(raw)}`);

  // Validate the SOC code against the real taxonomy and build the URL ourselves.
  // Retrying on a bad code is cheap; storing one is not — an unverifiable
  // citation shown to a student is worse than no career at all.
  const soc = String(fields.soc_code || "").trim();
  delete fields.soc_code;
  if (!/^\d{2}-\d{4}\.\d{2}$/.test(soc)) throw new Error(`malformed soc_code: ${JSON.stringify(soc)}`);
  if (!isValidSoc(soc)) throw new Error(`soc_code not in O*NET taxonomy: ${soc}`);
  fields.source_url = onetUrlFor(soc);

  // Validate secondary_industries
  const sec = (fields.secondary_industries || "")
    .split(",")
    .map(s => s.trim())
    .filter(s => VALID_INDUSTRIES.includes(s) && s !== primary);
  fields.secondary_industries = sec.join(",");

  return fields;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const startTime = Date.now();
  console.log(`\n🚀 Sparq Daily Career Generator — ${new Date().toISOString()}\n`);

  // Step 0: Load the O*NET taxonomy once. Every career's citation is validated
  // against it, so a failure here must stop the run rather than let a night's
  // worth of unverifiable sources through.
  console.log("📚 Loading O*NET-SOC taxonomy...");
  validSocCodes = await loadSocTaxonomy();
  console.log(`   ${validSocCodes.size} valid SOC codes.\n`);

  // Step 1: Fetch every existing career with its industry
  const existing = await fetchExistingCareers();
  const namesByIndustry = new Map(VALID_INDUSTRIES.map(i => [i, []]));
  for (const row of existing) {
    if (namesByIndustry.has(row.primary_industry)) namesByIndustry.get(row.primary_industry).push(row.name);
  }
  const countsByIndustry = new Map([...namesByIndustry].map(([i, n]) => [i, n.length]));
  // Every existing name, normalised — the duplicate check runs against all of it.
  const allNorm = new Set(existing.map(r => normalizeName(r.name)));

  // Step 2: Allocate the run across industries, then generate per industry so
  // each call sees that industry's complete existing name list.
  const quotas = allocateQuotas(VALID_INDUSTRIES, countsByIndustry, TARGET);
  const rejectStats = { proposed: 0, duplicateExisting: 0, duplicateInRun: 0, empty: 0, unparseable: 0 };
  const seenNorm = new Set();
  const perIndustry = [];
  const careers = [];

  console.log(`🤖 Generating names across ${VALID_INDUSTRIES.length} industries (target ${TARGET})...\n`);
  for (const industry of [...VALID_INDUSTRIES].sort(
    (a, b) => (countsByIndustry.get(a) || 0) - (countsByIndustry.get(b) || 0)
  )) {
    const quota = quotas.get(industry);
    if (!quota) continue;
    const got = await generateNamesForIndustry(
      industry, namesByIndustry.get(industry) || [], quota, rejectStats, seenNorm, allNorm
    );
    careers.push(...got);
    perIndustry.push({ industry, have: countsByIndustry.get(industry) || 0, quota, got: got.length });
    console.log(`   ${got.length}/${quota}  ${industry} (${countsByIndustry.get(industry) || 0} existing)`);
    await sleep(300);
  }

  // Step 2b: report how much was discarded and why — the previous version hid
  // a 92% rejection rate behind a single "valid after dedup" number.
  const rejected = rejectStats.proposed - careers.length;
  const rate = rejectStats.proposed ? (rejected / rejectStats.proposed) : 0;
  console.log(`\n🔎 Name generation: ${rejectStats.proposed} proposed, ${careers.length} accepted, ${rejected} rejected (${Math.round(rate * 100)}%)`);
  console.log(`   duplicate of existing career : ${rejectStats.duplicateExisting}`);
  console.log(`   duplicate within this run    : ${rejectStats.duplicateInRun}`);
  console.log(`   empty / unusable name        : ${rejectStats.empty}`);
  console.log(`   unparseable model response   : ${rejectStats.unparseable} industries`);

  const toProcess = careers.slice(0, TARGET);
  console.log(`\n📝 Processing ${toProcess.length} careers...\n`);

  // Step 3: For each career, generate all fields then push to Supabase
  let ok = 0, fail = 0;
  for (let i = 0; i < toProcess.length; i++) {
    const { name, primary_industry } = toProcess[i];
    process.stdout.write(`[${i + 1}/${toProcess.length}] ${name}... `);

    let fields, attempt = 0;
    while (attempt < 3) {
      try {
        fields = await generateAllFields(name, primary_industry);
        break;
      } catch (e) {
        attempt++;
        if (attempt === 3) { console.log(`❌ generate: ${e.message}`); fail++; fields = null; break; }
        await sleep(1500);
      }
    }
    if (!fields) { await sleep(300); continue; }

    try {
      await createRecord({ name, primary_industry, ...fields });
      console.log("✓");
      ok++;
    } catch (e) {
      console.log(`❌ save: ${e.message}`);
      fail++;
    }

    await sleep(400);
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n🎉 Done in ${elapsed}s`);
  console.log(`   ✅ Created: ${ok}`);
  console.log(`   ❌ Failed:  ${fail}`);
  console.log(`   📊 Total in DB (approx): ${existing.length + ok}`);

  const short = perIndustry.filter(p => p.got < p.quota);
  if (short.length) {
    console.log(`\n⚠ ${short.length} industries under quota — the model could not find enough genuinely new careers:`);
    for (const p of short) console.log(`   ${p.got}/${p.quota}  ${p.industry} (${p.have} existing)`);
  }

  // A run that targets 100 and delivers 22 used to be reported as a success,
  // because `fail` only ever counted errors. Shortfall is now a failure signal:
  // the interesting fact is not "did the inserts work" but "are we still finding
  // new careers". Expect this to trip while the name space stays saturated —
  // that IS the signal, not a flaw in it.
  const SHORTFALL_FLOOR = 0.8;
  if (ok < TARGET * SHORTFALL_FLOOR) {
    console.error(`\n❌ Shortfall: created ${ok} of a target ${TARGET} (${Math.round(ok / TARGET * 100)}%, floor ${SHORTFALL_FLOOR * 100}%).`);
    console.error(`   ${rejectStats.duplicateExisting} of ${rejectStats.proposed} proposed names were rejected as duplicates of careers`);
    console.error(`   that already exist. Either lower TARGET, or dedupe the table to free up name space.`);
    process.exit(1);
  }
  if (fail > 0) process.exit(1); // Let GitHub Actions flag the run as failed
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
