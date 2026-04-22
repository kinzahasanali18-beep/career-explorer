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

const VALID_INDUSTRIES = [
  "Arts & Performance", "Business & Finance", "Design & Creative",
  "Education & Coaching", "Entrepreneurship", "Environment & Sustainability",
  "Fashion & Beauty", "Healthcare & Medicine", "Hospitality & Events",
  "Law & Government", "Media & Journalism", "Science & Research",
  "Social Impact & Nonprofit", "Sports & Fitness", "Tech & Engineering",
];

// Maps sub-industry names Claude might use → valid Airtable select value
const INDUSTRY_MAP = {
  "software engineering":"Tech & Engineering","cybersecurity":"Tech & Engineering",
  "information technology":"Tech & Engineering","data science":"Tech & Engineering",
  "artificial intelligence":"Tech & Engineering","ai/ml":"Tech & Engineering",
  "cloud computing":"Tech & Engineering","devops":"Tech & Engineering",
  "robotics":"Tech & Engineering","quantum computing":"Tech & Engineering",
  "fintech":"Tech & Engineering","blockchain":"Tech & Engineering",
  "game development":"Tech & Engineering","web development":"Tech & Engineering",
  "telecommunications":"Tech & Engineering","it":"Tech & Engineering",
  "healthcare":"Healthcare & Medicine","medicine":"Healthcare & Medicine",
  "medical":"Healthcare & Medicine","nursing":"Healthcare & Medicine",
  "mental health":"Healthcare & Medicine","public health":"Healthcare & Medicine",
  "dentistry":"Healthcare & Medicine","pharmacy":"Healthcare & Medicine",
  "optometry":"Healthcare & Medicine","physical therapy":"Healthcare & Medicine",
  "veterinary":"Healthcare & Medicine","veterinary medicine":"Healthcare & Medicine",
  "allied health":"Healthcare & Medicine","nutrition":"Healthcare & Medicine",
  "finance":"Business & Finance","banking":"Business & Finance",
  "insurance":"Business & Finance","accounting":"Business & Finance",
  "real estate":"Business & Finance","investment":"Business & Finance",
  "actuarial science":"Business & Finance","economics":"Business & Finance",
  "financial services":"Business & Finance","business":"Business & Finance",
  "human resources":"Business & Finance","supply chain":"Business & Finance",
  "logistics":"Business & Finance","management":"Business & Finance",
  "education":"Education & Coaching","coaching":"Education & Coaching",
  "training":"Education & Coaching","teaching":"Education & Coaching",
  "instructional design":"Education & Coaching","e-learning":"Education & Coaching",
  "arts":"Arts & Performance","performing arts":"Arts & Performance",
  "theater":"Arts & Performance","music":"Arts & Performance",
  "music production":"Arts & Performance","film":"Arts & Performance",
  "television":"Arts & Performance","dance":"Arts & Performance",
  "visual arts":"Arts & Performance",
  "design":"Design & Creative","graphic design":"Design & Creative",
  "ux/ui":"Design & Creative","architecture":"Design & Creative",
  "interior design":"Design & Creative","photography":"Design & Creative",
  "animation":"Design & Creative","industrial design":"Design & Creative",
  "entrepreneurship":"Entrepreneurship","startup":"Entrepreneurship",
  "venture capital":"Entrepreneurship",
  "environment":"Environment & Sustainability","environmental":"Environment & Sustainability",
  "sustainability":"Environment & Sustainability","agriculture":"Environment & Sustainability",
  "marine biology":"Environment & Sustainability","forestry":"Environment & Sustainability",
  "conservation":"Environment & Sustainability","ecology":"Environment & Sustainability",
  "renewable energy":"Environment & Sustainability","energy":"Environment & Sustainability",
  "fashion":"Fashion & Beauty","beauty":"Fashion & Beauty","cosmetics":"Fashion & Beauty",
  "law":"Law & Government","legal":"Law & Government","government":"Law & Government",
  "public policy":"Law & Government","military":"Law & Government",
  "criminal justice":"Law & Government","politics":"Law & Government",
  "science":"Science & Research","research":"Science & Research",
  "biology":"Science & Research","chemistry":"Science & Research",
  "physics":"Science & Research","biotech":"Science & Research",
  "biotechnology":"Science & Research","neuroscience":"Science & Research",
  "aerospace":"Science & Research","space technology":"Science & Research",
  "materials science":"Science & Research",
  "social work":"Social Impact & Nonprofit","nonprofit":"Social Impact & Nonprofit",
  "social impact":"Social Impact & Nonprofit","social services":"Social Impact & Nonprofit",
  "community development":"Social Impact & Nonprofit",
  "hospitality":"Hospitality & Events","events":"Hospitality & Events",
  "tourism":"Hospitality & Events","food service":"Hospitality & Events",
  "culinary arts":"Hospitality & Events","hotel management":"Hospitality & Events",
  "sports":"Sports & Fitness","fitness":"Sports & Fitness",
  "sports management":"Sports & Fitness","recreation":"Sports & Fitness",
  "athletics":"Sports & Fitness","exercise science":"Sports & Fitness",
  "media":"Media & Journalism","journalism":"Media & Journalism",
  "communications":"Media & Journalism","public relations":"Media & Journalism",
  "marketing":"Media & Journalism","advertising":"Media & Journalism",
  "social media":"Media & Journalism","broadcasting":"Media & Journalism",
  "publishing":"Media & Journalism",
};

function mapIndustry(raw) {
  if (!raw) return null;
  if (VALID_INDUSTRIES.includes(raw)) return raw;
  const lower = raw.toLowerCase().trim();
  if (INDUSTRY_MAP[lower]) return INDUSTRY_MAP[lower];
  for (const [key, val] of Object.entries(INDUSTRY_MAP)) {
    if (lower.includes(key)) return val;
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
];

function parseK(s) { const m = (s || "").match(/\$?(\d+)k/i); return m ? parseInt(m[1]) : 0; }

function snapSalary(raw) {
  if (!raw) return "$45k\u2013$80k";
  const norm = raw.replace(/[-\u2013\u2014]/g, "\u2013").trim();
  if (SALARY_OPTIONS.includes(norm)) return norm;
  const parts = raw.split(/[-\u2013\u2014]/);
  const low = parseK(parts[0]);
  const high = parseK(parts[1] || "");
  let best = SALARY_OPTIONS[0], bestScore = Infinity;
  for (const opt of SALARY_OPTIONS) {
    const op = opt.split("\u2013");
    const score = Math.abs(parseK(op[0]) - low) + Math.abs(parseK(op[1] || "") - high);
    if (score < bestScore) { bestScore = score; best = opt; }
  }
  return best;
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────

async function fetchExistingNames() {
  console.log("📋 Fetching existing careers...");
  const names = [];
  const limit = 1000;
  let offset = 0;

  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/careers?select=name&limit=${limit}&offset=${offset}`;
    const r = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
    });
    if (!r.ok) { console.error("Supabase error:", await r.text()); process.exit(1); }
    const data = await r.json();
    names.push(...data.map(row => row.name).filter(Boolean));
    if (data.length < limit) break;
    offset += limit;
  }

  console.log(`   ${names.length} existing careers found.\n`);
  return names;
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

// ─── Step 1: Generate career names ───────────────────────────────────────────

async function generateCareerNames(existingNames, count) {
  console.log(`🤖 Generating ${count} new career names...`);
  const avoid = existingNames.length > 400
    ? existingNames.slice(0, 400).join(", ") + " ... (truncated)"
    : existingNames.join(", ");

  const text = await claude(`
You are building a career discovery database for students (ages 11-22).

EXISTING careers (do NOT include these or near-duplicates):
${avoid}

Generate exactly ${count} new, specific, real career titles spread across ALL of these industries:
${VALID_INDUSTRIES.join(", ")}

Rules:
- Spread evenly: ~6-7 careers per industry
- Be specific ("Orthodontist" not "Doctor", "Site Reliability Engineer" not "Tech Worker")
- Include emerging/modern roles, overlooked careers, and niche specialties
- No near-duplicates of existing careers

Return ONLY a valid JSON array, no markdown:
[{"name":"Career Title","primary_industry":"Exact industry from the list above"},...]
`, 4096);

  let careers = parseJSON(text);

  // Remap and filter industries
  const existingLower = new Set(existingNames.map(n => n.toLowerCase().trim()));
  const seen = new Set();
  const valid = [];

  for (const c of careers) {
    const mapped = mapIndustry(c.primary_industry);
    if (!mapped) { console.warn(`   ⚠ Skipping "${c.name}" — unmappable industry: ${c.primary_industry}`); continue; }
    const key = (c.name || "").toLowerCase().trim();
    if (!key || existingLower.has(key) || seen.has(key)) continue;
    seen.add(key);
    valid.push({ name: c.name, primary_industry: mapped });
  }

  console.log(`   Generated ${careers.length}, valid after dedup: ${valid.length}\n`);
  return valid;
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
  "source_url": "Real URL from https://www.bls.gov/ooh/ or https://www.onetonline.org/link/summary/ for closest occupation",
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

  // Snap salary to valid option
  fields.salary_range = snapSalary(fields.salary_range);

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

  // Step 1: Fetch existing names
  const existingNames = await fetchExistingNames();

  // Step 2: Generate career names (request a few extra in case some are duped/filtered)
  let careers = await generateCareerNames(existingNames, Math.ceil(TARGET * 1.15));

  // Supplemental batch if we got too few
  if (careers.length < TARGET) {
    console.log(`   ⚠ Only ${careers.length} names — running supplemental batch...`);
    const extra = await generateCareerNames(
      [...existingNames, ...careers.map(c => c.name)],
      TARGET - careers.length + 15
    );
    careers = [...careers, ...extra];
    await sleep(1000);
  }

  const toProcess = careers.slice(0, TARGET);
  console.log(`📝 Processing ${toProcess.length} careers...\n`);

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
  console.log(`   📊 Total in DB (approx): ${existingNames.length + ok}`);

  if (fail > 0) process.exit(1); // Let GitHub Actions flag the run as failed
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
