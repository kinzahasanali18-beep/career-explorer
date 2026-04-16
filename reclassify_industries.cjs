// reclassify_industries.cjs
// Reclassifies primary_industry for all Airtable career records
// Run with: node reclassify_industries.cjs

const AIRTABLE_TOKEN = process.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = "app7CzdOBdcdWpqj4";
const TABLE_ID = "tblIM2gYIKk8Xt6KT";

// Industry classification rules
// Each industry has keywords that if found in name, description, or keywords field → assign that industry
const INDUSTRY_RULES = [
  {
    industry: "Cybersecurity",
    keywords: ["cyber", "security", "hacker", "hacking", "firewall", "malware", "ransomware", "penetration", "infosec", "threat", "vulnerability", "encryption", "forensic", "soc analyst", "network security", "ethical hack", "zero trust", "incident response", "devsecops"]
  },
  {
    industry: "Gaming & Esports",
    keywords: ["game", "gaming", "esport", "esports", "video game", "game design", "game developer", "game dev", "unity", "unreal", "twitch", "streamer", "streaming", "level design", "narrative design", "game engine", "game producer", "loot", "vr game", "ar game"]
  },
  {
    industry: "Marketing & Communications",
    keywords: ["marketing", "brand", "branding", "advertising", "ad agency", "public relations", "pr ", "content creator", "social media manager", "seo", "copywriter", "copywriting", "growth hacker", "influencer", "campaign", "communications", "media buyer", "email marketing", "digital marketing", "brand strategist"]
  },
  {
    industry: "Architecture & Urban Planning",
    keywords: ["architect", "architecture", "urban plan", "urban design", "city plan", "landscape architect", "interior design", "interior architect", "structural engineer", "building design", "zoning", "real estate develop", "construction manag", "bim ", "autocad", "spatial design", "urban develop"]
  },
  {
    industry: "Supply Chain & Operations",
    keywords: ["supply chain", "logistics", "procurement", "warehouse", "inventory", "operations manager", "operations analyst", "fulfillment", "distribution", "manufacturing", "lean", "six sigma", "quality control", "production manager", "plant manager", "industrial engineer", "scm", "erp", "sourcing"]
  },
  {
    industry: "Food & Culinary",
    keywords: ["chef", "culinary", "food", "restaurant", "baker", "baking", "pastry", "nutritionist", "dietitian", "food scientist", "food safety", "catering", "sommelier", "food critic", "food blog", "recipe", "kitchen", "barista", "brew", "winemaker", "food stylist", "meal prep"]
  },
  {
    industry: "Aviation & Transportation",
    keywords: ["pilot", "aviation", "airline", "aircraft", "aerospace", "air traffic", "flight", "drone", "uav", "transportation", "transit", "logistics pilot", "aeronautical", "aerospace engineer", "navy", "maritime", "shipping", "rail", "railroad", "traffic engineer", "autonomous vehicle"]
  },
  {
    industry: "Environment & Sustainability",
    keywords: ["environment", "sustainability", "climate", "renewable", "solar", "wind energy", "green tech", "conservation", "ecology", "wildlife", "carbon", "esg", "clean energy", "environmental scientist", "environmental engineer", "recycling", "waste management", "biodiversity", "marine biologist", "forestry"]
  },
  {
    industry: "Social Impact & Nonprofit",
    keywords: ["nonprofit", "non-profit", "ngo", "social impact", "community organiz", "advocacy", "humanitarian", "philanthropy", "social worker", "public health", "volunteer", "charity", "foundation", "social enterprise", "international development", "aid worker", "human rights", "civic", "activism"]
  },
  {
    industry: "Entrepreneurship",
    keywords: ["entrepreneur", "startup", "founder", "co-founder", "venture", "bootstrapp", "small business", "business owner", "pitch", "accelerator", "incubator", "product launch", "mvp", "side hustle", "solopreneur", "franchise owner", "e-commerce founder"]
  },
  {
    industry: "Fashion & Beauty",
    keywords: ["fashion", "beauty", "cosmetic", "makeup artist", "stylist", "styling", "textile", "clothing", "apparel", "model", "modeling", "runway", "luxury brand", "retail buyer", "fashion design", "beauty industry", "hair stylist", "nail tech", "esthetician", "perfume", "jewelry design"]
  },
  {
    industry: "Sports & Fitness",
    keywords: ["sport", "athlete", "athletic", "fitness", "personal trainer", "coach", "coaching", "physical therapy", "sports medicine", "sports analyst", "sports management", "sports marketing", "gym", "wellness", "yoga", "nutrition coach", "strength", "conditioning", "physio", "referee", "scout"]
  },
  {
    industry: "Education & Coaching",
    keywords: ["teacher", "teaching", "education", "educator", "curriculum", "instructional", "tutor", "tutoring", "professor", "academic", "school", "university", "e-learning", "edtech", "learning design", "training", "coach", "coaching", "mentorship", "special education", "higher ed"]
  },
  {
    industry: "Hospitality & Events",
    keywords: ["hotel", "hospitality", "event", "events", "travel agent", "tourism", "resort", "concierge", "guest services", "event planner", "event manager", "wedding planner", "venue", "catering manager", "front desk", "housekeeping manager", "travel", "cruise", "tour guide", "theme park"]
  },
  {
    industry: "Law & Government",
    keywords: ["lawyer", "attorney", "legal", "law ", "paralegal", "judge", "policy", "government", "politics", "politician", "diplomat", "public policy", "regulatory", "compliance officer", "lobbyist", "legislative", "senator", "mayor", "city council", "prosecutor", "public defender", "civil rights"]
  },
  {
    industry: "Healthcare & Medicine",
    keywords: ["doctor", "physician", "nurse", "nursing", "medical", "medicine", "healthcare", "hospital", "surgeon", "dentist", "pharmacy", "pharmacist", "therapist", "psychologist", "psychiatrist", "radiology", "pathology", "emt", "paramedic", "clinical", "biomedical", "health care", "patient care"]
  },
  {
    industry: "Science & Research",
    keywords: ["scientist", "research", "researcher", "biology", "chemistry", "physics", "neuroscience", "genetics", "genomics", "lab", "laboratory", "data scientist", "marine science", "geology", "astronomy", "astrophysic", "biochemist", "epidemiologist", "statistician", "quantum", "nanotechnology"]
  },
  {
    industry: "Media & Journalism",
    keywords: ["journalist", "journalism", "reporter", "news", "editor", "writer", "author", "podcast", "broadcaster", "media", "film", "documentary", "producer", "director", "screenwriter", "photographer", "videographer", "content", "publishing", "magazine", "newspaper", "television", "radio"]
  },
  {
    industry: "Arts & Performance",
    keywords: ["artist", "musician", "music", "actor", "acting", "theater", "theatre", "dancer", "dance", "performer", "singer", "composer", "choreographer", "art director", "illustrator", "animator", "sculptor", "painter", "gallery", "curator", "opera", "ballet", "circus", "comedy", "standup"]
  },
  {
    industry: "Design & Creative",
    keywords: ["designer", "design", "ux", "ui ", "user experience", "user interface", "graphic design", "product design", "visual design", "motion design", "interaction design", "design thinking", "creative director", "art director", "brand design", "web design", "3d design", "typography", "packaging design"]
  },
  {
    industry: "Business & Finance",
    keywords: ["finance", "financial", "analyst", "banker", "banking", "investment", "investor", "accountant", "accounting", "cfo", "controller", "auditor", "tax", "wealth management", "hedge fund", "private equity", "stock", "trading", "economist", "actuary", "risk management", "fintech", "crypto", "blockchain"]
  },
  {
    industry: "Tech & Engineering",
    keywords: ["software engineer", "software developer", "developer", "programmer", "coding", "coder", "machine learning", "artificial intelligence", "ai ", "ml ", "data engineer", "devops", "cloud", "backend", "frontend", "full stack", "mobile app", "ios developer", "android developer", "computer science", "it ", "sysadmin", "database", "api", "saas", "tech lead", "cto", "product manager", "technical"]
  },
];

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
    console.log(`Fetched ${allRecords.length} records so far...`);
  } while (offset);

  return allRecords;
}

function classifyCareer(record) {
  const fields = record.fields;
  const searchText = [
    fields.name || "",
    fields.description || "",
    fields.keywords || "",
    fields.traits || "",
  ].join(" ").toLowerCase();

  for (const rule of INDUSTRY_RULES) {
    for (const keyword of rule.keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return rule.industry;
      }
    }
  }

  // fallback — keep existing or set to Tech & Engineering
  return fields.primary_industry || "Tech & Engineering";
}

async function updateRecords(records) {
  // Airtable allows max 10 records per PATCH request
  const chunks = [];
  for (let i = 0; i < records.length; i += 10) {
    chunks.push(records.slice(i, i + 10));
  }

  let updated = 0;
  for (const chunk of chunks) {
    const body = {
      records: chunk.map(({ id, newIndustry }) => ({
        id,
        fields: { primary_industry: newIndustry },
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
      console.error(`Update failed:`, err);
    } else {
      updated += chunk.length;
      console.log(`Updated ${updated} records so far...`);
    }

    // Rate limit — Airtable allows 5 requests/sec
    await new Promise(r => setTimeout(r, 250));
  }

  return updated;
}

async function main() {
  console.log("Fetching all records from Airtable...");
  const records = await getAllRecords();
  console.log(`Total records: ${records.length}`);

  console.log("\nClassifying industries...");
  const toUpdate = [];
  const summary = {};

  for (const record of records) {
    const newIndustry = classifyCareer(record);
    const oldIndustry = record.fields.primary_industry || "none";

    if (!summary[newIndustry]) summary[newIndustry] = 0;
    summary[newIndustry]++;

    if (newIndustry !== oldIndustry) {
      toUpdate.push({ id: record.id, newIndustry });
    }
  }

  console.log("\nIndustry distribution after reclassification:");
  Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .forEach(([industry, count]) => {
      console.log(`  ${industry}: ${count}`);
    });

  console.log(`\n${toUpdate.length} records need updating out of ${records.length} total`);

  if (toUpdate.length === 0) {
    console.log("Nothing to update!");
    return;
  }

  console.log("\nUpdating records...");
  const updated = await updateRecords(toUpdate);
  console.log(`\nDone! Updated ${updated} records.`);
}

main().catch(console.error);
