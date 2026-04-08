const AT = process.env.AIRTABLE_TOKEN;
const AK = process.env.ANTHROPIC_KEY;
const BASE = "app7CzdOBdcdWpqj4";
const TABLE = "tblIM2gYIKk8Xt6KT";
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log("Fetching careers...");
  const records = [];
  let offset = null;
  do {
    const url = `https://api.airtable.com/v0/${BASE}/${TABLE}?pageSize=100${offset ? "&offset="+offset : ""}`;
    const r = await fetch(url, { headers: { Authorization: "Bearer " + AT }});
    const d = await r.json();
    if (d.error) { console.log("Airtable error:", d.error); return; }
    records.push(...d.records);
    offset = d.offset || null;
  } while (offset);
  console.log("Found", records.length, "careers\n");

  let ok = 0, fail = 0;
  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const name = rec.fields.name;
    const industry = rec.fields.primary_industry || "";
    process.stdout.write(`[${i+1}/${records.length}] ${name}... `);

    const prompt = `For the career "${name}" in ${industry}, return ONLY valid JSON, no markdown, no explanation:
{"work_style":"Remote or Hybrid or In-person or Field-based","schedule_type":"Traditional 9-5 or Flexible or Shift-based or Project-based or Autonomous","work_environment":"Office or Lab or Studio or Outdoors or Travel-heavy or Varies","degree_required":"Yes or No or Sometimes","entry_level_friendly":"Yes or No","requirements":"one sentence on education and certifications needed"}`;

    const ar = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": AK, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 300, messages: [{ role: "user", content: prompt }] })
    });
    const ad = await ar.json();
    if (!ar.ok) { console.log("Claude err:", ad.error?.message); fail++; continue; }
    const text = ad.content?.find(b => b.type === "text")?.text || "";
    let fields;
    try { fields = JSON.parse(text.replace(/```json|```/gi, "").trim()); }
    catch(e) { console.log("parse err"); fail++; continue; }

    const ur = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}/${rec.id}`, {
      method: "PATCH",
      headers: { Authorization: "Bearer " + AT, "Content-Type": "application/json" },
      body: JSON.stringify({ fields })
    });
    const ud = await ur.json();
    if (!ur.ok) { console.log("AT write err:", ud.error); fail++; }
    else { console.log("✓"); ok++; }
    await sleep(400);
  }
  console.log(`\nDone! ✅ ${ok}  ❌ ${fail}`);
}
main();
