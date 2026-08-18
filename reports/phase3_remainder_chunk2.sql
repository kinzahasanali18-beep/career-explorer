-- Phase 3 remainder, chunk 2 of 4 — 24 rows, 8 statements.
-- Subtractive only; guarded on exact current value; idempotent (safe to re-run).

begin;

update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning' and id in (
  '09130ec2-bb45-4968-80ad-724edd6a37d9',
  '057d33ed-e6ae-45a3-9ae0-74d086a29c3f',
  'eb3c8236-57eb-47ee-9caf-1ff79e823f63',
  '8a7b8a97-d09e-4766-a214-4640b6f7df48',
  '67ecd732-aed6-44f9-a90d-b0dec8512408',
  '38dd3be2-42b9-4746-a7b0-41ce36689b12'
);

update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research'
where secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research' and id in (
  'b8790739-db13-4b86-bc5c-bd9efdf7fc33',
  '412fc54a-9d79-4681-8721-47db747da8f4',
  'c36b0de3-69e7-4bf2-9722-813eab8b0bbf',
  '87aa195e-63c0-4f54-8e62-10a0f0be46f4',
  '807c73c6-2c0d-4abb-8bdb-ed2c8748d3a0'
);

update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Media & Journalism'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Media & Journalism' and id in (
  '7df04d1d-1592-4e1d-93e0-8d1c72ed95fe',
  'd2b40242-074e-4c8a-a770-011abd3adb34',
  'a4f1c0ea-0397-48c8-8a9d-b67e6a78f0ac'
);

update public.careers set secondary_industries = 'Social Impact & Nonprofit,Tech & Engineering,Science & Research'
where secondary_industries = 'Education & Coaching,Social Impact & Nonprofit,Tech & Engineering,Science & Research' and id in (
  '12d49303-69d0-4046-8b06-9a3c61f88231',
  '5aa6010e-263a-4b78-a056-bde1159906b5'
);

update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering'
where secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering' and id in (
  'd011e4b8-7eb3-4a1f-9814-aaaa2214042d',
  '2fef7a85-61a1-4525-a43c-e3ed08596aca'
);

update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit' and id in (
  'ddc934d7-12a8-425a-bb86-5c1f63eae865',
  '584d1946-a2b1-4819-883d-a351ae7960a9'
);

update public.careers set secondary_industries = 'Tech & Engineering,Law & Government,Science & Research'
where secondary_industries = 'Cybersecurity,Tech & Engineering,Law & Government,Science & Research' and id in (
  '6b3fd27c-d81a-4e17-9b8d-597033114c4f',
  '86e9c088-dfc4-402a-b87e-375bc49a2307'
);

update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Law & Government'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Law & Government' and id in (
  '8621f068-4dd2-4265-929a-572b6b5f6406',
  '3f230d4a-c3c5-4fc6-b8eb-95a3caafcb63'
);

commit;
