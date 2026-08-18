-- Phase 3 remainder, chunk 1 of 4 — 22 rows, 2 statements.
-- Subtractive only; guarded on exact current value; idempotent (safe to re-run).

begin;

update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research' and id in (
  'e9bb9b85-87cd-4706-b46a-7a9281a2353e',
  '795c4efa-686f-4b17-a67b-d3da47578d9b',
  '2e23adc0-16db-4d93-bafc-ad6812af427c',
  'c7936700-3e3e-4607-9113-8e1fcd90d735',
  '6cb37cca-e4a2-4826-bd97-2dc597d3020f',
  '7379b7a8-8fe7-4c5c-b4b6-ee8a9c09e3c1',
  '42befc96-dbef-4ff9-acca-d8ce428fa9bc',
  '65caa85a-ff60-4e50-9f02-ef4d1fda08b6',
  'be9bb7dd-a5b2-49db-8541-a4dd6bbebbdc',
  '7e18a4bc-ec97-431a-a1d2-ea098b95216f',
  '6207a784-617a-4422-a68c-f0bfaa9e3716',
  'a8037472-24c4-48b3-aefa-eb4ac4299140',
  '365887f9-96f8-4a05-a3bc-2c213dce3c78',
  'e762e773-8edb-476a-a278-ad012c4e004e',
  '06dfa212-98be-4fa4-bcd7-3111936f6eea'
);

update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning' and id in (
  'b00fcb03-37fe-49bb-a9ff-0267e0d9a20d',
  '8c8d566f-4285-4160-bdee-1fd85fcd4963',
  '797f4d31-a133-4090-925b-9f082c549c40',
  'cab2cacd-a9e4-4f69-9695-bb1f85a6f095',
  '45a76936-4e3f-4080-afff-4ac3a968acb9',
  '5b45bc6c-f8c3-4a0d-863a-e24f7d742dda',
  'a39b6aa4-d286-4bd7-aa51-9aaaf9daa931'
);

commit;
