-- Apply the 89 HIGH-confidence industry corrections from the Phase 2 audit.
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
-- Rows: 89
-- Prior values: reports/phase2_high_confidence_backup_before.csv
-- Revert:       reports/phase2_high_confidence_revert.sql
--
-- Every statement is id-scoped and guarded on the current value, so re-running
-- is a no-op and a row edited in the meantime is skipped rather than overwritten.

begin;

--  1 row -> Supply Chain & Operations
--    Aerospace Supply Chain Risk Analyst  (was Aviation & Transportation; SOC 13-1081.00 Logisticians)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Aviation & Transportation,Business & Finance,Tech & Engineering'
where id in (
    '46b0fb62-8332-4c03-abf3-dfdd330b1082'
) and primary_industry = 'Aviation & Transportation';

--  1 row -> Food & Culinary
--    Baker (Specialty/Artisanal)  (was Hospitality & Events; SOC 51-3011.00 Bakers)
update public.careers set primary_industry = 'Food & Culinary', secondary_industries = 'Hospitality & Events,Entrepreneurship,Design & Creative'
where id in (
    '3300a681-5c81-4b1b-92b5-dd0ff5b8a611'
) and primary_industry = 'Hospitality & Events';

--  1 row -> Fashion & Beauty
--    Cosmetology Salon Owner  (was Entrepreneurship; SOC 39-5011.00 Barbers)
update public.careers set primary_industry = 'Fashion & Beauty', secondary_industries = 'Entrepreneurship,Business & Finance,Tech & Engineering,Architecture & Urban Planning'
where id in (
    '5ee74b3c-1521-4cad-9e06-14827a83d93d'
) and primary_industry = 'Entrepreneurship';

--  1 row -> Design & Creative
--    Environmental Graphic Designer (Interior)  (was Environment & Sustainability; SOC 27-1027.00 Set and Exhibit Designers)
update public.careers set primary_industry = 'Design & Creative', secondary_industries = 'Environment & Sustainability,Science & Research,Law & Government,Tech & Engineering'
where id in (
    '65795be1-b10f-4e82-b9ef-fe4154c845f6'
) and primary_industry = 'Environment & Sustainability';

--  4 rows -> Design & Creative
--    Exhibition Graphic Designer  (was Science & Research; SOC 27-1024.00 Graphic Designers)
--    Industrial Illustrator  (was Science & Research; SOC 27-1014.00 Special Effects Artists and Animators)
--    Print Designer  (was Science & Research; SOC 27-1024.00 Graphic Designers)
--    Publication Designer  (was Science & Research; SOC 27-1024.00 Graphic Designers)
update public.careers set primary_industry = 'Design & Creative', secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id in (
    '74d913e4-cc62-49e5-a1a1-0e7a52870eb8',
    '475d43d2-66d7-4259-9583-f0fec7ad72e6',
    '8a7b8a97-d09e-4766-a214-4640b6f7df48',
    '67ecd732-aed6-44f9-a90d-b0dec8512408'
) and primary_industry = 'Science & Research';

--  2 rows -> Hospitality & Events
--    Hotel Event Manager  (was Supply Chain & Operations; SOC 13-1121.00 Meeting, Convention, and Event Planners)
--    Lodging Manager  (was Supply Chain & Operations; SOC 11-9081.00 Lodging Managers)
update public.careers set primary_industry = 'Hospitality & Events', secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research'
where id in (
    '3c26327b-edf2-452e-ac2b-24cf441edbec',
    'b8790739-db13-4b86-bc5c-bd9efdf7fc33'
) and primary_industry = 'Supply Chain & Operations';

--  1 row -> Media & Journalism
--    Music Journalist  (was Science & Research; SOC 27-3023.00 News Analysts, Reporters, and Journalists)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Arts & Performance'
where id in (
    '68dc2d2a-6f9e-4562-9657-ee648ae4c0cf'
) and primary_industry = 'Science & Research';

--  4 rows -> Sports & Fitness
--    Referee  (was Gaming & Esports; SOC 27-2023.00 Umpires, Referees, and Other Sports Officials)
--    Referee/Umpire  (was Gaming & Esports; SOC 27-2023.00 Umpires, Referees, and Other Sports Officials)
--    CrossFit Coach  (was Gaming & Esports; SOC 39-9031.00 Exercise Trainers and Group Fitness Instructors)
--    Marathon Coach  (was Gaming & Esports; SOC 27-2022.00 Coaches and Scouts)
update public.careers set primary_industry = 'Sports & Fitness', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research'
where id in (
    '73cef218-0324-43fc-8fe7-044ced23db3b',
    'e0ebf060-11ac-4490-89c4-2e0808329bc7',
    'c7936700-3e3e-4607-9113-8e1fcd90d735',
    '42befc96-dbef-4ff9-acca-d8ce428fa9bc'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Supply Chain & Operations
--    Regenerative Supply Chain Manager  (was Environment & Sustainability; SOC 13-1081.00 Logisticians)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Environment & Sustainability,Business & Finance,Science & Research'
where id in (
    'c6b5328b-3f72-46d9-9a51-0c8cecbbaf28'
) and primary_industry = 'Environment & Sustainability';

--  1 row -> Supply Chain & Operations
--    Renewable Energy Supply Chain Manager  (was Environment & Sustainability; SOC 13-1081.00 Logisticians)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Environment & Sustainability,Business & Finance,Tech & Engineering'
where id in (
    '6bc29fb9-fc24-482b-b6b1-b177aa8a69e3'
) and primary_industry = 'Environment & Sustainability';

--  2 rows -> Media & Journalism
--    Social Impact Journalist  (was Social Impact & Nonprofit; SOC 27-3023.00 News Analysts, Reporters, and Journalists)
--    Media Researcher  (was Social Impact & Nonprofit; SOC 27-3043.00 Writers and Authors)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Social Impact & Nonprofit,Education & Coaching,Law & Government,Science & Research'
where id in (
    'a2674345-7339-46b8-a901-8e7b42663fda',
    'ec30490d-ad45-422e-94a6-36174fe224c9'
) and primary_industry = 'Social Impact & Nonprofit';

--  3 rows -> Media & Journalism
--    Sound Designer (Live Theater)  (was Science & Research; SOC 27-4014.00 Sound Engineering Technicians)
--    Theater Director  (was Science & Research; SOC 27-2012.00 Producers and Directors)
--    Editorial Director  (was Science & Research; SOC 27-3041.00 Editors)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id in (
    'c88cda3e-2c9b-4813-9a71-7e62ba1a46fb',
    '09130ec2-bb45-4968-80ad-724edd6a37d9',
    'eb3c8236-57eb-47ee-9caf-1ff79e823f63'
) and primary_industry = 'Science & Research';

--  1 row -> Media & Journalism
--    Sound Designer (Theater)  (was Sports & Fitness; SOC 27-4014.00 Sound Engineering Technicians)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning'
where id in (
    '849aeb85-bb3b-474c-9e13-192063b13abc'
) and primary_industry = 'Sports & Fitness';

--  1 row -> Marketing & Communications
--    Sustainable Fashion Brand Strategist  (was Fashion & Beauty; SOC 11-2022.00 Sales Managers)
update public.careers set primary_industry = 'Marketing & Communications', secondary_industries = 'Fashion & Beauty,Entrepreneurship,Environment & Sustainability'
where id in (
    '3a08ce0b-0df0-496d-8f82-e95e08b341a3'
) and primary_industry = 'Fashion & Beauty';

--  1 row -> Education & Coaching
--    Athletic Director (High School/College)  (was Gaming & Esports; SOC 11-9033.00 Education Administrators, Postsecondary)
update public.careers set primary_industry = 'Education & Coaching', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research'
where id in (
    '566de335-26df-4561-8c19-3210af842441'
) and primary_industry = 'Gaming & Esports';

--  6 rows -> Social Impact & Nonprofit
--    Executive Director (Small Nonprofit)  (was Gaming & Esports; SOC 11-9151.00 Social and Community Service Managers)
--    Faith-Based Nonprofit Director  (was Gaming & Esports; SOC 11-9151.00 Social and Community Service Managers)
--    Nonprofit Board Liaison  (was Gaming & Esports; SOC 11-9151.00 Social and Community Service Managers)
--    Development Coordinator  (was Gaming & Esports; SOC 11-9151.00 Social and Community Service Managers)
--    Homelessness Services Coordinator  (was Gaming & Esports; SOC 21-1093.00 Social and Human Service Assistants)
--    Volunteer Coordinator  (was Gaming & Esports; SOC 11-9151.00 Social and Community Service Managers)
update public.careers set primary_industry = 'Social Impact & Nonprofit', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research'
where id in (
    '4f631822-995b-482c-81f1-fd9fab3c6c90',
    '705f9cdd-5529-4d75-bc19-8a9f04460898',
    'e9bb9b85-87cd-4706-b46a-7a9281a2353e',
    'be9bb7dd-a5b2-49db-8541-a4dd6bbebbdc',
    '7e18a4bc-ec97-431a-a1d2-ea098b95216f',
    '365887f9-96f8-4a05-a3bc-2c213dce3c78'
) and primary_industry = 'Gaming & Esports';

--  4 rows -> Fashion & Beauty
--    Fashion Technical Designer  (was Supply Chain & Operations; SOC 27-1022.00 Fashion Designers)
--    Sustainable Fashion Designer  (was Supply Chain & Operations; SOC 27-1022.00 Fashion Designers)
--    Bridal Stylist  (was Supply Chain & Operations; SOC 39-5012.00 Hairdressers, Hairstylists, and Cosmetologists)
--    Footwear Designer  (was Supply Chain & Operations; SOC 27-1022.00 Fashion Designers)
update public.careers set primary_industry = 'Fashion & Beauty', secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research'
where id in (
    '34bbaa14-bed7-42c1-8196-592e12c1dfb5',
    '413fac3f-52d4-4a08-aac3-de26822674cb',
    '412fc54a-9d79-4681-8721-47db747da8f4',
    'c36b0de3-69e7-4bf2-9722-813eab8b0bbf'
) and primary_industry = 'Supply Chain & Operations';

--  3 rows -> Sports & Fitness
--    Fitness Director  (was Gaming & Esports; SOC 39-9031.00 Exercise Trainers and Group Fitness Instructors)
--    Youth Athletic Director  (was Gaming & Esports; SOC 27-2022.00 Coaches and Scouts)
--    Youth Sports Director  (was Gaming & Esports; SOC 27-2022.00 Coaches and Scouts)
update public.careers set primary_industry = 'Sports & Fitness', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id in (
    '92cf011d-8405-47ea-be77-1d87169447a3',
    '8c8d566f-4285-4160-bdee-1fd85fcd4963',
    'cab2cacd-a9e4-4f69-9695-bb1f85a6f095'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Law & Government
--    Hospitality Sustainability Auditor  (was Hospitality & Events; SOC 13-1041.07 Regulatory Affairs Specialists)
update public.careers set primary_industry = 'Law & Government', secondary_industries = 'Hospitality & Events,Environment & Sustainability,Supply Chain & Operations'
where id in (
    '3f991118-d5c9-481a-a66f-2548e745488b'
) and primary_industry = 'Hospitality & Events';

--  1 row -> Healthcare & Medicine
--    International Humanitarian Aid Worker  (was Food & Culinary; SOC 21-1094.00 Community Health Workers)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Food & Culinary,Hospitality & Events,Business & Finance,Science & Research'
where id in (
    '5c46f7b4-e91c-4a03-b3c4-ad1d3fb53796'
) and primary_industry = 'Food & Culinary';

--  1 row -> Architecture & Urban Planning
--    Land Surveyor  (was Law & Government; SOC 17-1022.00 Surveyors)
update public.careers set primary_industry = 'Architecture & Urban Planning', secondary_industries = 'Law & Government,Science & Research,Tech & Engineering'
where id in (
    'fc946614-8316-47be-bf30-ef5901dcedda'
) and primary_industry = 'Law & Government';

--  1 row -> Fashion & Beauty
--    Makeup Educator  (was Gaming & Esports; SOC 39-5094.00 Skincare Specialists)
update public.careers set primary_industry = 'Fashion & Beauty', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id in (
    'b00fcb03-37fe-49bb-a9ff-0267e0d9a20d'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Fashion & Beauty
--    Makeup Effects Artist  (was Hospitality & Events; SOC 39-5091.00 Makeup Artists, Theatrical and Performance)
update public.careers set primary_industry = 'Fashion & Beauty', secondary_industries = 'Hospitality & Events,Food & Culinary,Marketing & Communications,Architecture & Urban Planning'
where id in (
    '1586c0e9-e7f2-46ce-a2c3-e2410988d00c'
) and primary_industry = 'Hospitality & Events';

--  1 row -> Business & Finance
--    Marketplace Sustainability Platform Founder  (was Entrepreneurship; SOC 11-1011.00 Chief Executives)
update public.careers set primary_industry = 'Business & Finance', secondary_industries = 'Entrepreneurship,Tech & Engineering,Social Impact & Nonprofit'
where id in (
    '5bdf5e87-9dcb-413a-ba5f-6508dce23ba7'
) and primary_industry = 'Entrepreneurship';

--  1 row -> Arts & Performance
--    Medical Illustrator  (was Education & Coaching; SOC 27-1013.00 Fine Artists, Including Painters, Sculptors, and Illustrators)
update public.careers set primary_industry = 'Arts & Performance', secondary_industries = 'Education & Coaching,Social Impact & Nonprofit,Tech & Engineering,Science & Research'
where id in (
    '12d49303-69d0-4046-8b06-9a3c61f88231'
) and primary_industry = 'Education & Coaching';

--  1 row -> Business & Finance
--    Nonprofit Founder  (was Gaming & Esports; SOC 11-1011.00 Chief Executives)
update public.careers set primary_industry = 'Business & Finance', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research'
where id in (
    '795c4efa-686f-4b17-a67b-d3da47578d9b'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Media & Journalism
--    Podcast Producer & Founder  (was Supply Chain & Operations; SOC 27-3041.00 Editors)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Entrepreneurship'
where id in (
    '201e900b-0092-48c5-88e3-2c56c248bbc8'
) and primary_industry = 'Supply Chain & Operations';

--  1 row -> Arts & Performance
--    Scenic Painter  (was Sports & Fitness; SOC 27-1013.00 Fine Artists, Including Painters, Sculptors, and Illustrators)
update public.careers set primary_industry = 'Arts & Performance', secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Science & Research'
where id in (
    'c59c9a92-47d9-44bd-bc67-9fa771298956'
) and primary_industry = 'Sports & Fitness';

--  2 rows -> Media & Journalism
--    Sports Broadcast Analyst  (was Gaming & Esports; SOC 27-4012.00 Broadcast Technicians)
--    Live Streaming Production Manager  (was Gaming & Esports; SOC 27-4014.00 Sound Engineering Technicians)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research'
where id in (
    '2e23adc0-16db-4d93-bafc-ad6812af427c',
    '6207a784-617a-4422-a68c-f0bfaa9e3716'
) and primary_industry = 'Gaming & Esports';

--  2 rows -> Arts & Performance
--    Artistic Director  (was Science & Research; SOC 27-2032.00 Choreographers)
--    Puppetry Director  (was Science & Research; SOC 27-2041.00 Music Directors and Composers)
update public.careers set primary_industry = 'Arts & Performance', secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id in (
    '057d33ed-e6ae-45a3-9ae0-74d086a29c3f',
    '38dd3be2-42b9-4746-a7b0-41ce36689b12'
) and primary_industry = 'Science & Research';

--  1 row -> Arts & Performance
--    Arts Grant Administrator  (was Gaming & Esports; SOC 13-1011.00 Agents and Business Managers of Artists, Performers, and Athletes)
update public.careers set primary_industry = 'Arts & Performance', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id in (
    '797f4d31-a133-4090-925b-9f082c549c40'
) and primary_industry = 'Gaming & Esports';

--  2 rows -> Sports & Fitness
--    Badminton Coach  (was Gaming & Esports; SOC 27-2022.00 Coaches and Scouts)
--    Golf Instructor  (was Gaming & Esports; SOC 27-2022.00 Coaches and Scouts)
update public.careers set primary_industry = 'Sports & Fitness', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Media & Journalism'
where id in (
    '7df04d1d-1592-4e1d-93e0-8d1c72ed95fe',
    'd2b40242-074e-4c8a-a770-011abd3adb34'
) and primary_industry = 'Gaming & Esports';

--  2 rows -> Media & Journalism
--    Book Editor (Trade Publishing)  (was Science & Research; SOC 27-3041.00 Editors)
--    Magazine Editor-in-Chief  (was Science & Research; SOC 27-3041.00 Editors)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering'
where id in (
    'd011e4b8-7eb3-4a1f-9814-aaaa2214042d',
    '2fef7a85-61a1-4525-a43c-e3ed08596aca'
) and primary_industry = 'Science & Research';

--  1 row -> Law & Government
--    Compliance Officer  (was Education & Coaching; SOC 13-1041.00 Compliance Officers)
update public.careers set primary_industry = 'Law & Government', secondary_industries = 'Education & Coaching,Social Impact & Nonprofit,Tech & Engineering,Science & Research'
where id in (
    '5aa6010e-263a-4b78-a056-bde1159906b5'
) and primary_industry = 'Education & Coaching';

--  1 row -> Supply Chain & Operations
--    Food Tech Innovator  (was Entrepreneurship; SOC 11-3051.00 Industrial Production Managers)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Entrepreneurship,Science & Research,Environment & Sustainability'
where id in (
    '3e06eadc-62c1-4ccf-9135-37cd4eb9fe09'
) and primary_industry = 'Entrepreneurship';

--  1 row -> Healthcare & Medicine
--    Hospital Administrator  (was Gaming & Esports; SOC 11-9111.00 Medical and Health Services Managers)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit'
where id in (
    'ddc934d7-12a8-425a-bb86-5c1f63eae865'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Healthcare & Medicine
--    Hospital Chaplain  (was Gaming & Esports; SOC 21-1011.00 Substance Abuse and Behavioral Disorder Counselors)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research'
where id in (
    '6cb37cca-e4a2-4826-bd97-2dc597d3020f'
) and primary_industry = 'Gaming & Esports';

--  2 rows -> Arts & Performance
--    Live Performance Rights Manager  (was Gaming & Esports; SOC 13-1011.00 Agents and Business Managers of Artists, Performers, and Athletes)
--    Arts Accessibility Coordinator  (was Gaming & Esports; SOC 27-2011.00 Actors)
update public.careers set primary_industry = 'Arts & Performance', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research'
where id in (
    '7379b7a8-8fe7-4c5c-b4b6-ee8a9c09e3c1',
    '65caa85a-ff60-4e50-9f02-ef4d1fda08b6'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Media & Journalism
--    Publishing Acquisitions Editor  (was Entrepreneurship; SOC 27-3041.00 Editors)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Entrepreneurship,Business & Finance,Tech & Engineering'
where id in (
    'fee8b398-e0f8-4673-b134-4efe6305bdf3'
) and primary_industry = 'Entrepreneurship';

--  1 row -> Design & Creative
--    Signage and Wayfinding Designer  (was Healthcare & Medicine; SOC 27-1027.00 Set and Exhibit Designers)
update public.careers set primary_industry = 'Design & Creative', secondary_industries = 'Healthcare & Medicine,Science & Research,Tech & Engineering,Architecture & Urban Planning'
where id in (
    'd6ec233a-e9bf-4ccf-b3ed-be474e41edfe'
) and primary_industry = 'Healthcare & Medicine';

--  1 row -> Hospitality & Events
--    Spa Director  (was Fashion & Beauty; SOC 11-9081.00 Lodging Managers)
update public.careers set primary_industry = 'Hospitality & Events', secondary_industries = 'Fashion & Beauty,Design & Creative,Marketing & Communications,Healthcare & Medicine'
where id in (
    '31155388-b1c3-425f-b2aa-39bb30739595'
) and primary_industry = 'Fashion & Beauty';

--  1 row -> Media & Journalism
--    Broadcasting Director  (was Science & Research; SOC 27-4012.00 Broadcast Technicians)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Marketing & Communications'
where id in (
    '28c669b2-396d-4618-80ff-c9f4284f989c'
) and primary_industry = 'Science & Research';

--  1 row -> Business & Finance
--    Climate Fintech Founder  (was Entrepreneurship; SOC 11-1011.00 Chief Executives)
update public.careers set primary_industry = 'Business & Finance', secondary_industries = 'Entrepreneurship,Tech & Engineering,Environment & Sustainability'
where id in (
    '8b380c8b-4085-487f-b2ec-8b2b6dde3369'
) and primary_industry = 'Entrepreneurship';

--  1 row -> Media & Journalism
--    Color Grading Technician (Beauty Retail)  (was Fashion & Beauty; SOC 27-4011.00 Audio and Video Technicians)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Fashion & Beauty,Design & Creative,Tech & Engineering'
where id in (
    '4fdd3728-84d4-40b8-ae8e-1d1afbff3c81'
) and primary_industry = 'Fashion & Beauty';

--  1 row -> Supply Chain & Operations
--    Debate Tournament Director  (was Education & Coaching; SOC 13-1081.02 Logistics Analysts)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Education & Coaching,Hospitality & Events,Law & Government'
where id in (
    '4134df2c-97ab-40cf-8c3c-de9d9ff4f8a7'
) and primary_industry = 'Education & Coaching';

--  1 row -> Supply Chain & Operations
--    Destination Wedding Designer  (was Hospitality & Events; SOC 13-1081.00 Logisticians)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Hospitality & Events,Design & Creative,Entrepreneurship'
where id in (
    '50e02e94-377d-426e-b983-82e3a5f6c711'
) and primary_industry = 'Hospitality & Events';

--  1 row -> Media & Journalism
--    Documentary Distributor  (was Gaming & Esports; SOC 27-2012.00 Producers and Directors)
update public.careers set primary_industry = 'Media & Journalism', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications'
where id in (
    '9910e037-04c0-4d47-8b92-939d135cbe17'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Fashion & Beauty
--    Eyebrow Specialist  (was Supply Chain & Operations; SOC 39-5094.00 Skincare Specialists)
update public.careers set primary_industry = 'Fashion & Beauty', secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering'
where id in (
    'c72e4ab1-5f4d-407e-bf1b-bab5aacc74a0'
) and primary_industry = 'Supply Chain & Operations';

--  1 row -> Supply Chain & Operations
--    Freight Brokerage Owner  (was Entrepreneurship; SOC 13-1023.00 Purchasing Agents, Except Wholesale, Retail, and Farm Products)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Entrepreneurship,Business & Finance'
where id in (
    'db8733e2-91fc-40c1-927e-9b3f4ebc1f26'
) and primary_industry = 'Entrepreneurship';

--  1 row -> Marketing & Communications
--    Growth Hacker  (was Cybersecurity; SOC 13-1161.00 Market Research Analysts and Marketing Specialists)
update public.careers set primary_industry = 'Marketing & Communications', secondary_industries = 'Cybersecurity,Tech & Engineering,Law & Government,Science & Research'
where id in (
    '6b3fd27c-d81a-4e17-9b8d-597033114c4f'
) and primary_industry = 'Cybersecurity';

--  2 rows -> Education & Coaching
--    High School Principal  (was Gaming & Esports; SOC 11-9032.00 Education Administrators, Kindergarten through Secondary)
--    K-12 School Principal  (was Gaming & Esports; SOC 11-9032.00 Education Administrators, Kindergarten through Secondary)
update public.careers set primary_industry = 'Education & Coaching', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Law & Government'
where id in (
    '8621f068-4dd2-4265-929a-572b6b5f6406',
    '3f230d4a-c3c5-4fc6-b8eb-95a3caafcb63'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Social Impact & Nonprofit
--    Human Trafficking Prevention Coordinator  (was Gaming & Esports; SOC 21-1093.00 Social and Human Service Assistants)
update public.careers set primary_industry = 'Social Impact & Nonprofit', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Cybersecurity'
where id in (
    '267ae409-c75c-40fe-b2f2-1b8e50de2c88'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Supply Chain & Operations
--    Hyperlocal Delivery Service Operator  (was Entrepreneurship; SOC 11-3051.00 Industrial Production Managers)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Entrepreneurship,Tech & Engineering,Business & Finance'
where id in (
    '9b223863-5337-4dbf-bfa0-d9f7b11afeba'
) and primary_industry = 'Entrepreneurship';

--  1 row -> Education & Coaching
--    Incubator Program Director  (was Gaming & Esports; SOC 11-9039.00 Education Administrators, All Other)
update public.careers set primary_industry = 'Education & Coaching', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Entrepreneurship'
where id in (
    '35ff7cda-81c9-43fb-aefc-458d9e9d50c4'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Architecture & Urban Planning
--    Municipal Planning Director  (was Gaming & Esports; SOC 11-9021.00 Construction Managers)
update public.careers set primary_industry = 'Architecture & Urban Planning', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research'
where id in (
    'a8037472-24c4-48b3-aefa-eb4ac4299140'
) and primary_industry = 'Gaming & Esports';

--  1 row -> Sports & Fitness
--    Personal Training Business Owner  (was Marketing & Communications; SOC 39-9031.00 Exercise Trainers and Group Fitness Instructors)
update public.careers set primary_industry = 'Sports & Fitness', secondary_industries = 'Marketing & Communications,Business & Finance,Design & Creative,Science & Research'
where id in (
    '2b53168c-6cb7-47c9-a832-90e7385d70ee'
) and primary_industry = 'Marketing & Communications';

--  1 row -> Supply Chain & Operations
--    Study Abroad Program Coordinator  (was Education & Coaching; SOC 13-1081.02 Logistics Analysts)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Education & Coaching,Hospitality & Events,Business & Finance'
where id in (
    'e306a29d-e82b-4337-8bec-071433f2f513'
) and primary_industry = 'Education & Coaching';

--  1 row -> Fashion & Beauty
--    Sustainable Apparel Designer  (was Environment & Sustainability; SOC 27-1022.00 Fashion Designers)
update public.careers set primary_industry = 'Fashion & Beauty', secondary_industries = 'Environment & Sustainability,Science & Research,Law & Government,Tech & Engineering'
where id in (
    'fdb0c736-63d4-4877-bf66-11c4b709072d'
) and primary_industry = 'Environment & Sustainability';

--  1 row -> Healthcare & Medicine
--    Patient Advocate  (was Social Impact & Nonprofit; SOC 21-1094.00 Community Health Workers)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Social Impact & Nonprofit,Education & Coaching,Law & Government'
where id in (
    'cbd89142-4422-4415-b34e-4dd45bd80ff3'
) and primary_industry = 'Social Impact & Nonprofit';

--  1 row -> Tech & Engineering
--    Financial Crime Technology Specialist  (was Business & Finance; SOC 15-1299.01 Web Administrators)
update public.careers set primary_industry = 'Tech & Engineering', secondary_industries = 'Business & Finance,Cybersecurity,Law & Government'
where id in (
    'adf3485e-cef2-4277-92b8-9ac975e79738'
) and primary_industry = 'Business & Finance';

--  1 row -> Healthcare & Medicine
--    Healthcare Access Advocate  (was Social Impact & Nonprofit; SOC 21-1094.00 Community Health Workers)
update public.careers set primary_industry = 'Healthcare & Medicine', secondary_industries = 'Social Impact & Nonprofit,Law & Government,Education & Coaching'
where id in (
    '15120114-3c8b-488e-bb84-25ed57d2574b'
) and primary_industry = 'Social Impact & Nonprofit';

--  1 row -> Supply Chain & Operations
--    Pop-Up Shop Creator  (was Entrepreneurship; SOC 11-3051.00 Industrial Production Managers)
update public.careers set primary_industry = 'Supply Chain & Operations', secondary_industries = 'Entrepreneurship,Design & Creative,Hospitality & Events'
where id in (
    '1eb18120-dec5-414f-a207-f4a38369b765'
) and primary_industry = 'Entrepreneurship';

--  1 row -> Social Impact & Nonprofit
--    Youth Development Specialist  (was Gaming & Esports; SOC 21-1093.00 Social and Human Service Assistants)
update public.careers set primary_industry = 'Social Impact & Nonprofit', secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id in (
    '45a76936-4e3f-4080-afff-4ac3a968acb9'
) and primary_industry = 'Gaming & Esports';

commit;
