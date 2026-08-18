-- Revert the Phase 2 HIGH-confidence industry corrections.
-- Restores primary_industry and secondary_industries for the 17 rows changed by
-- supabase/migrations/20260818013000_apply_phase2_unambiguous_major_group_industry_fixes.sql
-- Values below are the pre-migration values read from the table on 2026-08-18.

begin;

update public.careers set primary_industry = 'Arts & Performance', secondary_industries = 'Media & Journalism,Design & Creative,Science & Research' where id = '47dbe29a-37c0-4a44-88fe-fa6c1742c558';  -- Anesthesiologist Assistant
update public.careers set primary_industry = 'Gaming & Esports', secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning' where id = '5b45bc6c-f8c3-4a0d-863a-e24f7d742dda';  -- Elementary School Teacher
update public.careers set primary_industry = 'Cybersecurity', secondary_industries = 'Tech & Engineering,Law & Government,Science & Research' where id = '86e9c088-dfc4-402a-b87e-375bc49a2307';  -- Forensic Nurse
update public.careers set primary_industry = 'Gaming & Esports', secondary_industries = 'Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit' where id = '584d1946-a2b1-4819-883d-a351ae7960a9';  -- Prosecutor
update public.careers set primary_industry = 'Marketing & Communications', secondary_industries = 'Business & Finance,Design & Creative,Science & Research' where id = '9f740b13-c56b-4bf9-a68d-e56d0b199291';  -- Trademark Attorney
update public.careers set primary_industry = 'Sports & Fitness', secondary_industries = 'Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning' where id = 'da26c81f-ab49-482b-9a3d-1eeed5eeb375';  -- Tutor for Learning Disabilities
update public.careers set primary_industry = 'Gaming & Esports', secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research' where id = 'e762e773-8edb-476a-a278-ad012c4e004e';  -- Recreation Therapist
update public.careers set primary_industry = 'Gaming & Esports', secondary_industries = 'Tech & Engineering,Marketing & Communications,Entrepreneurship' where id = 'b814a04f-88ec-4c5e-ab90-a09bbcc4741f';  -- Recreational Therapist
update public.careers set primary_industry = 'Gaming & Esports', secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research' where id = '06dfa212-98be-4fa4-bcd7-3111936f6eea';  -- Sports Physical Therapist
update public.careers set primary_industry = 'Gaming & Esports', secondary_industries = 'Tech & Engineering,Marketing & Communications,Media & Journalism' where id = 'a4f1c0ea-0397-48c8-8a9d-b67e6a78f0ac';  -- Chess Coach
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research' where id = '87aa195e-63c0-4f54-8e62-10a0f0be46f4';  -- Genetic Testing Counselor
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research' where id = '807c73c6-2c0d-4abb-8bdb-ed2c8748d3a0';  -- Genomic Counselor
update public.careers set primary_industry = 'Fashion & Beauty', secondary_industries = 'Design & Creative,Marketing & Communications,Science & Research' where id = '037f4a3a-c8af-443f-84f9-28cafcff35d8';  -- Literacy Coach
update public.careers set primary_industry = 'Gaming & Esports', secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning' where id = 'a39b6aa4-d286-4bd7-aa51-9aaaf9daa931';  -- Montessori School Director
update public.careers set primary_industry = 'Food & Culinary', secondary_industries = 'Hospitality & Events,Business & Finance,Arts & Performance' where id = 'a21b0e51-9052-4f33-95e8-edc77f5d82f4';  -- Nutritionist (Sports)
update public.careers set primary_industry = 'Tech & Engineering', secondary_industries = 'Business & Finance,Design & Creative,Science & Research' where id = 'aac1511a-c76d-498e-aa36-8afacdb1340e';  -- Audiologist
update public.careers set primary_industry = 'Hospitality & Events', secondary_industries = 'Food & Culinary,Marketing & Communications' where id = 'c89fac58-78f7-4cf2-9f0f-4902eb12c582';  -- Wound Care Specialist

commit;
