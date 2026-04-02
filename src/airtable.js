// src/airtable.js
// Fetches career data from Airtable for Sparq

const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = "app7CzdOBdcdWpqj4";
const TABLE_ID = "tblIM2gYIKk8Xt6KT";

export async function fetchCareers() {
  const allRecords = [];
  let offset = null;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Airtable fetch failed: ${res.status}`);
    }

    const data = await res.json();
    allRecords.push(...data.records);
    offset = data.offset || null;
  } while (offset);

  // Map Airtable records to the shape the app expects
  return allRecords.map((r) => ({
    id: r.id,
    name: r.fields.name || "",
    primary_industry: r.fields.primary_industry || "",
    secondary_industries: r.fields.secondary_industries || "",
    description: r.fields.description || "",
    traits: r.fields.traits ? r.fields.traits.split(",").map((t) => t.trim()) : [],
    keywords: r.fields.keywords ? r.fields.keywords.split(",").map((k) => k.trim()) : [],
    salary_range: r.fields.salary_range || "",
    crossover_label: r.fields.crossover_label || "",
    source_url: r.fields.source_url || "",
    reviewed: r.fields.reviewed || false,
  }));
}

// Filter to only reviewed careers for student-facing app
export async function fetchReviewedCareers() {
  const all = await fetchCareers();
  return all.filter((c) => c.reviewed === true);
}

// Score careers against quiz answer keywords
export function scoreCareers(careers, keywords) {
  return careers
    .map((c) => {
      let score = 0;
      keywords.forEach((k) => {
        if (c.keywords.includes(k.toLowerCase())) score++;
      });
      // Bonus point for crossover careers when multiple industries match
      if (c.secondary_industries) {
        score += 0.5;
      }
      return { ...c, score };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);
}
