// reclassify_secondary.cjs
// Updates secondary_industries for all Airtable career records
// Run with: VITE_AIRTABLE_TOKEN=your_token node reclassify_secondary.cjs

const AIRTABLE_TOKEN = process.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = "app7CzdOBdcdWpqj4";
const TABLE_ID = "tblIM2gYIKk8Xt6KT";

const ALL_INDUSTRIES = [
  "Tech & Engineering", "Design & Creative", "Business & Finance",
  "Healthcare & Medicine", "Arts & Performance", "Education & Coaching",
  "Media & Journalism", "Law & Government", "Science & Research",
  "Hospitality & Events", "Sports & Fitness", "Fashion & Beauty",
  "Entrepreneurship", "Environment & Sustainability", "Social Impact & Nonprofit",
  "Marketing & Communications", "Cybersecurity", "Architecture & Urban Planning",
  "Gaming & Esports", "Supply Chain & Operations", "Food & Culinary",
  "Aviation & Transportation"
];

// For each industry, define which other industries commonly cross over
const CROSSOVER_MAP = {
  "Tech & Engineering": ["Business & Finance", "Design & Creative", "Science & Research", "Cybersecurity", "Gaming & Esports"],
  "Design & Creative": ["Marketing & Communications", "Tech & Engineering", "Arts & Performance", "Architecture & Urban Planning", "Fashion & Beauty"],
  "Business & Finance": ["Entrepreneurship", "Tech & Engineering", "Marketing & Communications", "Law & Government", "Supply Chain & Operations"],
  "Healthcare & Medicine": ["Science & Research", "Tech & Engineering", "Social Impact & Nonprofit", "Education & Coaching", "Law & Government"],
  "Arts & Performance": ["Media & Journalism", "Design & Creative", "Marketing & Communications", "Education & Coaching", "Hospitality & Events"],
  "Education & Coaching": ["Social Impact & Nonprofit", "Tech & Engineering", "Media & Journalism", "Science & Research", "Sports & Fitness"],
  "Media & Journalism": ["Marketing & Communications", "Arts & Performance", "Law & Government", "Tech & Engineering", "Social Impact & Nonprofit"],
  "Law & Government": ["Business & Finance", "Social Impact & Nonprofit", "Media & Journalism", "Healthcare & Medicine", "Environment & Sustainability"],
  "Science & Research": ["Healthcare & Medicine", "Tech & Engineering", "Environment & Sustainability", "Education & Coaching", "Aviation & Transportation"],
  "Hospitality & Events": ["Food & Culinary", "Marketing & Communications", "Business & Finance", "Arts & Performance", "Travel & Tourism"],
  "Sports & Fitness": ["Healthcare & Medicine", "Marketing & Communications", "Media & Journalism", "Education & Coaching", "Business & Finance"],
  "Fashion & Beauty": ["Design & Creative", "Marketing & Communications", "Business & Finance", "Arts & Performance", "Social Impact & Nonprofit"],
  "Entrepreneurship": ["Business & Finance", "Tech & Engineering", "Marketing & Communications", "Design & Creative", "Social Impact & Nonprofit"],
  "Environment & Sustainability": ["Science & Research", "Law & Government", "Social Impact & Nonprofit", "Tech & Engineering", "Architecture & Urban Planning"],
  "Social Impact & Nonprofit": ["Education & Coaching", "Law & Government", "Healthcare & Medicine", "Environment & Sustainability", "Media & Journalism"],
  "Marketing & Communications": ["Business & Finance", "Design & Creative", "Media & Journalism", "Tech & Engineering", "Entrepreneurship"],
  "Cybersecurity": ["Tech & Engineering", "Law & Government", "Business & Finance", "Science & Research", "Media & Journalism"],
  "Architecture & Urban Planning": ["Design & Creative", "Environment & Sustainability", "Tech & Engineering", "Business & Finance", "Social Impact & Nonprofit"],
  "Gaming & Esports": ["Tech & Engineering", "Marketing & Communications", "Media & Journalism", "Business & Finance", "Design & Creative"],
  "Supply Chain & Operations": ["Business & Finance", "Tech & Engineering", "Environment & Sustainability", "Aviation & Transportation", "Food & Culinary"],
  "Food & Culinary": ["Hospitality & Events", "Business & Finance", "Healthcare & Medicine", "Marketing & Communications", "Environment & Sustainability"],
  "Aviation & Transportation": ["Tech & Engineering", "Science & Research", "Business & Finance", "Supply Chain & Operations", "Environment & Sustainability"],
};

// Additional keyword-based secondary industry rules
const SECONDARY_KEYWORD_RULES = [
  { keywords: ["data", "analytics", "machine learning", "ai", "algorithm"], industries: ["Science & Research", "Tech & Engineering"] },
  { keywords: ["policy", "regulation", "compliance", "legal"], industries: ["Law & Government", "Business & Finance"] },
  { keywords: ["startup", "venture", "founder", "pitch"], industries: ["Entrepreneurship", "Business & Finance"] },
  { keywords: ["social media", "influencer", "content", "brand"], industries: ["Marketing & Communications", "Media & Journalism"] },
  { keywords: ["climate", "sustainable", "green", "carbon", "renewable"], industries: ["Environment & Sustainability", "Science & Research"] },
  { keywords: ["mental health", "therapy", "wellness", "counseling"], industries: ["Healthcare & Medicine", "Social Impact & Nonprofit"] },
  { keywords: ["game", "gaming", "esport", "streaming"], industries: ["Gaming & Esports", "Media & Journalism"] },
  { keywords: ["fashion", "style", "clothing", "apparel"], industries: ["Fashion & Beauty", "Marketing & Communications"] },
  { keywords: ["food", "chef", "culinary", "nutrition", "restaurant"], industries: ["Food & Culinary", "Hospitality & Events"] },
  { keywords: ["security", "cyber", "hacking", "network"], industries: ["Cybersecurity", "Tech & Engineering"] },
  { keywords: ["supply chain", "logistics", "warehouse", "procurement"], industries: ["Supply Chain & Operations", "Business & Finance"] },
  { keywords: ["aviation", "pilot", "aerospace", "flight"], industries: ["Aviation & Transportation", "Science & Research"] },
  { keywords: ["architecture", "urban", "city", "building", "design"], industries: ["Architecture & Urban Planning", "Design & Creative"] },
  { keywords: ["music", "film", "theater", "performance", "art"], industries: ["Arts & Performance", "Media & Journalism"] },
  { keywords: ["education", "teacher", "curriculum", "learning"], industries: ["Education & Coaching", "Social Impact & Nonprofit"] },
  { keywords: ["sport", "athlete", "fitness", "coach"], industries: ["Sports & Fitness", "Healthcare & Medicine"] },
  { keywords: ["nonprofit", "charity", "community", "advocacy"], industries: ["Social Impact & Nonprofit", "Law & Government"] },
  { keywords: ["research", "scientist", "laboratory", "biology", "chemistry"], industries: ["Science & Research", "Healthcare & Medicine"] },
  { keywords: ["event", "hospitality", "hotel", "travel", "tourism"], industries: ["Hospitality & Events", "Marketing & Communications"] },
  { keywords: ["journalist", "reporter", "news", "media", "broadcast"], industries: ["Media & Journalism", "Law & Government"] },
];

function getSecondaryIndustries(record) {
  const primary = record.fields.primary_industry || "";
  const searchText = [
    record.fields.name || "",
    record.fields.description || "",
    record.fields.keywords || "",
  ].join(" ").toLowerCase();

  const candidates = new Set();

  // Add crossover industries based on primary
  const crossovers = CROSSOVER_MAP[primary] || [];
  crossovers.slice(0, 2).forEach(ind => candidates.add(ind));

  // Add keyword-based secondary industries
  for (const rule of SECONDARY_KEYWORD_RULES) {
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword)) {
        rule.industries.forEach(ind => {
          if (ind !== primary) candidates.add(ind);
        });
        break;
      }
    }
  }

  // Remove primary industry from secondaries
  candidates.delete(primary);

  // Return top 3 secondaries
  return Array.from(candidates).slice(0, 3).join(",");
}

async function getAllRecords() {
  const allRecords = [];
  let offset = null;
  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    allRecords.push(...data.records);
    offset = data.offset || null;
    process.stdout.write(`\rFetched ${allRecords.length} records...`);
  } while (offset);
  console.log(`\nTotal: ${allRecords.length}`);
  return allRecords;
}

async function updateRecords(records) {
  const chunks = [];
  for (let i = 0; i < records.length; i += 10) {
    chunks.push(records.slice(i, i + 10));
  }
  let updated = 0;
  for (const chunk of chunks) {
    const body = {
      records: chunk.map(({ id, secondary }) => ({
        id,
        fields: { secondary_industries: secondary },
      })),
    };
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`\nUpdate failed:`, err);
    } else {
      updated += chunk.length;
      process.stdout.write(`\rUpdated ${updated} records...`);
    }
    await new Promise(r => setTimeout(r, 250));
  }
  return updated;
}

async function main() {
  console.log("Fetching all records...");
  const records = await getAllRecords();

  console.log("Generating secondary industries...");
  const toUpdate = records.map(record => ({
    id: record.id,
    secondary: getSecondaryIndustries(record),
  }));

  // Preview first 5
  console.log("\nPreview (first 5):");
  records.slice(0, 5).forEach((r, i) => {
    console.log(`  ${r.fields.name} | Primary: ${r.fields.primary_industry} | Secondary: ${toUpdate[i].secondary}`);
  });

  console.log(`\nUpdating ${toUpdate.length} records...`);
  const updated = await updateRecords(toUpdate);
  console.log(`\nDone! Updated ${updated} records.`);
}

main().catch(console.error);
