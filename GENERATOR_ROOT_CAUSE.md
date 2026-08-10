# The nightly career generator — root cause analysis

**Short answer: yes, it's the same broken tagging process, and it has three defects that
between them explain most of what the data audit found.** Fixing rows by hand while this
runs is refilling a leaking bucket — it adds new bad rows every night, and every run
reports success while doing it.

## What it is

| | |
|---|---|
| Schedule | `.github/workflows/daily-careers.yml`, cron `0 0 * * *` (midnight UTC; actual runs land ~02:00–03:30 UTC) |
| Script | `scripts/daily_add_careers.cjs` (378 lines) |
| Model | `claude-haiku-4-5-20251001` |
| Writes with | `SUPABASE_SERVICE_KEY` — bypasses RLS, which is why it can insert when the anon key cannot |
| Target | 100 careers/run |
| Actual | 16–37/run, and falling |

Every field except the name and primary industry is model-generated in a single call per
career: description, traits, keywords, salary, secondary industries, work style, degree
requirement, `source_url`, and requirements.

---

## Defect 1 — `$30k–$45k` is a parse-failure fallback, not an estimate

This one line explains the entire 154-row cluster the audit flagged.

```js
function parseK(s) { const m = (s || "").match(/\$?(\d+)k/i); return m ? parseInt(m[1]) : 0; }
```

`parseK` requires a literal `k`. The prompt asks for `$55k-$90k`, but when the model
writes a high salary in full dollars — which is exactly what it does for well-paid roles —
both ends parse to **0**. `snapSalary` then picks the option nearest to `(0, 0)` by
`|Δlow| + |Δhigh|`, and `$30k–$45k` has the **lowest sum of any option in the list (75)**.

Verified against the shipped function:

| Input | Result |
|---|---|
| `"$220,000-$450,000"` | **`$30k–$45k`** |
| `"$180,000-$300,000"` | **`$30k–$45k`** |
| `"220000-450000"` | **`$30k–$45k`** |
| `"$55k-$90k"` | `$55k–$90k` (correct) |
| `""` | `$45k–$80k` (the explicit default) |

So the highest-paid careers in the database are systematically assigned the **lowest**
salary band. That is precisely why `Anesthesiologist`, `Cardiac Surgeon`, `Neurosurgeon`
and `Deputy District Attorney` all sit at `$30k–$45k` — not because anyone estimated that,
but because their real salaries were unparseable and `$30k–$45k` is the nearest neighbour
to zero.

Secondary issue: even when parsing succeeds, salaries are snapped to a hand-maintained
list of ~150 allowed bands, so real values are quantised to whatever is closest.

---

## Defect 2 — the generator can only reach 15 of the app's 22 industries

`VALID_INDUSTRIES` in the script lists 15. `INDUSTRY_CONFIG` in `src/App.jsx` lists 22.
These **seven can never be assigned to a new career**:

- Architecture & Urban Planning
- Aviation & Transportation
- Cybersecurity
- Food & Culinary
- Gaming & Esports
- Marketing & Communications
- Supply Chain & Operations

Consequences:

1. Every row in those seven industries is legacy April-import data. They are **frozen** —
   the app offers seven sidebar filters that will never gain new content.
2. Careers that genuinely belong there get collapsed elsewhere or dropped. `mapIndustry`
   returns `null` for `Urban Planning`, `Gaming` and `Aviation`, and `null` means the
   career is **silently skipped** (`⚠ Skipping … unmappable industry`).
3. `Supply Chain & Operations` → Business & Finance and `Marketing & Communications` →
   Media & Journalism are hard-coded collapses, which is why marketing roles keep landing
   under Media & Journalism.

This is the same root problem as audit finding #16: the industry vocabulary is defined
independently in five places (`App.jsx`, `CareerTimeline.jsx`, `WhenToApply.jsx`,
`ProfilePage.jsx`, `OnboardingQuiz.jsx`) and now a sixth here — and they disagree.

---

## Defect 3 — `mapIndustry` uses substring matching, the same bug I fixed by hand

```js
for (const [key, val] of Object.entries(INDUSTRY_MAP)) {
  if (lower.includes(key)) return val;   // first match wins, insertion-ordered
}
```

`INDUSTRY_MAP` contains the entry `"it": "Tech & Engineering"`. `"it"` is a substring of a
great many words, and it is checked before most other keys. Verified against the shipped
function:

| Input | Mapped to | Why |
|---|---|---|
| `Hospitality Management` | **Tech & Engineering** | `"hospitality"` contains `"it"` |
| `Digital Marketing` | **Tech & Engineering** | `"digital"` contains `"it"` |
| `Political Science` | **Tech & Engineering** | `"political"` contains `"it"` |
| `Architecture` | Design & Creative | explicit mapping at line 63 |
| `Urban Planning` | `null` → career dropped | no rule |
| `Gaming` | `null` → career dropped | no rule |
| `Aviation` | `null` → career dropped | no rule |

This is exactly the defect class of the 11 rows I just corrected by hand — a keyword
appearing inside an unrelated word deciding the industry. The manual fix treated symptoms;
this loop is the cause.

---

## Defect 4 — 92% of generated careers are thrown away, and the yield is collapsing

The model is shown a truncated "avoid" list:

```js
const avoid = existingNames.length > 400
  ? existingNames.slice(0, 400).join(", ") + " ... (truncated)"
  : existingNames.join(", ");
```

It sees **400 of 7,016 existing names (5.7%)** — but deduplication runs against all 7,016.
So it confidently regenerates careers it cannot see, and they are filtered out. From the
2026-08-10 run log:

```
7016 existing careers found.
Generated 105, valid after dedup: 8          <- 92% rejected
⚠ Only 8 names — running supplemental batch...
Generated 105, valid after dedup: 14
Processing 22 careers...
✅ Created: 22   ❌ Failed: 0
```

And it is getting worse as the table grows:

| Run | Table size | Created |
|---|---|---|
| 2026-07-30 | 6,655 | 37 |
| 2026-08-02 | 6,728 | 35 |
| 2026-08-06 | 6,852 | 33 |
| 2026-08-08 | 6,982 | **16** |
| 2026-08-09 | 6,998 | 18 |
| 2026-08-10 | 7,016 | 22 |

Output has roughly halved while the table grew 5%. The mechanism is self-limiting: the
larger the table, the smaller the visible fraction, the higher the duplicate rate. It will
keep decaying toward zero.

**Every one of those runs is reported as `success`.** The script only exits non-zero when
`fail > 0`, and `fail` counts generation/insert *errors* — not the 78-career shortfall.
Nothing anywhere notices that a job targeting 100 delivered 22.

---

## Defect 5 — near-duplicate names pass deduplication

Dedup is exact-lowercase name matching only:

```js
if (!key || existingLower.has(key) || seen.has(key)) continue;
```

So `Fact Checker (Digital Media)` and `Fact-Checker (Media Literacy)` both survive, as do
four separate ESL rows and `Mergers & Acquisitions Specialist` / `Merger & Acquisition
Specialist`. This is the direct cause of the 164 near-identical description pairs in
`reports/careers_q3a_near_identical_descriptions.csv` — and because each duplicate is
tagged independently, they get contradictory industries.

---

## Defect 6 — `source_url` is model-generated and unverified

The prompt asks for a *"Real URL from https://www.bls.gov/ooh/ or
https://www.onetonline.org/link/summary/ for closest occupation"*. Nothing validates that
the URL resolves or matches the occupation. These are the citations the app shows users as
its evidence base. Worth spot-checking a sample before trusting any of them.

Related: `reviewed` is never set, so every one of the 7,038 rows is `reviewed = false` and
there is no way to distinguish audited rows from untouched ones.

---

## Recommended fix order

Ranked by value per unit of effort. The first two are small and account for most of the
damage.

1. **Fix `parseK` / `snapSalary`** (~5 lines). Accept `$220,000`, `220k`, commas, and
   ranges without `k`. Critically, when parsing fails, **return null and skip the career**
   rather than silently snapping to the lowest band. Kills the `$30k–$45k` cluster at
   source.
2. **Share one industry vocabulary.** Export the 22 industries from a single module used by
   both the app and this script. Removes the seven unreachable industries and prevents
   further drift.
3. **Replace the substring loop** with exact-match lookup plus an explicit alias table, and
   delete the `"it"` entry. Log unmapped values instead of dropping careers silently.
4. **Fix dedup blindness.** Send a random sample rather than the first 400, or better,
   send the model the industry it should target plus that industry's existing names only.
   Log the rejection rate every run.
5. **Make shortfall a failure.** Exit non-zero, or at least warn loudly, when
   `created < 0.8 × TARGET`. Right now a 78% miss is invisible.
6. **Validate `source_url`**, or stop displaying it as a source.

Items 1–3 stop new bad rows. Only then is manual cleanup of the existing ~2,530
questionable rows worth doing, because until then the backlog regrows nightly.

## How this was verified

The tables above are not readings of the code — the pure functions (`VALID_INDUSTRIES`,
`INDUSTRY_MAP`, `mapIndustry`, `SALARY_OPTIONS`, `parseK`, `snapSalary`) were extracted
verbatim from `scripts/daily_add_careers.cjs` and executed directly against the inputs
shown. Run logs came from `gh run view --log` on the actual scheduled runs.
