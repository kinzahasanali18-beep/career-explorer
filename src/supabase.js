import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function fetchCareers() {
  const allRecords = [];
  const PAGE = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("careers")
      .select("*")
      .range(from, from + PAGE - 1);

    if (error) throw new Error(`Supabase fetch failed: ${error.message}`);
    allRecords.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  return allRecords.map((r) => ({
    id: r.id,
    name: r.name || "",
    primary_industry: r.primary_industry || "",
    secondary_industries: r.secondary_industries || "",
    description: r.description || "",
    traits: r.traits ? r.traits.split(",").map((t) => t.trim()) : [],
    keywords: r.keywords ? r.keywords.split(",").map((k) => k.trim()) : [],
    salary_range: r.salary_range || "",
    work_style: r.work_style || "",
    degree_required: r.degree_required ? r.degree_required.trim() : "",
    crossover_label: r.crossover_label || "",
    source_url: r.source_url || "",
    reviewed: r.reviewed || false,
  }));
}

export async function fetchReviewedCareers() {
  const all = await fetchCareers();
  return all.filter((c) => c.reviewed === true);
}

export function scoreCareers(careers, keywords) {
  return careers
    .map((c) => {
      let score = 0;
      keywords.forEach((k) => {
        if (c.keywords.includes(k.toLowerCase())) score++;
      });
      if (c.secondary_industries) score += 0.5;
      return { ...c, score };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);
}
