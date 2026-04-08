const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const ANTHROPIC_KEY = process.env.ANTHROPIC_KEY;
const BASE_ID = "app7CzdOBdcdWpqj4";
const TABLE_ID = "tblIM2gYIKk8Xt6KT";
const MODEL = "claude-haiku-4-5-20251001";

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchAllCareers() {
  const all = [];
  let offset = null;
  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } });
    const data = await res.json();
    all.push(...data.records);
    offset = data.offset || null;
  } while (offset);
  return all;
}

async function enrichCareer(name, industry, traits, salary) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      messages: [{
        role: "user",
        content: `For the career "${name}" in ${industry} with traits ${traits}, return ONLY this JSON with no markdown or explanation:
{"work_style":"Remote or Hybrid or In-person or Field-based","schedule_type":"Traditional 9-5 or Flexible or Shift-based or Project-based or Autonomous","work_environment":"Office or Lab or Studio or Outdoors or Travel-heavy or Varies","degree_required":"Yes or No or Sometimes","entry_level_friendly":"Yes or No","requirements":"1 specific sentence on education and certifications needed"}`
      }]
    })
  });
  const data = await res.json();
  if (!res.ok) { console.log("  Claude err:", data.error?.message); return null; }
  const raw = data.content?.find(b => b.type === "text")?.text || "";
  try { return JSON.parse(raw.replace(/```json|```/gi, "").trim()); }
  catch(e) { console.log("  Parse err"); return null; }
}

async function updateRecord(id, fields) {
  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });
  const data = await res.json();
  if (!res.ok) { console.log("  AT err:", data.error?.message); return false; }
  return true;
}

async function main() {
  console.log("🚀 Sparq Enrichment — Clean Run\n");
  const careers = await fetchAllCareers();
  console.log(`Found ${careers.length} careers\n`);
  let ok = 0, fail = 0;
  for (let i = 0; i < careers.length; i++) {
    const c = careers[i];
    const f = c.fields;
    process.stdout.write(`[${i+1}/${careers.length}] ${f.name}... `);
    const enriched = await enrichCareer(f.name, f.primary_industry, f.traits, f.salary_range);
    if (!enriched) { console.log("❌"); fail++; continue; }
    const updated = await updateRecord(c.id, enriched);
    if (updated) { console.log("✓"); ok++; } else { fail++; }
    await sleep(400);
  }
  console.log(`\n✅ Done! ✓${ok} ❌${fail}`);
}

main();
