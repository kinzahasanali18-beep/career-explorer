-- Phase 4c citation fixes, chunk 2 of 4 — 27 rows, 17 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 29-1229.06 Sports Medicine Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.06'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  '05f4bee2-85c3-445c-af41-d7085bd1d365',
  '5bbf7750-631a-46e3-abd2-b37c568ab8df',
  '9969fd3f-26b9-4810-b532-5fc050c7ef4f',
  'e985178d-2f68-4187-9e74-624dbb57f71d'
);

-- 29-1229.04 Physical Medicine and Rehabilitation Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.04'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '2ab6f41e-93df-4a28-9840-ebeeef84ef54',
  '7f728ce0-e860-4cd3-862b-58a151cd9a41',
  'df7c9071-876b-45a5-89c5-0fa1771715aa'
);

-- 13-1031.00 Claims Adjusters, Examiners, and Investigators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1031.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/claims-adjusters-appraisers-examiners-and-investigators.htm' and id in (
  '64874d86-edb3-415e-869e-f673008cd8bf',
  'd227822f-fceb-4e95-bb10-722f0b091e73'
);

-- 15-1252.00 Software Developers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1132.00' and id in (
  '38184007-ba58-47a6-9f70-c9b697847790',
  '7aaeb4e3-e00c-4911-a244-31bb2f21965a'
);

-- 15-1252.00 Software Developers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  '6f4e9c3f-4c4b-45ca-8d3b-22410a46acfb',
  'da5157a8-eca9-426a-b786-396808f70533'
);

-- 21-1012.00 Educational, Guidance, and Career Counselors and Advisors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1012.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/school-counselors.htm' and id in (
  'cd8d2362-af0a-4ff6-ab76-42345ecba330',
  'e045b607-5251-4ab0-b2bf-23973d7166fa'
);

-- 27-4015.00 Lighting Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4015.00'
where source_url = 'https://www.onetonline.org/link/summary/27-4013.00' and id in (
  '2c8ba597-96d5-4ba8-a1f6-2b257859ca84',
  '900a4b22-69da-407f-bdb9-d65a2d200ce8'
);

-- 11-1021.00 General and Operations Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-1021.00'
where source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' and id in (
  'be196e5d-d106-474e-a5a0-5a021992430e'
);

-- 11-2021.00 Marketing Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2021.00'
where source_url = 'https://www.onetonline.org/link/summary/11-2031.00' and id in (
  '6a2da00b-e125-4959-9da6-36ba347d7b4e'
);

-- 11-2033.00 Fundraising Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2033.00'
where source_url = 'https://www.onetonline.org/link/summary/11-2031.00' and id in (
  '3741ed20-8b75-408f-be36-942f02bf673e'
);

-- 11-3013.00 Facilities Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3013.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  'ac023d5e-65d8-4211-bbaf-d3bada1b5ed8'
);

-- 11-3051.00 Industrial Production Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3051.00'
where source_url = 'https://www.onetonline.org/link/summary/51-5061.00' and id in (
  'b9529660-7e6b-4ea3-a26b-a5b1757b70c3'
);

-- 11-3051.01 Quality Control Systems Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3051.01'
where source_url = 'https://www.bls.gov/ooh/production/quality-assurance-inspectors.htm' and id in (
  '3e561acc-2263-470f-b2b9-3c500b9720c1'
);

-- 11-9051.00 Food Service Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9051.00'
where source_url = 'https://www.onetonline.org/link/summary/11-9011.03' and id in (
  'ea921b74-303b-4986-bfaa-30f1525bbfb3'
);

-- 11-9072.00 Entertainment and Recreation Managers, Except Gambling
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9072.00'
where source_url = 'https://www.bls.gov/ooh/management/park-recreation-managers.htm' and id in (
  'e5591c48-e0fa-4a62-bfd1-75dda84e801a'
);

-- 11-9121.02 Water Resource Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.02'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  '01a01cd2-d74c-4992-be47-9034e3ff8f2c'
);

-- 11-9141.00 Property, Real Estate, and Community Association Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9141.00'
where source_url = 'https://www.onetonline.org/link/summary/11-9061.00' and id in (
  '66746713-bd85-4fa7-aaca-de118d4c38b5'
);

commit;
