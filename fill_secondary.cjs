// fill_secondary.cjs
// Fills secondary_industries and crossover_label for records where secondary_industries is empty.

const AT = process.env.AIRTABLE_TOKEN;
const AK = process.env.ANTHROPIC_KEY;
const BASE = "app7CzdOBdcdWpqj4";
const TABLE = "tblIM2gYIKk8Xt6KT";
const sleep = ms => new Promise(r => setTimeout(r, ms));

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

async function fetchIncomplete() {
  console.log("📋 Fetching records missing secondary_industries...");
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
  const incomplete = records.filter(rec => !rec.fields.secondary_industries || rec.fields.secondary_industries.trim() === "");
  console.log(`   Total: ${records.length} | Missing: ${incomplete.length}\n`);
  return incomplete;
}

async function generateFields(name, primary) {
  const prompt = `You are filling in a career database for a student discovery app.

Career: "${name}"
Primary industry: "${primary}"

The valid industry values are EXACTLY these 15 (use them verbatim):
${VALID_INDUSTRIES.map(i => `"${i}"`).join(", ")}

Task: Identify 1-2 OTHER industries (not the primary) that this career meaningfully overlaps with.
If the career is very niche with no real crossover, return just 1.

Return ONLY valid JSON, no markdown:
{
  "secondary_industries": "Industry1,Industry2",
  "crossover_label": "Short label like 'Tech + Healthcare' or 'Design + Business' using abbreviated names"
}

Examples of good crossover labels: "Tech + Health", "Law + Finance", "Science + Education", "Design + Media", "Sports + Business"`;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": AK, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const d = await r.json();
  if (!r.ok) throw new Error("Claude API: " + d.error?.message);
  const text = d.content?.find(b => b.type === "text")?.text || "";
  const fields = JSON.parse(text.replace(/```json|```/gi, "").trim());

  // Validate that each secondary industry is in the valid list; drop any that aren't
  const secondaryList = (fields.secondary_industries || "")
    .split(",")
    .map(s => s.trim())
    .filter(s => VALID_INDUSTRIES.includes(s) && s !== primary);

  fields.secondary_industries = secondaryList.join(",");
  return fields;
}

async function patchRecord(id, fields) {
  const r = await fetch(`https://api.airtable.com/v0/${BASE}/${TABLE}/${id}`, {
    method: "PATCH",
    headers: { Authorization: "Bearer " + AT, "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });
  const d = await r.json();
  if (!r.ok) throw new Error("Airtable PATCH: " + JSON.stringify(d.error));
}

async function main() {
  const records = await fetchIncomplete();
  if (records.length === 0) { console.log("✅ All records already have secondary_industries."); return; }

  let ok = 0, fail = 0;
  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const name = rec.fields.name || "";
    const primary = rec.fields.primary_industry || "";
    process.stdout.write(`[${i + 1}/${records.length}] ${name}... `);

    try {
      const fields = await generateFields(name, primary);
      await patchRecord(rec.id, fields);
      console.log(`✓  (${fields.secondary_industries})`);
      ok++;
    } catch (e) {
      console.log("❌", e.message);
      fail++;
    }

    await sleep(350);
  }

  console.log(`\n🎉 Done! ✅ ${ok}  ❌ ${fail}`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
