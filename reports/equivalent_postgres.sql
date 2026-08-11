-- Careers data-quality queries — Postgres equivalents of the generated CSVs.
-- ALL READ-ONLY. Nothing here writes, updates or deletes.
-- Run in the Supabase SQL editor. Salary strings look like '$35k–$65k' (en dash).

-- Shared helper: parse the floor/ceiling out of salary_range.
create or replace view v_careers_salary as
select id, name, primary_industry, secondary_industries, salary_range, description, created_at,
       (regexp_match(salary_range, '\$(\d+)k?'))[1]::int                as floor_k,
       (regexp_match(salary_range, '[–\-—]\s*\$(\d+)k?'))[1]::int       as ceil_k
from public.careers;

-- ─── Q1: senior-sounding title, entry-level floor ────────────────────────────
with seniority(pattern, tier, min_floor_k) as (values
  ('%chief %','executive',90), ('%vice president%','executive',90), ('vp %','executive',90),
  ('%head of %','executive',80), ('%director%','executive',75), ('%executive %','executive',75),
  ('%principal %','senior_ic',80), ('%architect%','senior_ic',75),
  ('senior %','senior_ic',70), ('%lead %','senior_ic',70), ('lead %','senior_ic',70)
)
select distinct on (c.id)
       c.name as career, c.primary_industry as industry, c.salary_range as listed_salary,
       c.floor_k, c.ceil_k as ceiling_k, s.tier as seniority_tier,
       s.min_floor_k as expected_min_floor_k, (s.min_floor_k - c.floor_k) as shortfall_k
from v_careers_salary c
join seniority s on lower(c.name) like s.pattern
where c.floor_k is not null and c.floor_k < s.min_floor_k
order by c.id, (s.min_floor_k - c.floor_k) desc;
-- then: order by shortfall_k desc

-- ─── Q2: floor below the BLS 10th percentile for the matched occupation ──────
-- Approximate May 2024 OEWS/OOH p10 values, set conservatively so a hit is a
-- clear violation. Extend this list to widen coverage.
with bls(pattern, occupation, p10_k, ord) as (values
  ('physician|surgeon|anesthesiolog|radiolog|psychiatrist','Physicians and surgeons',100,1),
  ('pharmacist','Pharmacists',130,2),
  ('nurse practitioner|nurse anesthetist|nurse midwife','Nurse practitioners',95,3),
  ('physician assistant','Physician assistants',90,4),
  ('dentist|orthodontist','Dentists',90,5),
  ('veterinarian','Veterinarians',70,6),
  ('physical therapist','Physical therapists',70,7),
  ('occupational therapist','Occupational therapists',65,8),
  ('registered nurse','Registered nurses',63,9),
  ('lawyer|attorney|counsel','Lawyers',73,10),
  ('data architect|database architect','Database architects',81,11),
  ('software (engineer|developer)','Software developers',71,12),
  ('information security|cybersecurity (analyst|engineer)','Information security analysts',70,13),
  ('aerospace engineer','Aerospace engineers',75,14),
  ('electrical engineer','Electrical engineers',68,15),
  ('chemical engineer','Chemical engineers',70,16),
  ('mechanical engineer','Mechanical engineers',62,17),
  ('civil engineer','Civil engineers',60,18),
  ('actuary','Actuaries',70,19),
  ('public relations manager','Public relations managers',73,20),
  ('marketing manager','Marketing managers',80,21),
  ('financial manager','Financial managers',80,22),
  ('human resources manager','Human resources managers',75,23),
  ('air traffic controller','Air traffic controllers',75,24),
  ('(building|construction) inspector','Construction and building inspectors',45,25),
  ('(probation|parole) officer','Probation officers',42,26),
  ('dental hygienist','Dental hygienists',65,27),
  ('economist','Economists',65,28)
),
matched as (
  select c.*, b.occupation, b.p10_k,
         row_number() over (partition by c.id order by b.ord) as rn
  from v_careers_salary c
  join bls b on lower(c.name) ~ b.pattern
  where c.floor_k is not null
)
select name as career, primary_industry as industry, salary_range as listed_salary,
       floor_k, occupation as bls_occupation, p10_k as bls_p10_k,
       (p10_k - floor_k) as shortfall_k
from matched
where rn = 1 and floor_k < p10_k
order by shortfall_k desc, career;

-- ─── Q2b: zero or unparseable floors ─────────────────────────────────────────
select name as career, primary_industry as industry, salary_range as listed_salary,
       floor_k, ceil_k,
       case when floor_k = 0 then 'zero floor' else 'unparseable' end as issue
from v_careers_salary
where floor_k = 0 or floor_k is null
order by primary_industry, name;

-- ─── Q4: keyword-collision industry tags ─────────────────────────────────────
select name as career, primary_industry as current_primary,
       secondary_industries as current_secondary, salary_range as listed_salary,
       'Tech & Engineering' as suggested_primary
from public.careers
where lower(name) like '%architect%'
  and primary_industry = 'Architecture & Urban Planning'
  and lower(name) ~ 'cloud|software|data|solution|enterprise|system|security|network|information|technical|iot'
order by name;

-- Related sweep: Architecture & Urban Planning used as a SECONDARY tag (349 rows).
select name, primary_industry, secondary_industries
from public.careers
where secondary_industries like '%Architecture & Urban Planning%'
order by primary_industry, name;

-- ─── Q5: suspected default salary band ───────────────────────────────────────
select name as career, primary_industry as industry, salary_range, created_at
from public.careers
where salary_range = '$30k–$45k'
order by primary_industry, name;

-- Supporting evidence: how concentrated are salary bands overall?
select salary_range, count(*) as n, count(distinct primary_industry) as industries
from public.careers
group by salary_range
order by n desc
limit 20;

-- ─── Q3: duplicate descriptions with contradictory tags ──────────────────────
-- The CSVs use token-set Jaccard similarity, which Postgres can approximate with
-- pg_trgm. Enable the extension first: create extension if not exists pg_trgm;
select a.name as career_a, a.primary_industry as primary_a,
       b.name as career_b, b.primary_industry as primary_b,
       round(similarity(a.description, b.description)::numeric, 3) as desc_similarity
from public.careers a
join public.careers b
  on a.id < b.id
 and a.primary_industry <> b.primary_industry
 and a.description % b.description          -- trigram similarity above threshold
where similarity(a.description, b.description) > 0.55
order by desc_similarity desc;
-- Note: pg_trgm's trigram similarity is not identical to the token-set Jaccard
-- used for the CSVs, so counts will differ somewhat. The CSV remains the
-- reference output.
