// fill_missing.cjs
// Fetches all Airtable records where description is empty,
// generates description/traits/keywords/salary_range/source_url via Claude Haiku,
// then patches each record.

const AT = process.env.AIRTABLE_TOKEN;
const AK = process.env.ANTHROPIC_KEY;
const BASE = "app7CzdOBdcdWpqj4";
const TABLE = "tblIM2gYIKk8Xt6KT";
const sleep = ms => new Promise(r => setTimeout(r, ms));

// All valid salary_range single-select options (em dash –, not hyphen -)
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
  "$95k\u2013$130k","$95k\u2013$150k","$95k\u2013$165k"
];

// Parse "$XXk" → number in thousands
function parseK(s) {
  const m = s.match(/\$(\d+)k/i);
  return m ? parseInt(m[1]) : 0;
}

// Find the closest valid salary option to a raw string like "$65k-$115k" or "$65k–$115k"
function snapSalary(raw) {
  if (!raw) return SALARY_OPTIONS[Math.floor(SALARY_OPTIONS.length / 2)];
  // Normalise separators
  const norm = raw.replace(/[-\u2013\u2014]/g, "\u2013").trim();
  if (SALARY_OPTIONS.includes(norm)) return norm;
  // Extract low and high
  const parts = raw.split(/[-\u2013\u2014]/);
  const low = parseK(parts[0] || "");
  const high = parseK(parts[1] || "");
  // Score each option by closeness of both endpoints
  let best = SALARY_OPTIONS[0], bestScore = Infinity;
  for (const opt of SALARY_OPTIONS) {
    const op = opt.split("\u2013");
    const ol = parseK(op[0] || "");
    const oh = parseK(op[1] || "");
    const score = Math.abs(ol - low) + Math.abs(oh - high);
    if (score < bestScore) { bestScore = score; best = opt; }
  }
  return best;
}

async function fetchIncomplete() {
  console.log("📋 Fetching records with missing description...");
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

  const incomplete = records.filter(rec => !rec.fields.description || rec.fields.description.trim() === "");
  console.log(`   Total records: ${records.length}`);
  console.log(`   Missing description: ${incomplete.length}\n`);
  return incomplete;
}

async function generateFields(name, industry) {
  const prompt = `You are filling in a career database for a student discovery app (ages 11-22).

Career: "${name}"
Industry: "${industry}"

Return ONLY valid JSON, no markdown, no explanation:
{
  "description": "One punchy sentence starting with 'You' describing what this person does day-to-day and the impact they make. Be vivid and specific.",
  "traits": "3-4 personality traits, comma-separated (e.g. Analytical,Creative,Detail-oriented,Collaborative)",
  "keywords": "4-5 lowercase keywords describing the work style and values, comma-separated (e.g. data,independent,creative,fast-paced,leadership)",
  "salary_range": "Realistic US median salary range like $55k-$90k (use a hyphen, not em dash)",
  "source_url": "A real URL from https://www.bls.gov/ooh/ or https://www.onetonline.org/link/summary/ for the closest matching occupation."
}`;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": AK, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const d = await r.json();
  if (!r.ok) { throw new Error("Claude API: " + d.error?.message); }
  const text = d.content?.find(b => b.type === "text")?.text || "";
  const fields = JSON.parse(text.replace(/```json|```/gi, "").trim());
  // Snap salary_range to nearest valid option
  fields.salary_range = snapSalary(fields.salary_range);
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
  if (records.length === 0) { console.log("✅ Nothing to do — all records have descriptions."); return; }

  let ok = 0, fail = 0;
  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const name = rec.fields.name || "";
    const industry = rec.fields.primary_industry || "";
    process.stdout.write(`[${i + 1}/${records.length}] ${name}... `);

    try {
      const fields = await generateFields(name, industry);
      await patchRecord(rec.id, fields);
      console.log("✓");
      ok++;
    } catch (e) {
      console.log("❌", e.message);
      fail++;
    }

    await sleep(400);
  }

  console.log(`\n🎉 Done! ✅ ${ok}  ❌ ${fail}`);
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
