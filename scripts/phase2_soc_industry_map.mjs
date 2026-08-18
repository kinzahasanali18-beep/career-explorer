// scripts/phase2_soc_industry_map.mjs
//
// SOC code -> one of the app's 22 industries.
//
// Keyed by SOC prefix, longest prefix wins. `spec` records how specific the
// winning prefix was, because that drives proposal confidence: a 6-char prefix
// ("29-1141") is a named occupation and maps precisely, while a 2-char prefix
// ("29") is a whole major group and only maps approximately.
//
// Derived from the O*NET-SOC 2019 structure (major group -> minor group ->
// detailed occupation). Where a major group straddles several of our industries
// — 27 spans Arts, Design, Sports and Media; 21 splits counselling from social
// work — the minor groups are enumerated rather than letting the major group
// decide.

export const IND = {
  ARTS: "Arts & Performance",
  FIN: "Business & Finance",
  DESIGN: "Design & Creative",
  EDU: "Education & Coaching",
  ENTRE: "Entrepreneurship",
  ENV: "Environment & Sustainability",
  FASHION: "Fashion & Beauty",
  HC: "Healthcare & Medicine",
  HOSP: "Hospitality & Events",
  LAW: "Law & Government",
  MEDIA: "Media & Journalism",
  SCI: "Science & Research",
  SOCIAL: "Social Impact & Nonprofit",
  SPORT: "Sports & Fitness",
  TECH: "Tech & Engineering",
  ARCH: "Architecture & Urban Planning",
  AVI: "Aviation & Transportation",
  CYBER: "Cybersecurity",
  FOOD: "Food & Culinary",
  GAME: "Gaming & Esports",
  MKT: "Marketing & Communications",
  SUPPLY: "Supply Chain & Operations",
};

// prefix -> [industry, ...alternates]. Alternates are genuinely plausible
// secondary homes, used to soften a mismatch verdict rather than to propose.
export const SOC_MAP = {
  // ── 11 Management ──
  "11": [IND.FIN],
  "11-1011": [IND.FIN, IND.ENTRE],
  "11-2": [IND.MKT],
  "11-3021": [IND.TECH],
  "11-3031": [IND.FIN],
  "11-3051": [IND.SUPPLY],
  "11-3061": [IND.SUPPLY],
  "11-3071": [IND.SUPPLY, IND.AVI],
  "11-3111": [IND.FIN],
  "11-3121": [IND.FIN],
  "11-3131": [IND.EDU],
  "11-9013": [IND.ENV],
  "11-9021": [IND.ARCH],
  "11-9031": [IND.EDU],
  "11-9032": [IND.EDU],
  "11-9033": [IND.EDU],
  "11-9039": [IND.EDU],
  "11-9041": [IND.TECH],
  "11-9051": [IND.FOOD, IND.HOSP],
  "11-9071": [IND.HOSP],
  "11-9072": [IND.HOSP],
  "11-9081": [IND.HOSP],
  "11-9111": [IND.HC],
  "11-9121": [IND.SCI],
  "11-9131": [IND.SUPPLY],
  "11-9141": [IND.FIN],
  "11-9151": [IND.SOCIAL],
  "11-9161": [IND.LAW],
  "11-9179": [IND.HOSP],

  // ── 13 Business & Financial Operations ──
  "13": [IND.FIN],
  "13-1011": [IND.ARTS],
  "13-1020": [IND.SUPPLY],
  "13-1021": [IND.SUPPLY],
  "13-1022": [IND.SUPPLY],
  "13-1023": [IND.SUPPLY],
  "13-1041": [IND.LAW],
  "13-1081": [IND.SUPPLY],
  "13-1121": [IND.HOSP],
  "13-1131": [IND.SOCIAL],
  "13-1161": [IND.MKT],

  // ── 15 Computer & Mathematical ──
  "15": [IND.TECH],
  "15-1212": [IND.CYBER],
  "15-1299": [IND.TECH, IND.CYBER],

  // ── 17 Architecture & Engineering ──
  "17": [IND.TECH],
  "17-1011": [IND.ARCH],
  "17-1012": [IND.ARCH],
  "17-1022": [IND.ARCH],
  "17-2011": [IND.AVI],
  "17-2051": [IND.ARCH],
  "17-2081": [IND.ENV],

  // ── 19 Life, Physical & Social Science ──
  "19": [IND.SCI],
  "19-2041": [IND.ENV],
  "19-3031": [IND.HC],
  "19-3033": [IND.HC],
  "19-4091": [IND.ENV],
  "19-5011": [IND.HC],

  // ── 21 Community & Social Service ──
  "21": [IND.SOCIAL],
  "21-1011": [IND.HC],
  "21-1012": [IND.EDU],
  "21-1013": [IND.HC],
  "21-1014": [IND.HC],
  "21-1015": [IND.HC],
  "21-1018": [IND.HC],
  "21-1019": [IND.HC],
  "21-1021": [IND.SOCIAL],
  "21-1022": [IND.SOCIAL, IND.HC],
  "21-1023": [IND.SOCIAL, IND.HC],
  "21-1029": [IND.SOCIAL],
  "21-1091": [IND.HC],
  "21-1092": [IND.LAW],
  "21-1093": [IND.SOCIAL],
  "21-1094": [IND.HC],
  "21-2": [IND.SOCIAL],

  // ── 23 Legal ──
  "23": [IND.LAW],

  // ── 25 Education ──
  "25": [IND.EDU],
  "25-4012": [IND.ARTS],
  "25-4013": [IND.ARTS],

  // ── 27 Arts, Design, Entertainment, Sports & Media ──
  "27": [IND.ARTS],
  "27-1011": [IND.DESIGN],
  "27-1012": [IND.ARTS],
  "27-1013": [IND.ARTS],
  "27-1014": [IND.DESIGN, IND.GAME],
  "27-1019": [IND.ARTS],
  "27-1021": [IND.DESIGN],
  "27-1022": [IND.FASHION],
  "27-1023": [IND.DESIGN],
  "27-1024": [IND.DESIGN],
  "27-1025": [IND.DESIGN],
  "27-1026": [IND.DESIGN],
  "27-1027": [IND.DESIGN],
  "27-1029": [IND.DESIGN],
  "27-2011": [IND.ARTS],
  "27-2012": [IND.MEDIA, IND.ARTS],
  "27-2021": [IND.SPORT],
  "27-2022": [IND.SPORT],
  "27-2023": [IND.SPORT],
  "27-2031": [IND.ARTS],
  "27-2032": [IND.ARTS],
  "27-2041": [IND.ARTS],
  "27-2042": [IND.ARTS],
  "27-3011": [IND.MEDIA],
  "27-3023": [IND.MEDIA],
  "27-3031": [IND.MKT],
  "27-3041": [IND.MEDIA],
  "27-3042": [IND.MEDIA],
  "27-3043": [IND.MEDIA],
  "27-3091": [IND.MEDIA],
  "27-4": [IND.MEDIA],

  // ── 29 / 31 Healthcare ──
  "29": [IND.HC],
  "31": [IND.HC],

  // ── 33 Protective Service ──
  "33": [IND.LAW],
  "33-9092": [IND.SPORT],

  // ── 35 Food Preparation & Serving ──
  "35": [IND.FOOD],

  // ── 37 Building & Grounds ──
  "37": [IND.SUPPLY],
  "37-3": [IND.ENV],

  // ── 39 Personal Care & Service ──
  "39": [IND.HOSP],
  "39-2": [IND.ENV],
  "39-5": [IND.FASHION],
  "39-7": [IND.HOSP],
  "39-9031": [IND.SPORT],
  "39-9032": [IND.HOSP],

  // ── 41 Sales ──
  "41": [IND.FIN],
  "41-3011": [IND.MKT],
  "41-9021": [IND.FIN],

  // ── 43 Office & Administrative Support ──
  "43": [IND.FIN],
  "43-5": [IND.SUPPLY],

  // ── 45 Farming, Fishing & Forestry ──
  "45": [IND.ENV],

  // ── 47 Construction & Extraction ──
  "47": [IND.ARCH],

  // ── 49 Installation, Maintenance & Repair ──
  "49": [IND.TECH],
  "49-3": [IND.AVI],

  // ── 51 Production ──
  "51": [IND.SUPPLY],
  "51-3": [IND.FOOD],
  "51-6": [IND.FASHION],

  // ── 53 Transportation & Material Moving ──
  "53": [IND.AVI],
  "53-7": [IND.SUPPLY],

  // ── 55 Military ──
  "55": [IND.LAW],
};

// Prefixes this coarse cover too many unrelated industries to justify a
// proposal on their own; a hit here is reported for review, not auto-applied.
export const BROAD_ONLY = new Set(["11-9199", "13-1199", "27-1099", "39-9099", "41-2", "43-9", "51-9", "11", "43"]);

// SOC major groups that map to exactly one of our 22 industries for every
// occupation they contain. A 2-digit match here is coarse but not ambiguous, so
// it should not be penalised the way a hit on major group 11 (Management, which
// spans finance, tech, education, hospitality and more) or 27 (Arts, Design,
// Sports and Media at once) has to be.
//
// Deliberately excluded despite being tempting:
//   33 Protective Service   — mostly Law & Government, but includes lifeguards
//   47 Construction         — mapped to Architecture & Urban Planning out of
//                             necessity; it is the closest of the 22, not a
//                             genuine match, so it stays reviewable
//   53 Transportation       — splits between Aviation and Supply Chain
export const UNAMBIGUOUS_MAJOR = new Map([
  ["23", IND.LAW],     // Legal — every occupation
  ["25", IND.EDU],     // Education, Training & Library (curators/museum techs
                       //   are overridden at 7-char precision above)
  ["29", IND.HC],      // Healthcare Practitioners & Technical
  ["31", IND.HC],      // Healthcare Support
  ["35", IND.FOOD],    // Food Preparation & Serving
  ["45", IND.ENV],     // Farming, Fishing & Forestry
]);

/** Longest-prefix lookup. Returns {industry, alternates, spec} or null. */
export function industryForSoc(code) {
  if (!code) return null;
  let bestKey = null;
  for (const key of Object.keys(SOC_MAP)) {
    if (code.startsWith(key) && (!bestKey || key.length > bestKey.length)) bestKey = key;
  }
  if (!bestKey) return null;
  const [industry, ...alternates] = SOC_MAP[bestKey];
  return { industry, alternates, spec: bestKey.length, prefix: bestKey };
}
