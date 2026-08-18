-- Phase 3 remainder, chunk 3 of 4 — 25 rows, 23 statements.
-- Subtractive only; guarded on exact current value; idempotent (safe to re-run).

begin;

update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Entrepreneurship'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Entrepreneurship' and id in (
  '35ff7cda-81c9-43fb-aefc-458d9e9d50c4',
  'b814a04f-88ec-4c5e-ab90-a09bbcc4741f'
);

update public.careers set secondary_industries = 'Business & Finance,Design & Creative,Science & Research'
where secondary_industries = 'Marketing & Communications,Business & Finance,Design & Creative,Science & Research' and id in (
  '2b53168c-6cb7-47c9-a832-90e7385d70ee',
  '9f740b13-c56b-4bf9-a68d-e56d0b199291'
);

update public.careers set secondary_industries = 'Hospitality & Events,Business & Finance,Science & Research'
where secondary_industries = 'Food & Culinary,Hospitality & Events,Business & Finance,Science & Research' and id in (
  '5c46f7b4-e91c-4a03-b3c4-ad1d3fb53796'
);

update public.careers set secondary_industries = 'Food & Culinary,Marketing & Communications,Architecture & Urban Planning'
where secondary_industries = 'Hospitality & Events,Food & Culinary,Marketing & Communications,Architecture & Urban Planning' and id in (
  '1586c0e9-e7f2-46ce-a2c3-e2410988d00c'
);

update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Entrepreneurship'
where secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Entrepreneurship' and id in (
  '201e900b-0092-48c5-88e3-2c56c248bbc8'
);

update public.careers set secondary_industries = 'Healthcare & Medicine,Marketing & Communications,Science & Research'
where secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Science & Research' and id in (
  'c59c9a92-47d9-44bd-bc67-9fa771298956'
);

update public.careers set secondary_industries = 'Education & Coaching,Law & Government,Science & Research'
where secondary_industries = 'Social Impact & Nonprofit,Education & Coaching,Law & Government,Science & Research' and id in (
  'ec30490d-ad45-422e-94a6-36174fe224c9'
);

update public.careers set secondary_industries = 'Design & Creative,Marketing & Communications,Healthcare & Medicine'
where secondary_industries = 'Fashion & Beauty,Design & Creative,Marketing & Communications,Healthcare & Medicine' and id in (
  '31155388-b1c3-425f-b2aa-39bb30739595'
);

update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Marketing & Communications'
where secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Marketing & Communications' and id in (
  '28c669b2-396d-4618-80ff-c9f4284f989c'
);

update public.careers set secondary_industries = 'Design & Creative,Tech & Engineering'
where secondary_industries = 'Fashion & Beauty,Design & Creative,Tech & Engineering' and id in (
  '4fdd3728-84d4-40b8-ae8e-1d1afbff3c81'
);

update public.careers set secondary_industries = 'Hospitality & Events,Law & Government'
where secondary_industries = 'Education & Coaching,Hospitality & Events,Law & Government' and id in (
  '4134df2c-97ab-40cf-8c3c-de9d9ff4f8a7'
);

update public.careers set secondary_industries = 'Design & Creative,Entrepreneurship'
where secondary_industries = 'Hospitality & Events,Design & Creative,Entrepreneurship' and id in (
  '50e02e94-377d-426e-b983-82e3a5f6c711'
);

update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications' and id in (
  '9910e037-04c0-4d47-8b92-939d135cbe17'
);

update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering'
where secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering' and id in (
  'c72e4ab1-5f4d-407e-bf1b-bab5aacc74a0'
);

update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Cybersecurity'
where secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Cybersecurity' and id in (
  '267ae409-c75c-40fe-b2f2-1b8e50de2c88'
);

update public.careers set secondary_industries = 'Hospitality & Events,Business & Finance'
where secondary_industries = 'Education & Coaching,Hospitality & Events,Business & Finance' and id in (
  'e306a29d-e82b-4337-8bec-071433f2f513'
);

update public.careers set secondary_industries = 'Science & Research,Law & Government,Tech & Engineering'
where secondary_industries = 'Environment & Sustainability,Science & Research,Law & Government,Tech & Engineering' and id in (
  'fdb0c736-63d4-4877-bf66-11c4b709072d'
);

update public.careers set secondary_industries = 'Education & Coaching,Law & Government'
where secondary_industries = 'Social Impact & Nonprofit,Education & Coaching,Law & Government' and id in (
  'cbd89142-4422-4415-b34e-4dd45bd80ff3'
);

update public.careers set secondary_industries = 'Cybersecurity,Law & Government'
where secondary_industries = 'Business & Finance,Cybersecurity,Law & Government' and id in (
  'adf3485e-cef2-4277-92b8-9ac975e79738'
);

update public.careers set secondary_industries = 'Law & Government,Education & Coaching'
where secondary_industries = 'Social Impact & Nonprofit,Law & Government,Education & Coaching' and id in (
  '15120114-3c8b-488e-bb84-25ed57d2574b'
);

update public.careers set secondary_industries = 'Media & Journalism,Design & Creative,Science & Research'
where secondary_industries = 'Arts & Performance,Media & Journalism,Design & Creative,Science & Research' and id in (
  '47dbe29a-37c0-4a44-88fe-fa6c1742c558'
);

update public.careers set secondary_industries = 'Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning'
where secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning' and id in (
  'da26c81f-ab49-482b-9a3d-1eeed5eeb375'
);

update public.careers set secondary_industries = 'Design & Creative,Marketing & Communications,Science & Research'
where secondary_industries = 'Fashion & Beauty,Design & Creative,Marketing & Communications,Science & Research' and id in (
  '037f4a3a-c8af-443f-84f9-28cafcff35d8'
);

commit;
