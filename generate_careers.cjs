// Sparq Career Database Generator
// Generates 75-100 careers per industry, outputs sparq_careers.csv
// Run: node generate_careers.js

const fs = require("fs");

const INDUSTRIES = [
  "Tech & Engineering",
  "Design & Creative",
  "Business & Finance",
  "Healthcare & Medicine",
  "Education & Coaching",
  "Media & Journalism",
  "Law & Government",
  "Science & Research",
  "Hospitality & Events",
  "Sports & Fitness",
  "Fashion & Beauty",
  "Entrepreneurship",
  "Environment & Sustainability",
  "Social Impact & Nonprofit",
  "Arts & Performance",
];

const ALL_INDUSTRIES = INDUSTRIES.join(", ");

const SYSTEM_PROMPT = `You are a career database builder for Sparq, an app that helps middle school through college students discover careers they never knew existed.

CONTENT RULES (strictly enforced):
- Only include careers appropriate for students aged 11–22
- Source all careers from BLS.gov (Bureau of Labor Statistics) or O*NET Online
- Exclude anything related to: adult entertainment, cannabis, gambling, weapons manufacturing, tobacco, alcohol production
- No vague or made-up job titles — every role must be real and searchable
- Favor careers students wouldn't typically think of — go beyond the obvious

OUTPUT: Return ONLY a valid JSON array. No markdown, no backticks, no explanation. Just the raw JSON array.`;

const USER_PROMPT = (industry) => `Generate exactly 20 real careers in the "${industry}" industry for a student career discovery app.

For each career return this exact JSON object:
{
  "name": "Job Title",
  "primary_industry": "${industry}",
  "secondary_industries": "comma-separated list of 1-2 other related industries from: ${ALL_INDUSTRIES} (or empty string if none)",
  "description": "2 sentences max. Start with 'You' — describe what the person actually does day-to-day and the impact they have. Be vivid and specific.",
  "traits": "4 traits, comma-separated (e.g. Creative,Analytical,Empathetic,Detail-oriented)",
  "keywords": "6-8 lowercase keywords that describe work style and values (e.g. people,creative,analytical,fast,calm,independent,leadership,physical,visual,writing,systems,data,outdoor,travel,hands-on)",
  "salary_range": "e.g. $45k–$90k (use BLS data where possible)",
  "crossover_label": "If this career crosses 2+ industries, write a short label like 'Sports + Law' or 'Fashion + Data', otherwise empty string",
  "source_url": "Direct BLS.gov or O*NET URL for this career. Use https://www.bls.gov/ooh/ or https://www.onetonline.org/find/ — must be a real, working URL",
  "reviewed": false
}

Make sure careers are diverse — include emerging roles, overlooked careers, and interdisciplinary positions students wouldn't find in a standard guidance counselor's office.`;

async function generateIndustry(industry) {
  console.log(`\n⚡ Generating: ${industry}...`);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: USER_PROMPT(industry) }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error for ${industry}: ${err}`);
  }

  const data = await response.json();
  const raw = data.content?.find((b) => b.type === "text")?.text || "";

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/gi, "").trim();

  let careers;
  try {
    careers = JSON.parse(clean);
  } catch (e) {
    console.error(`⚠️  JSON parse failed for ${industry}. Raw snippet:`, clean.slice(0, 300));
    return [];
  }

  console.log(`   ✓ ${careers.length} careers generated`);
  return careers;
}

function toCSV(careers) {
  const headers = [
    "name",
    "primary_industry",
    "secondary_industries",
    "description",
    "traits",
    "keywords",
    "salary_range",
    "crossover_label",
    "source_url",
    "reviewed",
  ];

  const escape = (val) => {
    const str = String(val ?? "");
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = careers.map((c) =>
    headers.map((h) => escape(c[h] ?? "")).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

async function main() {
  console.log("🚀 Sparq Career Database Generator");
  console.log(`   Generating careers for ${INDUSTRIES.length} industries...\n`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ Missing ANTHROPIC_API_KEY environment variable.");
    console.error("   Run: export ANTHROPIC_API_KEY=your_key_here");
    process.exit(1);
  }

  const allCareers = [];
  const failed = [];

  for (const industry of INDUSTRIES) {
    try {
      const careers = await generateIndustry(industry);
      allCareers.push(...careers);
      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      console.error(`❌ Failed: ${industry} — ${err.message}`);
      failed.push(industry);
    }
  }

  // Write CSV
  const csv = toCSV(allCareers);
  fs.writeFileSync("sparq_careers.csv", csv, "utf8");

  // Write JSON backup
  fs.writeFileSync("sparq_careers.json", JSON.stringify(allCareers, null, 2), "utf8");

  console.log("\n✅ Done!");
  console.log(`   Total careers: ${allCareers.length}`);
  console.log(`   Files saved: sparq_careers.csv + sparq_careers.json`);

  if (failed.length > 0) {
    console.log(`\n⚠️  Failed industries (re-run manually):`);
    failed.forEach((f) => console.log(`   - ${f}`));
  }

  console.log("\n📋 Next steps:");
  console.log("   1. Open airtable.com and create a free account");
  console.log("   2. Create a new base called 'Sparq'");
  console.log("   3. Click Add table → Import CSV → upload sparq_careers.csv");
  console.log("   4. Come back to Claude and we'll connect it to your app!");
}

main();
