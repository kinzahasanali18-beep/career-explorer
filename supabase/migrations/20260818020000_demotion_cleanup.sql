-- Remove 91 demoted industry tags that the career's own text does not support.
--
-- Batches 1 and 2 moved each corrected row's previous primary_industry into
-- secondary_industries so nothing was silently dropped. Where the previous primary
-- was plausible that was correct and those rows are left alone. Where it was not,
-- the demotion preserved a wrong tag — e.g. Hospital Chaplain kept Gaming & Esports.
--
-- Selection is evidence-based, not a list of bad industry pairs: using the same
-- keyword rules as the Phase 1 audit (scripts/phase1_keyword_rules.cjs), a tag is
-- removed only when NO keyword supporting that industry appears in the career's
-- title or description. Rows where a keyword did appear keep the tag.
--
-- Industries with no keyword rules cannot be tested and were left untouched (8 rows).
--
-- This migration only ever REMOVES one value from secondary_industries.
-- primary_industry is not touched.
--
-- Rows: 91
-- Prior values: reports/phase3_demotion_cleanup_backup_before.csv
-- Revert:       reports/phase3_demotion_cleanup_revert.sql
--
-- Each statement is id-scoped and guarded on the exact current secondary_industries
-- string, so re-running is a no-op and any row edited meanwhile is skipped.

begin;

--  Baker (Specialty/Artisanal)  (Food & Culinary) — drop Hospitality & Events
update public.careers set secondary_industries = 'Entrepreneurship,Design & Creative'
where id = '3300a681-5c81-4b1b-92b5-dd0ff5b8a611' and secondary_industries = 'Hospitality & Events,Entrepreneurship,Design & Creative';

--  Environmental Graphic Designer (Interior)  (Design & Creative) — drop Environment & Sustainability
update public.careers set secondary_industries = 'Science & Research,Law & Government,Tech & Engineering'
where id = '65795be1-b10f-4e82-b9ef-fe4154c845f6' and secondary_industries = 'Environment & Sustainability,Science & Research,Law & Government,Tech & Engineering';

--  Exhibition Graphic Designer  (Design & Creative) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id = '74d913e4-cc62-49e5-a1a1-0e7a52870eb8' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning';

--  Hotel Event Manager  (Hospitality & Events) — drop Supply Chain & Operations
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research'
where id = '3c26327b-edf2-452e-ac2b-24cf441edbec' and secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research';

--  Music Journalist  (Media & Journalism) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Arts & Performance'
where id = '68dc2d2a-6f9e-4562-9657-ee648ae4c0cf' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Arts & Performance';

--  Referee  (Sports & Fitness) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '73cef218-0324-43fc-8fe7-044ced23db3b' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Referee/Umpire  (Sports & Fitness) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = 'e0ebf060-11ac-4490-89c4-2e0808329bc7' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Regenerative Supply Chain Manager  (Supply Chain & Operations) — drop Environment & Sustainability
update public.careers set secondary_industries = 'Business & Finance,Science & Research'
where id = 'c6b5328b-3f72-46d9-9a51-0c8cecbbaf28' and secondary_industries = 'Environment & Sustainability,Business & Finance,Science & Research';

--  Social Impact Journalist  (Media & Journalism) — drop Social Impact & Nonprofit
update public.careers set secondary_industries = 'Education & Coaching,Law & Government,Science & Research'
where id = 'a2674345-7339-46b8-a901-8e7b42663fda' and secondary_industries = 'Social Impact & Nonprofit,Education & Coaching,Law & Government,Science & Research';

--  Sound Designer (Live Theater)  (Media & Journalism) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id = 'c88cda3e-2c9b-4813-9a71-7e62ba1a46fb' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning';

--  Sound Designer (Theater)  (Media & Journalism) — drop Sports & Fitness
update public.careers set secondary_industries = 'Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning'
where id = '849aeb85-bb3b-474c-9e13-192063b13abc' and secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning';

--  Athletic Director (High School/College)  (Education & Coaching) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '566de335-26df-4561-8c19-3210af842441' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Executive Director (Small Nonprofit)  (Social Impact & Nonprofit) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '4f631822-995b-482c-81f1-fd9fab3c6c90' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Faith-Based Nonprofit Director  (Social Impact & Nonprofit) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '705f9cdd-5529-4d75-bc19-8a9f04460898' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Fashion Technical Designer  (Fashion & Beauty) — drop Supply Chain & Operations
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research'
where id = '34bbaa14-bed7-42c1-8196-592e12c1dfb5' and secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research';

--  Fitness Director  (Sports & Fitness) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id = '92cf011d-8405-47ea-be77-1d87169447a3' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning';

--  Industrial Illustrator  (Design & Creative) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id = '475d43d2-66d7-4259-9583-f0fec7ad72e6' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning';

--  International Humanitarian Aid Worker  (Healthcare & Medicine) — drop Food & Culinary
update public.careers set secondary_industries = 'Hospitality & Events,Business & Finance,Science & Research'
where id = '5c46f7b4-e91c-4a03-b3c4-ad1d3fb53796' and secondary_industries = 'Food & Culinary,Hospitality & Events,Business & Finance,Science & Research';

--  Makeup Educator  (Fashion & Beauty) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id = 'b00fcb03-37fe-49bb-a9ff-0267e0d9a20d' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning';

--  Makeup Effects Artist  (Fashion & Beauty) — drop Hospitality & Events
update public.careers set secondary_industries = 'Food & Culinary,Marketing & Communications,Architecture & Urban Planning'
where id = '1586c0e9-e7f2-46ce-a2c3-e2410988d00c' and secondary_industries = 'Hospitality & Events,Food & Culinary,Marketing & Communications,Architecture & Urban Planning';

--  Medical Illustrator  (Arts & Performance) — drop Education & Coaching
update public.careers set secondary_industries = 'Social Impact & Nonprofit,Tech & Engineering,Science & Research'
where id = '12d49303-69d0-4046-8b06-9a3c61f88231' and secondary_industries = 'Education & Coaching,Social Impact & Nonprofit,Tech & Engineering,Science & Research';

--  Nonprofit Board Liaison  (Social Impact & Nonprofit) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = 'e9bb9b85-87cd-4706-b46a-7a9281a2353e' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Nonprofit Founder  (Business & Finance) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '795c4efa-686f-4b17-a67b-d3da47578d9b' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Podcast Producer & Founder  (Media & Journalism) — drop Supply Chain & Operations
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Entrepreneurship'
where id = '201e900b-0092-48c5-88e3-2c56c248bbc8' and secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Entrepreneurship';

--  Scenic Painter  (Arts & Performance) — drop Sports & Fitness
update public.careers set secondary_industries = 'Healthcare & Medicine,Marketing & Communications,Science & Research'
where id = 'c59c9a92-47d9-44bd-bc67-9fa771298956' and secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Science & Research';

--  Sports Broadcast Analyst  (Media & Journalism) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '2e23adc0-16db-4d93-bafc-ad6812af427c' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Theater Director  (Media & Journalism) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id = '09130ec2-bb45-4968-80ad-724edd6a37d9' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning';

--  Youth Athletic Director  (Sports & Fitness) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id = '8c8d566f-4285-4160-bdee-1fd85fcd4963' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning';

--  Artistic Director  (Arts & Performance) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id = '057d33ed-e6ae-45a3-9ae0-74d086a29c3f' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning';

--  Arts Grant Administrator  (Arts & Performance) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id = '797f4d31-a133-4090-925b-9f082c549c40' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning';

--  Badminton Coach  (Sports & Fitness) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Media & Journalism'
where id = '7df04d1d-1592-4e1d-93e0-8d1c72ed95fe' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Media & Journalism';

--  Book Editor (Trade Publishing)  (Media & Journalism) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering'
where id = 'd011e4b8-7eb3-4a1f-9814-aaaa2214042d' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering';

--  Compliance Officer  (Law & Government) — drop Education & Coaching
update public.careers set secondary_industries = 'Social Impact & Nonprofit,Tech & Engineering,Science & Research'
where id = '5aa6010e-263a-4b78-a056-bde1159906b5' and secondary_industries = 'Education & Coaching,Social Impact & Nonprofit,Tech & Engineering,Science & Research';

--  CrossFit Coach  (Sports & Fitness) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = 'c7936700-3e3e-4607-9113-8e1fcd90d735' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Editorial Director  (Media & Journalism) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id = 'eb3c8236-57eb-47ee-9caf-1ff79e823f63' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning';

--  Hospital Administrator  (Healthcare & Medicine) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit'
where id = 'ddc934d7-12a8-425a-bb86-5c1f63eae865' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit';

--  Hospital Chaplain  (Healthcare & Medicine) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '6cb37cca-e4a2-4826-bd97-2dc597d3020f' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Live Performance Rights Manager  (Arts & Performance) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '7379b7a8-8fe7-4c5c-b4b6-ee8a9c09e3c1' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Lodging Manager  (Hospitality & Events) — drop Supply Chain & Operations
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research'
where id = 'b8790739-db13-4b86-bc5c-bd9efdf7fc33' and secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research';

--  Magazine Editor-in-Chief  (Media & Journalism) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering'
where id = '2fef7a85-61a1-4525-a43c-e3ed08596aca' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering';

--  Marathon Coach  (Sports & Fitness) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '42befc96-dbef-4ff9-acca-d8ce428fa9bc' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Media Researcher  (Media & Journalism) — drop Social Impact & Nonprofit
update public.careers set secondary_industries = 'Education & Coaching,Law & Government,Science & Research'
where id = 'ec30490d-ad45-422e-94a6-36174fe224c9' and secondary_industries = 'Social Impact & Nonprofit,Education & Coaching,Law & Government,Science & Research';

--  Print Designer  (Design & Creative) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id = '8a7b8a97-d09e-4766-a214-4640b6f7df48' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning';

--  Publication Designer  (Design & Creative) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id = '67ecd732-aed6-44f9-a90d-b0dec8512408' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning';

--  Puppetry Director  (Arts & Performance) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning'
where id = '38dd3be2-42b9-4746-a7b0-41ce36689b12' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning';

--  Spa Director  (Hospitality & Events) — drop Fashion & Beauty
update public.careers set secondary_industries = 'Design & Creative,Marketing & Communications,Healthcare & Medicine'
where id = '31155388-b1c3-425f-b2aa-39bb30739595' and secondary_industries = 'Fashion & Beauty,Design & Creative,Marketing & Communications,Healthcare & Medicine';

--  Arts Accessibility Coordinator  (Arts & Performance) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '65caa85a-ff60-4e50-9f02-ef4d1fda08b6' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Bridal Stylist  (Fashion & Beauty) — drop Supply Chain & Operations
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research'
where id = '412fc54a-9d79-4681-8721-47db747da8f4' and secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research';

--  Broadcasting Director  (Media & Journalism) — drop Science & Research
update public.careers set secondary_industries = 'Healthcare & Medicine,Tech & Engineering,Marketing & Communications'
where id = '28c669b2-396d-4618-80ff-c9f4284f989c' and secondary_industries = 'Science & Research,Healthcare & Medicine,Tech & Engineering,Marketing & Communications';

--  Color Grading Technician (Beauty Retail)  (Media & Journalism) — drop Fashion & Beauty
update public.careers set secondary_industries = 'Design & Creative,Tech & Engineering'
where id = '4fdd3728-84d4-40b8-ae8e-1d1afbff3c81' and secondary_industries = 'Fashion & Beauty,Design & Creative,Tech & Engineering';

--  Debate Tournament Director  (Supply Chain & Operations) — drop Education & Coaching
update public.careers set secondary_industries = 'Hospitality & Events,Law & Government'
where id = '4134df2c-97ab-40cf-8c3c-de9d9ff4f8a7' and secondary_industries = 'Education & Coaching,Hospitality & Events,Law & Government';

--  Destination Wedding Designer  (Supply Chain & Operations) — drop Hospitality & Events
update public.careers set secondary_industries = 'Design & Creative,Entrepreneurship'
where id = '50e02e94-377d-426e-b983-82e3a5f6c711' and secondary_industries = 'Hospitality & Events,Design & Creative,Entrepreneurship';

--  Development Coordinator  (Social Impact & Nonprofit) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = 'be9bb7dd-a5b2-49db-8541-a4dd6bbebbdc' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Documentary Distributor  (Media & Journalism) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications'
where id = '9910e037-04c0-4d47-8b92-939d135cbe17' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications';

--  Eyebrow Specialist  (Fashion & Beauty) — drop Supply Chain & Operations
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering'
where id = 'c72e4ab1-5f4d-407e-bf1b-bab5aacc74a0' and secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering';

--  Footwear Designer  (Fashion & Beauty) — drop Supply Chain & Operations
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research'
where id = 'c36b0de3-69e7-4bf2-9722-813eab8b0bbf' and secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research';

--  Growth Hacker  (Marketing & Communications) — drop Cybersecurity
update public.careers set secondary_industries = 'Tech & Engineering,Law & Government,Science & Research'
where id = '6b3fd27c-d81a-4e17-9b8d-597033114c4f' and secondary_industries = 'Cybersecurity,Tech & Engineering,Law & Government,Science & Research';

--  High School Principal  (Education & Coaching) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Law & Government'
where id = '8621f068-4dd2-4265-929a-572b6b5f6406' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Law & Government';

--  Homelessness Services Coordinator  (Social Impact & Nonprofit) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '7e18a4bc-ec97-431a-a1d2-ea098b95216f' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Human Trafficking Prevention Coordinator  (Social Impact & Nonprofit) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Cybersecurity'
where id = '267ae409-c75c-40fe-b2f2-1b8e50de2c88' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Cybersecurity';

--  Incubator Program Director  (Education & Coaching) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Entrepreneurship'
where id = '35ff7cda-81c9-43fb-aefc-458d9e9d50c4' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Entrepreneurship';

--  K-12 School Principal  (Education & Coaching) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Law & Government'
where id = '3f230d4a-c3c5-4fc6-b8eb-95a3caafcb63' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Law & Government';

--  Live Streaming Production Manager  (Media & Journalism) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '6207a784-617a-4422-a68c-f0bfaa9e3716' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Municipal Planning Director  (Architecture & Urban Planning) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = 'a8037472-24c4-48b3-aefa-eb4ac4299140' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Personal Training Business Owner  (Sports & Fitness) — drop Marketing & Communications
update public.careers set secondary_industries = 'Business & Finance,Design & Creative,Science & Research'
where id = '2b53168c-6cb7-47c9-a832-90e7385d70ee' and secondary_industries = 'Marketing & Communications,Business & Finance,Design & Creative,Science & Research';

--  Study Abroad Program Coordinator  (Supply Chain & Operations) — drop Education & Coaching
update public.careers set secondary_industries = 'Hospitality & Events,Business & Finance'
where id = 'e306a29d-e82b-4337-8bec-071433f2f513' and secondary_industries = 'Education & Coaching,Hospitality & Events,Business & Finance';

--  Sustainable Apparel Designer  (Fashion & Beauty) — drop Environment & Sustainability
update public.careers set secondary_industries = 'Science & Research,Law & Government,Tech & Engineering'
where id = 'fdb0c736-63d4-4877-bf66-11c4b709072d' and secondary_industries = 'Environment & Sustainability,Science & Research,Law & Government,Tech & Engineering';

--  Volunteer Coordinator  (Social Impact & Nonprofit) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '365887f9-96f8-4a05-a3bc-2c213dce3c78' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Youth Sports Director  (Sports & Fitness) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id = 'cab2cacd-a9e4-4f69-9695-bb1f85a6f095' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning';

--  Patient Advocate  (Healthcare & Medicine) — drop Social Impact & Nonprofit
update public.careers set secondary_industries = 'Education & Coaching,Law & Government'
where id = 'cbd89142-4422-4415-b34e-4dd45bd80ff3' and secondary_industries = 'Social Impact & Nonprofit,Education & Coaching,Law & Government';

--  Financial Crime Technology Specialist  (Tech & Engineering) — drop Business & Finance
update public.careers set secondary_industries = 'Cybersecurity,Law & Government'
where id = 'adf3485e-cef2-4277-92b8-9ac975e79738' and secondary_industries = 'Business & Finance,Cybersecurity,Law & Government';

--  Golf Instructor  (Sports & Fitness) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Media & Journalism'
where id = 'd2b40242-074e-4c8a-a770-011abd3adb34' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Media & Journalism';

--  Healthcare Access Advocate  (Healthcare & Medicine) — drop Social Impact & Nonprofit
update public.careers set secondary_industries = 'Law & Government,Education & Coaching'
where id = '15120114-3c8b-488e-bb84-25ed57d2574b' and secondary_industries = 'Social Impact & Nonprofit,Law & Government,Education & Coaching';

--  Youth Development Specialist  (Social Impact & Nonprofit) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id = '45a76936-4e3f-4080-afff-4ac3a968acb9' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning';

--  Anesthesiologist Assistant  (Healthcare & Medicine) — drop Arts & Performance
update public.careers set secondary_industries = 'Media & Journalism,Design & Creative,Science & Research'
where id = '47dbe29a-37c0-4a44-88fe-fa6c1742c558' and secondary_industries = 'Arts & Performance,Media & Journalism,Design & Creative,Science & Research';

--  Elementary School Teacher  (Education & Coaching) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id = '5b45bc6c-f8c3-4a0d-863a-e24f7d742dda' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning';

--  Forensic Nurse  (Healthcare & Medicine) — drop Cybersecurity
update public.careers set secondary_industries = 'Tech & Engineering,Law & Government,Science & Research'
where id = '86e9c088-dfc4-402a-b87e-375bc49a2307' and secondary_industries = 'Cybersecurity,Tech & Engineering,Law & Government,Science & Research';

--  Prosecutor  (Law & Government) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit'
where id = '584d1946-a2b1-4819-883d-a351ae7960a9' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Social Impact & Nonprofit';

--  Trademark Attorney  (Law & Government) — drop Marketing & Communications
update public.careers set secondary_industries = 'Business & Finance,Design & Creative,Science & Research'
where id = '9f740b13-c56b-4bf9-a68d-e56d0b199291' and secondary_industries = 'Marketing & Communications,Business & Finance,Design & Creative,Science & Research';

--  Tutor for Learning Disabilities  (Education & Coaching) — drop Sports & Fitness
update public.careers set secondary_industries = 'Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning'
where id = 'da26c81f-ab49-482b-9a3d-1eeed5eeb375' and secondary_industries = 'Sports & Fitness,Healthcare & Medicine,Marketing & Communications,Architecture & Urban Planning';

--  Recreation Therapist  (Healthcare & Medicine) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = 'e762e773-8edb-476a-a278-ad012c4e004e' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Recreational Therapist  (Healthcare & Medicine) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Entrepreneurship'
where id = 'b814a04f-88ec-4c5e-ab90-a09bbcc4741f' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Entrepreneurship';

--  Sports Physical Therapist  (Healthcare & Medicine) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Science & Research'
where id = '06dfa212-98be-4fa4-bcd7-3111936f6eea' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Science & Research';

--  Chess Coach  (Education & Coaching) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Media & Journalism'
where id = 'a4f1c0ea-0397-48c8-8a9d-b67e6a78f0ac' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Media & Journalism';

--  Genetic Testing Counselor  (Healthcare & Medicine) — drop Supply Chain & Operations
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research'
where id = '87aa195e-63c0-4f54-8e62-10a0f0be46f4' and secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research';

--  Genomic Counselor  (Healthcare & Medicine) — drop Supply Chain & Operations
update public.careers set secondary_industries = 'Business & Finance,Tech & Engineering,Science & Research'
where id = '807c73c6-2c0d-4abb-8bdb-ed2c8748d3a0' and secondary_industries = 'Supply Chain & Operations,Business & Finance,Tech & Engineering,Science & Research';

--  Literacy Coach  (Education & Coaching) — drop Fashion & Beauty
update public.careers set secondary_industries = 'Design & Creative,Marketing & Communications,Science & Research'
where id = '037f4a3a-c8af-443f-84f9-28cafcff35d8' and secondary_industries = 'Fashion & Beauty,Design & Creative,Marketing & Communications,Science & Research';

--  Montessori School Director  (Education & Coaching) — drop Gaming & Esports
update public.careers set secondary_industries = 'Tech & Engineering,Marketing & Communications,Architecture & Urban Planning'
where id = 'a39b6aa4-d286-4bd7-aa51-9aaaf9daa931' and secondary_industries = 'Gaming & Esports,Tech & Engineering,Marketing & Communications,Architecture & Urban Planning';

--  Nutritionist (Sports)  (Healthcare & Medicine) — drop Food & Culinary
update public.careers set secondary_industries = 'Hospitality & Events,Business & Finance,Arts & Performance'
where id = 'a21b0e51-9052-4f33-95e8-edc77f5d82f4' and secondary_industries = 'Food & Culinary,Hospitality & Events,Business & Finance,Arts & Performance';

--  Audiologist  (Healthcare & Medicine) — drop Tech & Engineering
update public.careers set secondary_industries = 'Business & Finance,Design & Creative,Science & Research'
where id = 'aac1511a-c76d-498e-aa36-8afacdb1340e' and secondary_industries = 'Tech & Engineering,Business & Finance,Design & Creative,Science & Research';

--  Wound Care Specialist  (Healthcare & Medicine) — drop Hospitality & Events
update public.careers set secondary_industries = 'Food & Culinary,Marketing & Communications'
where id = 'c89fac58-78f7-4cf2-9f0f-4902eb12c582' and secondary_industries = 'Hospitality & Events,Food & Culinary,Marketing & Communications';

commit;
