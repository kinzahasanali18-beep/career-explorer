// add_careers.cjs
// 1. Fetch existing career names from Airtable
// 2. Generate 301 new unique careers via Claude
// 3. Import them to Airtable
// 4. Enrich only the new records (work_style, schedule_type, work_environment, degree_required, entry_level_friendly, requirements)

const AT = process.env.AIRTABLE_TOKEN;
const AK = process.env.ANTHROPIC_KEY;
const BASE = "app7CzdOBdcdWpqj4";
const TABLE = "tblIM2gYIKk8Xt6KT";
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── Airtable: fetch all existing career names ───────────────────────────────
async function fetchExisting() {
  console.log("📋 Fetching existing careers from Airtable...");
  const records = [];
  let offset = null;
  do {
    const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?pageSize=100${offset ? "&offset=" + offset : ""}`;
    const r = await fetch(url, { headers: { Authorization: "Bearer " + AT } });
    const d = await r.json();
    if (d.error) { console.error("Airtable error:", JSON.stringify(d.error)); process.exit(1); }
    records.push(...d.records);
    offset = d.offset || null;
  } while (offset);
  const names = records.map(rec => rec.fields.name).filter(Boolean);
  console.log(`   Found ${names.length} existing careers.\n`);
  return names;
}

// Map of common sub-industry names Claude might generate → correct Airtable value
const INDUSTRY_MAP = {
  // Tech
  "software engineering": "Tech & Engineering",
  "cybersecurity": "Tech & Engineering",
  "information technology": "Tech & Engineering",
  "data science": "Tech & Engineering",
  "artificial intelligence": "Tech & Engineering",
  "ai/ml": "Tech & Engineering",
  "ai & machine learning": "Tech & Engineering",
  "cloud computing": "Tech & Engineering",
  "devops": "Tech & Engineering",
  "robotics": "Tech & Engineering",
  "quantum computing": "Tech & Engineering",
  "fintech": "Tech & Engineering",
  "blockchain": "Tech & Engineering",
  "game development": "Tech & Engineering",
  "web development": "Tech & Engineering",
  "mobile development": "Tech & Engineering",
  "it": "Tech & Engineering",
  "telecommunications": "Tech & Engineering",
  // Healthcare
  "healthcare": "Healthcare & Medicine",
  "medicine": "Healthcare & Medicine",
  "medical": "Healthcare & Medicine",
  "nursing": "Healthcare & Medicine",
  "mental health": "Healthcare & Medicine",
  "public health": "Healthcare & Medicine",
  "dentistry": "Healthcare & Medicine",
  "pharmacy": "Healthcare & Medicine",
  "optometry": "Healthcare & Medicine",
  "physical therapy": "Healthcare & Medicine",
  "veterinary": "Healthcare & Medicine",
  "veterinary medicine": "Healthcare & Medicine",
  "allied health": "Healthcare & Medicine",
  "rehabilitation": "Healthcare & Medicine",
  "nutrition": "Healthcare & Medicine",
  // Finance
  "finance": "Business & Finance",
  "banking": "Business & Finance",
  "insurance": "Business & Finance",
  "accounting": "Business & Finance",
  "real estate": "Business & Finance",
  "investment": "Business & Finance",
  "investment management": "Business & Finance",
  "actuarial science": "Business & Finance",
  "economics": "Business & Finance",
  "financial services": "Business & Finance",
  "business": "Business & Finance",
  "management": "Business & Finance",
  "human resources": "Business & Finance",
  "supply chain": "Business & Finance",
  "logistics": "Business & Finance",
  // Education
  "education": "Education & Coaching",
  "coaching": "Education & Coaching",
  "training": "Education & Coaching",
  "teaching": "Education & Coaching",
  "instructional design": "Education & Coaching",
  "e-learning": "Education & Coaching",
  "academic": "Education & Coaching",
  // Arts
  "arts": "Arts & Performance",
  "performing arts": "Arts & Performance",
  "theater": "Arts & Performance",
  "music": "Arts & Performance",
  "music production": "Arts & Performance",
  "film": "Arts & Performance",
  "film & tv": "Arts & Performance",
  "television": "Arts & Performance",
  "dance": "Arts & Performance",
  "visual arts": "Arts & Performance",
  // Design
  "design": "Design & Creative",
  "graphic design": "Design & Creative",
  "ux/ui": "Design & Creative",
  "ux/ui design": "Design & Creative",
  "architecture": "Design & Creative",
  "interior design": "Design & Creative",
  "industrial design": "Design & Creative",
  "photography": "Design & Creative",
  "animation": "Design & Creative",
  // Entrepreneurship
  "entrepreneurship": "Entrepreneurship",
  "startup": "Entrepreneurship",
  "venture capital": "Entrepreneurship",
  // Environment
  "environment": "Environment & Sustainability",
  "environmental": "Environment & Sustainability",
  "environmental science": "Environment & Sustainability",
  "sustainability": "Environment & Sustainability",
  "agriculture": "Environment & Sustainability",
  "marine biology": "Environment & Sustainability",
  "marine": "Environment & Sustainability",
  "forestry": "Environment & Sustainability",
  "conservation": "Environment & Sustainability",
  "ecology": "Environment & Sustainability",
  "geology": "Environment & Sustainability",
  "energy": "Environment & Sustainability",
  "renewable energy": "Environment & Sustainability",
  // Fashion
  "fashion": "Fashion & Beauty",
  "beauty": "Fashion & Beauty",
  "cosmetics": "Fashion & Beauty",
  "retail fashion": "Fashion & Beauty",
  // Law & Government
  "law": "Law & Government",
  "legal": "Law & Government",
  "government": "Law & Government",
  "public policy": "Law & Government",
  "policy": "Law & Government",
  "military": "Law & Government",
  "politics": "Law & Government",
  "criminal justice": "Law & Government",
  // Science & Research
  "science": "Science & Research",
  "research": "Science & Research",
  "biology": "Science & Research",
  "chemistry": "Science & Research",
  "physics": "Science & Research",
  "biotech": "Science & Research",
  "biotechnology": "Science & Research",
  "neuroscience": "Science & Research",
  "aerospace": "Science & Research",
  "space technology": "Science & Research",
  "materials science": "Science & Research",
  // Social Impact
  "social work": "Social Impact & Nonprofit",
  "nonprofit": "Social Impact & Nonprofit",
  "nonprofit management": "Social Impact & Nonprofit",
  "social impact": "Social Impact & Nonprofit",
  "social services": "Social Impact & Nonprofit",
  "community development": "Social Impact & Nonprofit",
  "international development": "Social Impact & Nonprofit",
  // Hospitality & Events
  "hospitality": "Hospitality & Events",
  "events": "Hospitality & Events",
  "tourism": "Hospitality & Events",
  "food service": "Hospitality & Events",
  "culinary arts": "Hospitality & Events",
  "hotel management": "Hospitality & Events",
  // Sports & Fitness
  "sports": "Sports & Fitness",
  "fitness": "Sports & Fitness",
  "sports management": "Sports & Fitness",
  "recreation": "Sports & Fitness",
  "athletics": "Sports & Fitness",
  "exercise science": "Sports & Fitness",
  // Media & Journalism
  "media": "Media & Journalism",
  "journalism": "Media & Journalism",
  "communications": "Media & Journalism",
  "public relations": "Media & Journalism",
  "marketing": "Media & Journalism",
  "advertising": "Media & Journalism",
  "social media": "Media & Journalism",
  "broadcasting": "Media & Journalism",
  "publishing": "Media & Journalism",
};

function mapIndustry(raw) {
  if (!raw) return null;
  // If already valid, return as-is
  if (VALID_INDUSTRIES.includes(raw)) return raw;
  // Try lowercase match
  const lower = raw.toLowerCase().trim();
  if (INDUSTRY_MAP[lower]) return INDUSTRY_MAP[lower];
  // Try partial match
  for (const [key, val] of Object.entries(INDUSTRY_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null; // Can't map — will be skipped
}

// The ONLY valid primary_industry values in Airtable (single-select field)
const VALID_INDUSTRIES = [
  "Arts & Performance",
  "Business & Finance",
  "Design & Creative",
  "Education & Coaching",
  "Entrepreneurship",
  "Environment & Sustainability",
  "Fashion & Beauty",
  "Healthcare & Medicine",
  "Hospitality & Events",
  "Law & Government",
  "Media & Journalism",
  "Science & Research",
  "Social Impact & Nonprofit",
  "Sports & Fitness",
  "Tech & Engineering",
];

// ─── Claude: generate a batch of new careers ────────────────────────────────
async function generateBatch(focusIndustries, avoidNames, count) {
  const avoidList = avoidNames.length > 350
    ? avoidNames.slice(0, 350).join(", ") + " ... (and more)"
    : avoidNames.join(", ");

  const prompt = `You are building a career exploration database for a student app.

DO NOT include any career whose name closely matches any of these already-existing careers:
${avoidList}

Generate exactly ${count} specific, real career titles. Focus especially on these industry areas: ${focusIndustries.join(", ")}.

The primary_industry field MUST be one of these exact values (no others allowed):
${VALID_INDUSTRIES.map(i => `"${i}"`).join(", ")}

Rules:
- Be very specific: "Orthodontist" not "Doctor", "Site Reliability Engineer" not "Tech Person"
- No near-duplicates of the avoid list above
- Include both classic and emerging roles
- Mix entry-level, mid, and senior positions
- Cover niche/overlooked careers students wouldn't guess

Return ONLY a valid JSON array, no markdown, no explanation:
[{"name":"Career Title","primary_industry":"One of the 15 values above"},...]`;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": AK, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 4096, messages: [{ role: "user", content: prompt }] })
  });
  const d = await r.json();
  if (!r.ok) { console.error("Claude API error:", d.error?.message); return []; }
  const text = d.content?.find(b => b.type === "text")?.text || "";
  try {
    return JSON.parse(text.replace(/```json|```/gi, "").trim());
  } catch (e) {
    console.error("JSON parse error. Raw snippet:", text.slice(0, 300));
    return [];
  }
}

// ─── Airtable: create records in batches of 10 ──────────────────────────────
async function createRecords(careers) {
  console.log(`\n📥 Importing ${careers.length} careers to Airtable...`);
  const newIds = [];
  for (let i = 0; i < careers.length; i += 10) {
    const batch = careers.slice(i, i + 10);
    const r = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + AT, "Content-Type": "application/json" },
      body: JSON.stringify({
        records: batch.map(c => ({ fields: { name: c.name, primary_industry: c.primary_industry } }))
      })
    });
    const d = await r.json();
    if (!r.ok) {
      console.error(`   Batch ${Math.floor(i / 10) + 1} error:`, JSON.stringify(d.error));
    } else {
      const ids = d.records.map(rec => rec.id);
      newIds.push(...ids);
      process.stdout.write(`   Created batch ${Math.floor(i / 10) + 1}/${Math.ceil(careers.length / 10)}: ${ids.length} records\n`);
    }
    await sleep(300);
  }
  console.log(`   ✅ ${newIds.length} records created in Airtable.\n`);
  return newIds;
}

// ─── Airtable: re-fetch to get record objects for the new IDs ────────────────
async function fetchByIds(ids) {
  const idSet = new Set(ids);
  const records = [];
  let offset = null;
  do {
    const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?pageSize=100${offset ? "&offset=" + offset : ""}`;
    const r = await fetch(url, { headers: { Authorization: "Bearer " + AT } });
    const d = await r.json();
    if (d.error) { console.error("Airtable error:", JSON.stringify(d.error)); process.exit(1); }
    records.push(...d.records.filter(rec => idSet.has(rec.id)));
    offset = d.offset || null;
  } while (offset);
  return records;
}

// ─── Claude + Airtable: enrich a single record ───────────────────────────────
async function enrichRecord(rec, index, total) {
  const name = rec.fields.name || "";
  const industry = rec.fields.primary_industry || "";
  process.stdout.write(`[${index}/${total}] ${name}... `);

  const prompt = `For the career "${name}" in ${industry}, return ONLY valid JSON, no markdown, no explanation:
{"work_style":"Remote or Hybrid or In-person or Field-based","schedule_type":"Traditional 9-5 or Flexible or Shift-based or Project-based or Autonomous","work_environment":"Office or Lab or Studio or Outdoors or Travel-heavy or Varies","degree_required":"Yes or No or Sometimes","entry_level_friendly":"Yes or No","requirements":"one sentence on education and certifications needed"}`;

  const ar = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": AK, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 300, messages: [{ role: "user", content: prompt }] })
  });
  const ad = await ar.json();
  if (!ar.ok) { console.log("❌ Claude error:", ad.error?.message); return false; }
  const text = ad.content?.find(b => b.type === "text")?.text || "";
  let fields;
  try { fields = JSON.parse(text.replace(/```json|```/gi, "").trim()); }
  catch (e) { console.log("❌ parse error"); return false; }

  const ur = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}/${rec.id}`, {
    method: "PATCH",
    headers: { Authorization: "Bearer " + AT, "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });
  const ud = await ur.json();
  if (!ur.ok) { console.log("❌ Airtable write error:", JSON.stringify(ud.error)); return false; }
  console.log("✓");
  return true;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Step 1: Get existing names
  const existingNames = await fetchExisting();

  // Step 2: Generate new careers in 5 industry-group batches
  console.log("🤖 Generating 301 new careers with Claude (5 batches)...\n");
  // Focus areas per batch (Claude will map to the 15 valid industries)
  const batches = [
    { industries: ["Tech & Engineering", "Data Science", "Cybersecurity", "DevOps", "AI/ML", "Quantum Computing", "Robotics"], count: 65 },
    { industries: ["Healthcare & Medicine", "Mental Health", "Dentistry", "Pharmacy", "Physical Therapy", "Veterinary", "Public Health"], count: 65 },
    { industries: ["Business & Finance", "Banking", "Insurance", "Accounting", "Real Estate", "Fintech", "Entrepreneurship"], count: 55 },
    { industries: ["Education & Coaching", "Arts & Performance", "Design & Creative", "Media & Journalism", "Fashion & Beauty"], count: 65 },
    { industries: ["Environment & Sustainability", "Science & Research", "Law & Government", "Social Impact & Nonprofit", "Hospitality & Events", "Sports & Fitness"], count: 65 },
  ];

  let allGenerated = [];
  for (let i = 0; i < batches.length; i++) {
    const { industries, count } = batches[i];
    console.log(`   Batch ${i + 1}/5: ${industries.slice(0, 3).join(", ")}...`);
    const avoid = [...existingNames, ...allGenerated.map(c => c.name)];
    const result = await generateBatch(industries, avoid, count);
    console.log(`   → Received ${result.length} careers`);
    allGenerated.push(...result);
    await sleep(1200);
  }

  // Dedup helper
  const dedup = (generated, existing) => {
    const existingLower = new Set(existing.map(n => n.toLowerCase().trim()));
    const seenNew = new Set();
    return generated.filter(c => {
      if (!c.name) return false;
      const key = c.name.toLowerCase().trim();
      if (existingLower.has(key) || seenNew.has(key)) return false;
      seenNew.add(key);
      return true;
    });
  };

  let unique = dedup(allGenerated, existingNames);
  console.log(`\n📊 Summary:`);
  console.log(`   Total generated: ${allGenerated.length}`);
  console.log(`   After dedup:     ${unique.length}`);

  // Supplemental batches if needed (up to 3 extra tries)
  let attempt = 0;
  while (unique.length < 301 && attempt < 3) {
    attempt++;
    const needed = 301 - unique.length + 10; // request a few extra
    console.log(`\n   ⚠️  Short by ${301 - unique.length}. Running supplemental batch ${attempt} (requesting ${needed})...`);
    const avoid = [...existingNames, ...unique.map(c => c.name)];
    const extra = await generateBatch(VALID_INDUSTRIES, avoid, needed);
    console.log(`   → Received ${extra.length} supplemental careers`);
    allGenerated.push(...extra);
    unique = dedup(allGenerated, existingNames);
    console.log(`   After dedup: ${unique.length}`);
    await sleep(1200);
  }

  if (unique.length < 301) {
    console.error(`\n❌ Only got ${unique.length} unique careers after supplemental batches. Re-run to try again.`);
    process.exit(1);
  }

  // Remap industries to valid Airtable values; skip only if truly unmappable
  let skipped = 0;
  const validCareers = unique.map(c => {
    const mapped = mapIndustry(c.primary_industry);
    if (!mapped) {
      console.warn(`   ⚠️  Skipping "${c.name}" — cannot map industry: "${c.primary_industry}"`);
      skipped++;
      return null;
    }
    return { ...c, primary_industry: mapped };
  }).filter(Boolean);
  if (skipped > 0) console.log(`   Skipped ${skipped} unmappable careers.`);

  if (validCareers.length < 301) {
    console.error(`\n❌ Only ${validCareers.length} valid careers after filtering (need 301). Re-run to try again.`);
    process.exit(1);
  }

  const toImport = validCareers.slice(0, 301);
  console.log(`   Valid + importing: ${toImport.length}\n`);

  // Step 4: Create in Airtable
  const newIds = await createRecords(toImport);
  if (newIds.length === 0) {
    console.error("No records were created. Exiting.");
    process.exit(1);
  }

  // Step 5: Fetch new records (need name + industry for enrichment prompt)
  console.log("🔍 Re-fetching new records for enrichment...");
  const newRecords = await fetchByIds(newIds);
  console.log(`   Found ${newRecords.length} records to enrich.\n`);

  // Step 6: Enrich
  console.log("✨ Enriching new careers...\n");
  let ok = 0, fail = 0;
  for (let i = 0; i < newRecords.length; i++) {
    const success = await enrichRecord(newRecords[i], i + 1, newRecords.length);
    if (success) ok++; else fail++;
    await sleep(400);
  }

  console.log(`\n🎉 Complete!`);
  console.log(`   Records created:  ${newIds.length}`);
  console.log(`   Enriched OK:      ${ok}`);
  console.log(`   Enrichment fails: ${fail}`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
