-- Phase 4c rematch citation fixes, chunk 3 of 4 — 29 rows, 29 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 19-2021.00 Atmospheric and Space Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-and-hydrologists.htm' and id in (
  '658bac2b-7c38-41d6-b4a7-ba8b74921dae'
);

-- 19-2021.00 Atmospheric and Space Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-and-geoscientists.htm' and id in (
  '9c96cb69-45b4-4123-a603-2449dbc790f4'
);

-- 19-2021.00 Atmospheric and Space Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-including-meteorologists.htm' and id in (
  'f7f3fc68-82f6-4897-87bd-dc79069b7c6a'
);

-- 19-2031.00 Chemists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2031.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '0c3d356f-a33b-4bb1-ad4f-c132c3286f36'
);

-- 19-2032.00 Materials Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2032.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  '07ff5018-2f4d-4697-a9ef-b3b9d70f593e'
);

-- 19-2032.00 Materials Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2032.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '610b8982-655d-4aec-92a9-c8f14174d157'
);

-- 19-3034.00 School Psychologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3034.00'
where source_url = 'https://www.onetonline.org/link/summary/19-3031.02' and id in (
  '4c33c8b6-6536-4e90-bad7-11a5bce8691f'
);

-- 19-4099.00 Life, Physical, and Social Science Technicians, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' and id in (
  'dbcc38a0-92ed-4254-ac43-5a5aa8f4f014'
);

-- 19-4099.00 Life, Physical, and Social Science Technicians, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  'e6675317-35f5-4ce0-b7ec-48b2e8329c76'
);

-- 19-4099.01 Quality Control Analysts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.02' and id in (
  '55038fc1-7ad8-412e-ab8d-b79c1aa9e45c'
);

-- 19-5011.00 Occupational Health and Safety Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-5011.00'
where source_url = 'https://www.onetonline.org/link/summary/29-9011.00' and id in (
  'c8502392-2529-4b90-a6e7-e07d8be13842'
);

-- 23-1011.00 Lawyers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-1011.00'
where source_url = 'https://www.bls.gov/ooh/legal/judges-and-prosecutors.htm' and id in (
  'ad7ea8ca-6955-48a8-b6a4-d55d1c354bd7'
);

-- 25-1194.00 Career/Technical Education Teachers, Postsecondary
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-1194.00'
where source_url = 'https://www.onetonline.org/link/summary/25-1191.00' and id in (
  '0e42bfb9-1eca-430a-8175-027735879d42'
);

-- 25-1194.00 Career/Technical Education Teachers, Postsecondary
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-1194.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/vocational-education-teachers.html' and id in (
  '2350aa25-566a-4252-9448-c7b11fa40fd9'
);

-- 25-1194.00 Career/Technical Education Teachers, Postsecondary
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-1194.00'
where source_url = 'https://www.onetonline.org/link/summary/25-3091.00' and id in (
  '6a8e9d52-bff5-4b52-9d43-fd2bf56f3c70'
);

-- 25-2059.00 Special Education Teachers, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2059.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/special-education-teachers.html' and id in (
  '3ef1e70d-53fa-42f5-bdd9-65c9577add14'
);

-- 25-3021.00 Self-Enrichment Teachers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3021.00'
where source_url = 'https://www.bls.gov/ooh/personal-care-and-service/dancers-and-choreographers.htm' and id in (
  '13ce55ad-ca4d-4143-a010-0aecbdd3e563'
);

-- 25-3041.00 Tutors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3041.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' and id in (
  '9013d1dc-fd12-4fb7-99af-dca18c983f61'
);

-- 25-4013.00 Museum Technicians and Conservators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-4013.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.02' and id in (
  '960ced69-816b-480a-a7f5-cd91a06a27e4'
);

-- 25-9031.00 Instructional Coordinators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9031.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/instructional-coordinators-and-curriculum-specialists.htm' and id in (
  'eae9cb72-8143-4907-ab49-2d2aaa776104'
);

-- 27-1012.00 Craft Artists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1012.00'
where source_url = 'https://www.onetonline.org/link/summary/27-2499.00' and id in (
  '1f63f0f8-b185-4aa0-a5b3-e7bb549f85a1'
);

-- 27-1014.00 Special Effects Artists and Animators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1014.00'
where source_url = 'https://www.onetonline.org/link/summary/27-2014.00' and id in (
  'fc962015-0bc2-4512-a8c7-3352700cb42c'
);

-- 27-2012.00 Producers and Directors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2012.00'
where source_url = 'https://www.bls.gov/ooh/arts-and-design/film-and-video-editors-and-camera-operators.htm' and id in (
  '2678f49f-6778-4150-84f3-a82f684b1bea'
);

-- 27-2012.00 Producers and Directors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2012.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '56ef0650-defc-4ef5-90c4-ff23d1902b74'
);

-- 27-2022.00 Coaches and Scouts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00'
where source_url = 'https://www.bls.gov/ooh/personal-care-and-service/recreation-and-fitness-workers.htm' and id in (
  '5ea1eec0-a56a-4667-94e7-ee3a867f959d'
);

-- 27-2022.00 Coaches and Scouts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00'
where source_url = 'https://www.onetonline.org/link/summary/25-2099.00' and id in (
  '84120952-326b-4ac9-a496-021e10bd506e'
);

-- 27-3011.00 Broadcast Announcers and Radio Disc Jockeys
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3011.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '1257e7af-4351-4465-8ad3-caea767aaa72'
);

-- 27-3011.00 Broadcast Announcers and Radio Disc Jockeys
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3011.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/broadcast-news-analysts.htm' and id in (
  'e5e0a77b-dab2-4c55-a0de-0c69913e8f90'
);

-- 27-3023.00 News Analysts, Reporters, and Journalists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/broadcast-news-analysts.htm' and id in (
  '3e9e6b98-28fd-4472-bbad-fbaf34a5147c'
);

commit;
