-- Apply 17 HIGH-confidence industry corrections from the Phase 2 audit.
--
-- Source: reports/PHASE2_FIX_PROPOSALS_2026-08-18.csv, rows where confidence = HIGH.
-- HIGH means two independent signals agreed on the industry: O*NET's own
-- classification of the SOC code in the row's source_url, and the title-keyword
-- rule from Phase 1. Rows where only one signal was available, or where the two
-- disagreed, are deliberately NOT in this migration.
--
-- Each row gets two changes:
--   primary_industry     -> the O*NET-derived industry
--   secondary_industries -> the previous primary demoted to the front, so the
--                           displaced value is preserved rather than discarded
--
-- Rows: 17
-- Prior values: reports/phase2_unambiguous_major_group_backup_before.csv
-- Revert:       reports/phase2_unambiguous_major_group_revert.sql
--
-- Every statement is id-scoped and guarded on the current value, so re-running
-- is a no-op and a row edited in the meantime is skipped rather than overwritten.

begin;

--  1 row -> Healthcare & Medicine
--    Anesthesiologist Assistant  (was Arts & Performance; SOC 29-1071.01 Anesthesiologist Assistants)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Arts & Performance,Media & Journalism,Design & Creative,Science & Research'
where id in (
    '47dbe29a-37c0-4a44-88fe-fa6c1742c558'
) and primary_industry = 'Arts & Performance';

--  2 rows -> Education & Coaching
--    Elementary School Teacher  (was Gaming & Esports; SOC 25-2021.00 Elementary School Teachers, Except Special Education)
--    Montessori School Director  (was Gaming & Esports; SOC 25-2021.00 Elementary School Teachers, Except Special Education)
update public.careers set primary_industry = 'Education & Coaching', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id in (
    '5b45bc6c-f8c3-4a0d-863a-e24f7d742dda',
    'a39b6aa4-d286-4bd7-aa51-9aaaf9daa931'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Healthcare & Medicine
--    Forensic Nurse  (was Cybersecurity; SOC 29-1141.03 Critical Care Nurses)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Cybersecurity,Tech & Engineering,Law & Government,Science & Research'
where id in (
    '86e9c088-dfc4-402a-b87e-375bc49a2307'
) and primary_industry = 'Cybersecurity';

--  1 row -> Law & Government
--    Prosecutor  (was Gaming & Esports; SOC 23-1011.00 Lawyers)
update public.careers set primary_industry = 'Law & Government', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit'
where id in (
    '584d1946-a2b1-4819-883d-a351ae7960a9'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Law & Government
--    Trademark Attorney  (was Marketing & Communications; SOC 23-1011.00 Lawyers)
update public.careers set primary_industry = 'Law & Government', secondary_industries = 'Marketing & Communications,Business & Finance,Design & Creative,Science & Research'
where id in (
    '9f740b13-c56b-4bf9-a68d-e56d0b199291'
) and primary_industry = 'Marketing & Communications';

--  1 row -> Education & Coaching
--    Tutor for Learning Disabilities  (was Sports & Fitness; SOC 25-3041.00 Tutors)
update public.careers set primary_industry = 'Education & Coaching', secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning'
where id in (
    'da26c81f-ab49-482b-9a3d-1eeed5eeb375'
) and primary_industry = 'Sports & Fitness';

--  2 rows -> Healthcare & Medicine
--    Recreation Therapist  (was Gaming & Esports; SOC 29-1125.00 Recreational Therapists)
--    Sports Physical Therapist  (was Gaming & Esports; SOC 29-1123.00 Physical Therapists)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research'
where id in (
    'e762e773-8edb-476a-a278-ad012c4e004e',
    '06dfa212-98be-4fa4-bcd7-3111936f6eea'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Healthcare & Medicine
--    Recreational Therapist  (was Gaming & Esports; SOC 29-1125.00 Recreational Therapists)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Entrepreneurship'
where id in (
    'b814a04f-88ec-4c5e-ab90-a09bbcc4741f'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Education & Coaching
--    Chess Coach  (was Gaming & Esports; SOC 25-3021.00 Self-Enrichment Teachers)
update public.careers set primary_industry = 'Education & Coaching', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Media & Journalism'
where id in (
    'a4f1c0ea-0397-48c8-8a9d-b67e6a78f0ac'
) and primary_industry = 'Gaming & Esports';

--  2 rows -> Healthcare & Medicine
--    Genetic Testing Counselor  (was Supply Chain & Operations; SOC 29-1131.00 Veterinarians)
--    Genomic Counselor  (was Supply Chain & Operations; SOC 29-1127.00 Speech-Language Pathologists)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research'
where id in (
    '87aa195e-63c0-4f54-8e62-10a0f0be46f4',
    '807c73c6-2c0d-4abb-8bdb-ed2c8748d3a0'
) and primary_industry = 'Supply Chain & Operations';

--  1 row -> Education & Coaching
--    Literacy Coach  (was Fashion & Beauty; SOC 25-9031.00 Instructional Coordinators)
update public.careers set primary_industry = 'Education & Coaching', secondary_industries = 'Fashion & Beauty,Design & Creative,Marketing & Communications,Science & Research'
where id in (
    '037f4a3a-c8af-443f-84f9-28cafcff35d8'
) and primary_industry = 'Fashion & Beauty';

--  1 row -> Healthcare & Medicine
--    Nutritionist (Sports)  (was Food & Culinary; SOC 29-1031.00 Dietitians and Nutritionists)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Food & Culinary,Hospitality & Events,Business & Finance,Arts & Performance'
where id in (
    'a21b0e51-9052-4f33-95e8-edc77f5d82f4'
) and primary_industry = 'Food & Culinary';

--  1 row -> Healthcare & Medicine
--    Audiologist  (was Tech & Engineering; SOC 29-1181.00 Audiologists)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Tech & Engineering,Business & Finance,Design & Creative,Science & Research'
where id in (
    'aac1511a-c76d-498e-aa36-8afacdb1340e'
) and primary_industry = 'Tech & Engineering';

--  1 row -> Healthcare & Medicine
--    Wound Care Specialist  (was Hospitality & Events; SOC 29-2061.00 Licensed Practical and Licensed Vocational Nurses)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Hospitality & Events,Food & Culinary,Marketing & Communications'
where id in (
    'c89fac58-78f7-4cf2-9f0f-4902eb12c582'
) and primary_industry = 'Hospitality & Events';

commit;
