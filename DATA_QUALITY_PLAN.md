# Plan: source validation, source display, duplicate cleanup

Investigation only — **no code written, no database changes made.** All figures below are
measured against the live table (7,038 rows), not estimated.

---

# Rule 1 — Source validation

## The real number

My earlier "~20% broken" came from 25 O*NET URLs. It was low, because it never sampled
BLS, which is far worse. Measured across **all 1,197 distinct source URLs covering all
7,038 rows**:

| State | Rows | Share | Confidence |
|---|---|---|---|
| **Valid** | 4,702 | **66.8%** | verified against taxonomy / archive |
| Broken — O*NET SOC code does not exist | 639 | 9.1% | **conclusive** |
| Broken — BLS `/ooh/<group>/` does not exist | 986 | 14.0% | **conclusive** |
| Suspect — BLS group real, page never archived | 711 | 10.1% | strong, not proof |

- **Conclusively broken: 1,625 rows (23.1%)**
- **Broken or suspect: 2,336 rows (33.2%)**

Every row has a source URL — 4,260 cite O*NET, 2,778 cite BLS, none are empty. The BLS
citations fail at **61%**, versus 15% for O*NET.

## How I validated without 1,197 requests

**O*NET — conclusive.** One request to `onetonline.org/find/all` yields all **1,016 valid
SOC codes**; validation is then set membership. The failures are invented codes, mostly
fabricated detail-occupation suffixes (`27-2042.01`, `11-9151.02`) and 288 rows' worth of
invented `.00` base codes.

**BLS — blocked.** `bls.gov` returns **403 to plain curl, browser-UA curl, full browser
headers, and WebFetch**. I used the Wayback CDX index instead: 1,054 distinct
`/ooh/*.htm` paths ever archived with HTTP 200. Sanity-checked on known-good
(`/ooh/legal/lawyers.htm` — present) and invented (`/ooh/totally-made-up/...` — absent)
paths.

The failure mode is invented path segments — the occupation is often real but filed under
a directory that doesn't exist:

| Cited (broken) | Rows | Real path |
|---|---|---|
| `/ooh/business-and-financial-operations/financial-analysts.htm` | 110 | `/ooh/business-and-financial/…` |
| `/ooh/education-and-training/high-school-teachers.htm` | 56 | `/ooh/education-training-and-library/…` |
| `/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm` | 29 | `/ooh/healthcare/…` |
| `/ooh/life-physical-social-science/environmental-scientists…` | 32 | `/ooh/life-physical-and-social-science/…` |

261 distinct broken URLs use a `/ooh/<group>/` that appears in no archived path at all —
that subset is conclusive without relying on Wayback coverage.

## Proposed write-time validation

**Stop asking the model for a URL. Ask for an O*NET SOC code, and build the URL ourselves.**

This is the key move. Today the model can hallucinate the domain, the path shape, the
directory *and* the identifier. If it returns only `27-1027.00`, the only thing it can get
wrong is the code — and a code is checkable against a cached list in memory, with zero
network calls per career.

```
prompt:  "…soc_code: the O*NET SOC code for the closest occupation, e.g. 27-1027.00"
verify:  soc_code ∈ cached taxonomy (1,016 codes, refreshed weekly)  → else retry, then skip
store:   source_url = `https://www.onetonline.org/link/summary/${soc_code}`
```

**Drop BLS as a citation source.** It cannot be validated from CI at all — not by curl, not
by WebFetch — and it accounts for 61% of the broken rows. O*NET covers every occupation BLS
OOH does, is machine-checkable, and is the source that already works. Keeping an
unverifiable citation class means permanently guessing about 39% of the catalogue.

This slots into the existing retry loop and mirrors exactly how the salary fix now works:
unparseable → `null` → retry → skip, with a logged reason.

## Proposed one-time pass over existing rows

The classification already exists for all 7,038 rows from this investigation. Deliverable
is a CSV of the 2,336 failures with their tier, then re-sourcing in two stages:

1. **Mechanical repair first.** Many BLS failures are a wrong directory on a real
   occupation. Matching the slug against the 1,054 known-good paths fixes those without
   involving the model at all.
2. **Model re-sourcing for the rest**, asking for a SOC code and validating it as above.

## Hide now, or flag first?

**Flag first. Hiding immediately would gut the app.**

Enforcing "no valid source, no card" today removes **2,336 of 7,038 rows (33.2%)**, and it
is not evenly spread:

| Industry | Hidden | Share |
|---|---|---|
| Healthcare & Medicine | 219 / 340 | **64.4%** |
| Business & Finance | 202 / 330 | **61.2%** |
| Hospitality & Events | 153 / 333 | 45.9% |
| Environment & Sustainability | 184 / 445 | 41.3% |
| Science & Research | 236 / 596 | 39.6% |

Losing two thirds of Healthcare would read as a broken app, not a careful one.

**Recommended sequencing:** enforce the gate on *new* rows immediately (it cannot get
worse), flag existing rows, backfill, and only then enforce retroactively — with a
threshold, e.g. switch on hiding per industry once ≥95% of that industry validates.

---

# Rule 2 — Display the source citation

## Where it fits

**On the career detail page (`CareerTimeline.jsx`), not the grid card.** `CareerCard` is a
13px title, industry pills and a 78-character truncated description — there is no room for
a citation, and adding one would crowd the star control that is already only ~16px.

**Reuse the link pattern the app already has.** `HiddenGems.jsx:280` renders
*"Official program page ↗"* and `WhenToApply.jsx:377` renders *"Apply / Learn more ↗"*,
both as `<a target="_blank" rel="noopener noreferrer">` with identical styling. A source
citation should be the same component, which also chips away at audit finding #29
(the same element implemented differently in different places).

**Placement:** directly beneath the salary pill and `SalaryNote`. That block is where the
sourced claim actually lives, and `SalaryNote` already establishes the small-muted-caption
precedent there. Rendering:

```
$55k–$90k   ☆ Star
Estimated national average — actual pay varies by location and company.
Source: O*NET — Set and Exhibit Designers ↗
```

## The label needs no schema change

I extracted **1,007 SOC-code → occupation-title pairs** from the same single O*NET page, so
`27-1027.00` renders as "Set and Exhibit Designers" from a cached lookup. BLS slugs are
already human-readable (`/ooh/legal/lawyers.htm` → "Lawyers").

**Render nothing when validation fails** — never a broken link. That makes the citation a
visible reward for a valid source rather than a new surface for bad data.

## One thing to decide before switching this on

**A URL that resolves is not the same as a correct citation, and this cannot be automated.**
Of the 4,687 rows with a valid source, only 31% share a stemmed word with the occupation
they cite. But word overlap is a poor test in both directions — the 69% without overlap
contains correct citations (`Defense Attorney` → *Lawyers*, `Equity Researcher` →
*Financial and Investment Analysts*) alongside clear errors (`Virtual Production
Supervisor` → *Actors*, `Pop-Up Shop Operator` → *Industrial Production Managers*,
`AI Automation Consultant Entrepreneur` → *Chief Sustainability Officers*).

Displaying sources raises the stakes: right now a wrong citation is invisible; afterwards
it is an authority claim shown to a student. I'd hand-check ~50 valid-source rows to
estimate the mis-citation rate before enabling display.

---

# Rule 3 — Clean up existing duplicates

## Current scale

Recomputed on the live 7,038 rows with the same normalisation the generator now uses:

- **594 clusters**, **1,910 rows** (27.1%), **1,316 removable**, leaving **5,722**
- Sizes range from 347 pairs up to one 28-row cluster (`fact checker`)
- **254 clusters (43%) span more than one industry**

## The dry run found a flaw in the obvious approach

I prototyped the scoring you suggested — most complete description, valid source, cleanest
name — and it **systematically selects mistagged rows**:

| Cluster | Plurality industry | But the clean-named row is tagged |
|---|---|---|
| `fact checker` (28) | Media & Journalism (24/28) | **Hospitality & Events** |
| `social media manager` (17) | Media & Journalism (13/17) | **Gaming & Esports** |
| `interaction designer` (17) | Design & Creative (15/17) | **Science & Research** |

Preferring the tidy name "Fact Checker" would keep the one row filed under Hospitality &
Events and delete all 24 correctly-filed ones.

**Corrected selection — industry first, then content:**

1. **Canonical industry** = plurality vote within the cluster (ties broken by which
   industry has more valid sources). The cluster is its own evidence.
2. **Keeper** = among rows in that industry: valid source → longest description → oldest
   `created_at` → `id` for determinism.
3. **Rename the keeper** to the cluster's cleanest name form, so the result is
   `Fact Checker` **[Media & Journalism]** rather than `Fact Checker (Media Organization)`.

A useful side effect: because step 1 votes on industry, the cleanup **also repairs tag
errors** — it is a fix for finding #16 as well as a de-duplication.

## Do not hard-delete

Three reasons:

1. **45% of clusters have mostly dissimilar descriptions** (mean pairwise token similarity
   < 0.25), so some are plausibly genuine specialisations rather than duplicates.
2. **16% of clusters (93) have no member with a valid source**, so under Rule 1 there is
   nothing in them worth keeping — cleanup and re-sourcing interact and should be ordered.
3. **`saved_careers` exposure is unmeasurable from here.** RLS scopes that table to
   `auth.uid()`, so the anon key sees zero rows. I cannot tell how many starred careers sit
   in the removable set, nor whether the foreign key cascades. Deleting could silently empty
   real users' shortlists.

**Recommend a soft merge:** add `duplicate_of uuid references careers(id)`, point removed
variants at their keeper, and have the app filter `duplicate_of is null`. Reversible, zero
data loss, and starred rows still resolve — a shortlist entry pointing at a merged variant
can be redirected to the keeper rather than vanishing.

## Tiering

| Tier | Criteria | Clusters | Rows collapsed |
|---|---|---|---|
| **1 — safe to automate** | single industry + cohesive descriptions + ≥1 valid source | **161** | **319** |
| **2 — human review** | anything else | **433** | 997 |

Tier 2 is 73% of clusters. It should ship as a reviewable CSV — cluster, members, proposed
keeper, proposed industry, and the reason it was held back — not as a script that deletes.

---

# Proposed order of work

1. **Rule 1 write-time gate** (SOC code + validation, drop BLS). Stops new bad sources.
   Smallest change, immediate effect.
2. **Rule 3 Tier 1 soft merge** — 161 clusters, 319 rows, with the corrected
   industry-first selection. Add `duplicate_of`, no deletion.
3. **Rule 1 backfill** — mechanical BLS→real-path repair, then model re-sourcing.
4. **Rule 2 display**, gated on validation, after a manual mis-citation spot-check.
5. **Rule 3 Tier 2** review CSV.
6. **Enforce hiding** per industry once coverage justifies it.

# Pre-checks I could not run

Two schema questions that block parts of this, both one query in the SQL editor:

```sql
-- Does deleting/merging a career affect users' saved lists?
select conname, pg_get_constraintdef(oid) from pg_constraint
where conrelid = 'public.saved_careers'::regclass;

-- Still outstanding from the salary fix: is salary_range constrained to a value list?
select conname, pg_get_constraintdef(oid) from pg_constraint
where conrelid = 'public.careers'::regclass and contype = 'c';
```
