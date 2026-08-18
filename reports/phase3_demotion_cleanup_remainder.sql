-- Phase 3 remainder: the 74 rows not covered by the truncated first run.
-- Grouped by shared value pair -> 36 statements instead of 74.
-- Same guards, same semantics, still purely subtractive. Idempotent: safe to re-run.

begin;

-- 15 rows: drop Gaming & Esports  (Nonprofit Board Liaison; Nonprofit Founder; Sports Broadcast Analyst; …)
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

-- 7 rows: drop Gaming & Esports  (Makeup Educator; Youth Athletic Director; Arts Grant Administrator; …)
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

-- 6 rows: drop Science & Research  (Theater Director; Artistic Director; Editorial Director; …)
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning' and id in (
  '09130ec2-bb45-4968-80ad-724edd6a37d9',
  '057d33ed-e6ae-45a3-9ae0-74d086a29c3f',
  'eb3c8236-57eb-47ee-9caf-1ff79e823f63',
  '8a7b8a97-d09e-4766-a214-4640b6f7df48',
  '67ecd732-aed6-44f9-a90d-b0dec8512408',
  '38dd3be2-42b9-4746-a7b0-41ce36689b12'
);

-- 5 rows: drop Supply Chain & Operations  (Lodging Manager; Bridal Stylist; Footwear Designer; …)
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research'
where secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research' and id in (
  'b8790739-db13-4b86-bc5c-bd9efdf7fc33',
  '412fc54a-9d79-4681-8721-47db747da8f4',
  'c36b0de3-69e7-4bf2-9722-813eab8b0bbf',
  '87aa195e-63c0-4f54-8e62-10a0f0be46f4',
  '807c73c6-2c0d-4abb-8bdb-ed2c8748d3a0'
);

-- 3 rows: drop Gaming & Esports  (Badminton Coach; Golf Instructor; Chess Coach)
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Media & Journalism'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Media & Journalism' and id in (
  '7df04d1d-1592-4e1d-93e0-8d1c72ed95fe',
  'd2b40242-074e-4c8a-a770-011abd3adb34',
  'a4f1c0ea-0397-48c8-8a9d-b67e6a78f0ac'
);

-- 2 rows: drop Education & Coaching  (Medical Illustrator; Compliance Officer)
update public.careers set secondary_industries = 'Social Impact & Nonprofit,Tech & Engineering,Science & Research'
where secondary_industries = 'Education & Coaching,Social Impact & Nonprofit,Tech & Engineering,Science & Research' and id in (
  '12d49303-69d0-4046-8b06-9a3c61f88231',
  '5aa6010e-263a-4b78-a056-bde1159906b5'
);

-- 2 rows: drop Science & Research  (Book Editor (Trade Publishing); Magazine Editor-in-Chief)
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering'
where secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering' and id in (
  'd011e4b8-7eb3-4a1f-9814-aaaa2214042d',
  '2fef7a85-61a1-4525-a43c-e3ed08596aca'
);

-- 2 rows: drop Gaming & Esports  (Hospital Administrator; Prosecutor)
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit' and id in (
  'ddc934d7-12a8-425a-bb86-5c1f63eae865',
  '584d1946-a2b1-4819-883d-a351ae7960a9'
);

-- 2 rows: drop Cybersecurity  (Growth Hacker; Forensic Nurse)
update public.careers set secondary_industries = 'Tech & Engineering,Law & Government,Science & Research'
where secondary_industries = 'Cybersecurity,Tech & Engineering,Law & Government,Science & Research' and id in (
  '6b3fd27c-d81a-4e17-9b8d-597033114c4f',
  '86e9c088-dfc4-402a-b87e-375bc49a2307'
);

-- 2 rows: drop Gaming & Esports  (High School Principal; K-12 School Principal)
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Law & Government'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Law & Government' and id in (
  '8621f068-4dd2-4265-929a-572b6b5f6406',
  '3f230d4a-c3c5-4fc6-b8eb-95a3caafcb63'
);

-- 2 rows: drop Gaming & Esports  (Incubator Program Director; Recreational Therapist)
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Entrepreneurship'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Entrepreneurship' and id in (
  '35ff7cda-81c9-43fb-aefc-458d9e9d50c4',
  'b814a04f-88ec-4c5e-ab90-a09bbcc4741f'
);

-- 2 rows: drop Marketing & Communications  (Personal Training Business Owner; Trademark Attorney)
update public.careers set secondary_industries = 'Business & Finance,Design & Creative,Science & Research'
where secondary_industries = 'Marketing & Communications,Business & Finance,Design & Creative,Science & Research' and id in (
  '2b53168c-6cb7-47c9-a832-90e7385d70ee',
  '9f740b13-c56b-4bf9-a68d-e56d0b199291'
);

-- 1 row: drop Food & Culinary  (International Humanitarian Aid Worker)
update public.careers set secondary_industries = 'Hospitality & Events,Business & Finance,Science & Research'
where secondary_industries = 'Food & Culinary,Hospitality & Events,Business & Finance,Science & Research' and id in (
  '5c46f7b4-e91c-4a03-b3c4-ad1d3fb53796'
);

-- 1 row: drop Hospitality & Events  (Makeup Effects Artist)
update public.careers set secondary_industries = 'Food & Culinary,Marketing & Communications,Architecture & Urban Planning'
where secondary_industries = 'Hospitality & Events,Food & Culinary,Marketing & Communications,Architecture & Urban Planning' and id in (
  '1586c0e9-e7f2-46ce-a2c3-e2410988d00c'
);

-- 1 row: drop Supply Chain & Operations  (Podcast Producer & Founder)
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Entrepreneurship'
where secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Entrepreneurship' and id in (
  '201e900b-0092-48c5-88e3-2c56c248bbc8'
);

-- 1 row: drop Sports & Fitness  (Scenic Painter)
update public.careers set secondary_industries = 'Healthcare & Medicine,Marketing & Communications,Science & Research'
where secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Science & Research' and id in (
  'c59c9a92-47d9-44bd-bc67-9fa771298956'
);

-- 1 row: drop Social Impact & Nonprofit  (Media Researcher)
update public.careers set secondary_industries = 'Education & Coaching,Law & Government,Science & Research'
where secondary_industries = 'Social Impact & Nonprofit,Education & Coaching,Law & Government,Science & Research' and id in (
  'ec30490d-ad45-422e-94a6-36174fe224c9'
);

-- 1 row: drop Fashion & Beauty  (Spa Director)
update public.careers set secondary_industries = 'Design & Creative,Marketing & Communications,Healthcare & Medicine'
where secondary_industries = 'Fashion & Beauty,Design & Creative,Marketing & Communications,Healthcare & Medicine' and id in (
  '31155388-b1c3-425f-b2aa-39bb30739595'
);

-- 1 row: drop Science & Research  (Broadcasting Director)
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Marketing & Communications'
where secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Marketing & Communications' and id in (
  '28c669b2-396d-4618-80ff-c9f4284f989c'
);

-- 1 row: drop Fashion & Beauty  (Color Grading Technician (Beauty Retail))
update public.careers set secondary_industries = 'Design & Creative,Tech & Engineering'
where secondary_industries = 'Fashion & Beauty,Design & Creative,Tech & Engineering' and id in (
  '4fdd3728-84d4-40b8-ae8e-1d1afbff3c81'
);

-- 1 row: drop Education & Coaching  (Debate Tournament Director)
update public.careers set secondary_industries = 'Hospitality & Events,Law & Government'
where secondary_industries = 'Education & Coaching,Hospitality & Events,Law & Government' and id in (
  '4134df2c-97ab-40cf-8c3c-de9d9ff4f8a7'
);

-- 1 row: drop Hospitality & Events  (Destination Wedding Designer)
update public.careers set secondary_industries = 'Design & Creative,Entrepreneurship'
where secondary_industries = 'Hospitality & Events,Design & Creative,Entrepreneurship' and id in (
  '50e02e94-377d-426e-b983-82e3a5f6c711'
);

-- 1 row: drop Gaming & Esports  (Documentary Distributor)
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications' and id in (
  '9910e037-04c0-4d47-8b92-939d135cbe17'
);

-- 1 row: drop Supply Chain & Operations  (Eyebrow Specialist)
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering'
where secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering' and id in (
  'c72e4ab1-5f4d-407e-bf1b-bab5aacc74a0'
);

-- 1 row: drop Gaming & Esports  (Human Trafficking Prevention Coordinator)
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Cybersecurity'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Cybersecurity' and id in (
  '267ae409-c75c-40fe-b2f2-1b8e50de2c88'
);

-- 1 row: drop Education & Coaching  (Study Abroad Program Coordinator)
update public.careers set secondary_industries = 'Hospitality & Events,Business & Finance'
where secondary_industries = 'Education & Coaching,Hospitality & Events,Business & Finance' and id in (
  'e306a29d-e82b-4337-8bec-071433f2f513'
);

-- 1 row: drop Environment & Sustainability  (Sustainable Apparel Designer)
update public.careers set secondary_industries = 'Science & Research,Law & Government,Tech & Engineering'
where secondary_industries = 'Environment & Sustainability,Science & Research,Law & Government,Tech & Engineering' and id in (
  'fdb0c736-63d4-4877-bf66-11c4b709072d'
);

-- 1 row: drop Social Impact & Nonprofit  (Patient Advocate)
update public.careers set secondary_industries = 'Education & Coaching,Law & Government'
where secondary_industries = 'Social Impact & Nonprofit,Education & Coaching,Law & Government' and id in (
  'cbd89142-4422-4415-b34e-4dd45bd80ff3'
);

-- 1 row: drop Business & Finance  (Financial Crime Technology Specialist)
update public.careers set secondary_industries = 'Cybersecurity,Law & Government'
where secondary_industries = 'Business & Finance,Cybersecurity,Law & Government' and id in (
  'adf3485e-cef2-4277-92b8-9ac975e79738'
);

-- 1 row: drop Social Impact & Nonprofit  (Healthcare Access Advocate)
update public.careers set secondary_industries = 'Law & Government,Education & Coaching'
where secondary_industries = 'Social Impact & Nonprofit,Law & Government,Education & Coaching' and id in (
  '15120114-3c8b-488e-bb84-25ed57d2574b'
);

-- 1 row: drop Arts & Performance  (Anesthesiologist Assistant)
update public.careers set secondary_industries = 'Media & Journalism,Design & Creative,Science & Research'
where secondary_industries = 'Arts & Performance,Media & Journalism,Design & Creative,Science & Research' and id in (
  '47dbe29a-37c0-4a44-88fe-fa6c1742c558'
);

-- 1 row: drop Sports & Fitness  (Tutor for Learning Disabilities)
update public.careers set secondary_industries = 'Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning'
where secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning' and id in (
  'da26c81f-ab49-482b-9a3d-1eeed5eeb375'
);

-- 1 row: drop Fashion & Beauty  (Literacy Coach)
update public.careers set secondary_industries = 'Design & Creative,Marketing & Communications,Science & Research'
where secondary_industries = 'Fashion & Beauty,Design & Creative,Marketing & Communications,Science & Research' and id in (
  '037f4a3a-c8af-443f-84f9-28cafcff35d8'
);

-- 1 row: drop Food & Culinary  (Nutritionist (Sports))
update public.careers set secondary_industries = 'Hospitality & Events,Business & Finance,Arts & Performance'
where secondary_industries = 'Food & Culinary,Hospitality & Events,Business & Finance,Arts & Performance' and id in (
  'a21b0e51-9052-4f33-95e8-edc77f5d82f4'
);

-- 1 row: drop Tech & Engineering  (Audiologist)
update public.careers set secondary_industries = 'Business & Finance,Design & Creative,Science & Research'
where secondary_industries = 'Tech & Engineering,Business & Finance,Design & Creative,Science & Research' and id in (
  'aac1511a-c76d-498e-aa36-8afacdb1340e'
);

-- 1 row: drop Hospitality & Events  (Wound Care Specialist)
update public.careers set secondary_industries = 'Food & Culinary,Marketing & Communications'
where secondary_industries = 'Hospitality & Events,Food & Culinary,Marketing & Communications' and id in (
  'c89fac58-78f7-4cf2-9f0f-4902eb12c582'
);

commit;
