// Sparq — Enrich Career Database
// Adds 6 new fields to Airtable and populates them for all 300 careers
// Run: node enrich_careers.cjs

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = "app7CzdOBdcdWpqj4";
const TABLE_ID = "tblIM2gYIKk8Xt6KT";

const SYSTEM_PROMPT = `You are a career data specialist for Sparq, a career discovery app for students aged 11-22. 
Given a career's details, return accurate, research-backed data for 6 fields.
Return ONLY a valid JSON object. No markdown, no backticks, no explanation.`;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchAllCareers() {
  const all = [];
  let offset = null;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });
    const data = await res.json();
    all.push(...data.records);
    offset = data.offset || null;
  } while (offset);

  return all;
}

async function enrichCareer(career) {
  const { name, primary_industry, description, traits, keywords } = career.fields;

  const prompt = `Career: ${name}
Industry: ${primary_industry}
Description: ${description}
Traits: ${traits}
Keywords: ${keywords}

Return a JSON object with exactly these 6 fields:
{
  "work_style": "one of: Remote / Hybrid / In-person / Field-based",
  "schedule_type": "one of: Traditional 9-5 / Flexible / Shift-based / Project-based / Autonomous",
  "work_environment": "one of: Office / Lab / Studio / Outdoors / Travel-heavy / Varies",
  "degree_required": "one of: Yes / No / Sometimes",
  "entry_level_friendly": "one of: Yes / No",
  "requirements": "1-2 sentences on specific education, certifications, or training needed. Be specific and accurate based on BLS/O*NET data."
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const raw = data.content?.find((b) => b.type === "text")?.text || "";
  const clean = raw.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error(`⚠️  Parse failed for ${name}`);
    return null;
  }
}

async function updateAirtableRecord(recordId, fields) {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    }
  );
  return res.ok;
}

async function main() {
  console.log("🚀 Sparq Career Enrichment Script");
  console.log("   Adding 6 new fields to all 300 careers...\n");

  if (!process.env.ANTHROPIC_KEY) {
    console.error("❌ Missing ANTHROPIC_API_KEY");
    console.error("   Run: export ANTHROPIC_API_KEY=your_key_here");
    process.exit(1);
  }

  console.log("📋 Fetching all careers from Airtable...");
  const careers = await fetchAllCareers();
  console.log(`   Found ${careers.length} careers\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < careers.length; i++) {
    const career = careers[i];
    const name = career.fields.name || "Unknown";
    process.stdout.write(`[${i + 1}/${careers.length}] ${name}... `);

    const enriched = await enrichCareer(career);

    if (enriched) {
      const updated = await updateAirtableRecord(career.id, enriched);
      if (updated) {
        console.log("✓");
        success++;
      } else {
        console.log("❌ Airtable update failed");
        failed++;
      }
    } else {
      console.log("❌ Enrichment failed");
      failed++;
    }

    // Small delay to avoid rate limits
    await sleep(300);
  }

  console.log(`\n✅ Done!`);
  console.log(`   Success: ${success}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\n📋 Next step: Connect these new fields to the Sparq UI!`);
}

main();
