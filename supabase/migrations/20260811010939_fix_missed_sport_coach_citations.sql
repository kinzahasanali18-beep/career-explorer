-- Follow-up to the beauty/coach re-mapping: sport coaches the first pass missed.
--
-- The first pass anchored its sport keywords as \b(swim|skat|climb|wrestl)\b,
-- intending them as stems. Anchoring both ends means "swim" cannot match
-- "Swimming" or "skat" match "Skating", so a Swimming Coach, a Figure Skating
-- Coach and a Rock Climbing Instructor stayed on Amusement and Recreation
-- Attendants. Fixing the earlier substring-collision bug had introduced an
-- over-anchoring bug in the opposite direction.
--
-- The stems now allow inflections (swim\w*, skat\w*, climb\w*). "ski" is spelled
-- out rather than stemmed because \bski\w* also matches "skill".
--
-- Two rows the corrected regex caught were excluded on inspection: "Sport
-- Nutrition Coach" is already correct on Dietitians and Nutritionists, and
-- matching it on the word "Sport" would have made it worse. Yoga instructors go
-- to Exercise Trainers rather than Coaches and Scouts.
--
-- Revert: reports/citation_remap3_revert.sql

begin;

--   5 rows -> Coaches and Scouts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00'
where id in (
    '16ef0fed-1c94-41e9-b7d3-e989c5c99171',
    '3736357a-06b4-41ca-9406-ccf9c86ba5f9',
    '5df62117-dc2a-43e7-9798-6f164c644103',
    '7aedb14b-46aa-4b0e-8398-12511345bc05',
    'bc231d75-a28f-45f5-a917-144b51065d77'
  );

--   1 rows -> Self-Enrichment Teachers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3021.00'
where id in (
    '6e09eaac-9092-4bda-b77e-c7e51b0a9ad4'
  );

--   1 rows -> Exercise Trainers and Group Fitness Instructors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-9031.00'
where id in (
    '9993df73-749a-4dc6-bcc7-a3412532e3ec'
  );

commit;
