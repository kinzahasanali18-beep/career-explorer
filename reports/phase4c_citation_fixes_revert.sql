-- Revert 20260915010000_citation_fixes.sql — restores the previous source_url for 81 rows.
-- Note: the previous values are the fabricated/dead citations. This exists to
-- undo the migration exactly, not because those URLs were good.

begin;

update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4091.00' where id = '01a01cd2-d74c-4992-be47-9034e3ff8f2c';  -- Water Conservation Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '05a1f0e0-58f4-4433-ae46-dade34894c3e';  -- Digital Video Editor
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' where id = '05f4bee2-85c3-445c-af41-d7085bd1d365';  -- Sports Medicine Specialist
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = '0fa5ce48-8833-486b-965f-e179833cca73';  -- Corrections Journalist
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = '13ebd229-b98d-4bf2-a9a8-549fc3a807b7';  -- Grant Reporter
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '188cbd49-26ab-467f-ae1b-fa8a1b242376';  -- Assistant Film Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '192e7620-0820-4a63-a5e4-38917d8c112c';  -- Performance Video Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '1b5fa13d-133b-41ef-8249-3d5af8242a68';  -- Streaming Video Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '1d51a567-ac74-4a0a-bacd-a331a4cbc607';  -- Long-Form Video Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = '22ae346a-0942-4450-9a8c-317384ea61c3';  -- Quality Assurance Automation Tester
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' where id = '243a90f3-43ed-4a1e-8f2b-69916814f830';  -- Cosmetic Dermatologist
update public.careers set source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/medical-records-and-health-information-technicians.htm' where id = '2670ee81-3613-41da-bf47-2031972bc70a';  -- Medical Records Administrator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = '27e334c1-43db-4650-8068-fe49bde58b6b';  -- Product Security Engineer
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = '29df0e82-ff26-4895-97ca-5a7e9eb7d2ce';  -- Tech Reporter
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = '2ab6f41e-93df-4a28-9840-ebeeef84ef54';  -- Physical Medicine & Rehabilitation Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4013.00' where id = '2c8ba597-96d5-4ba8-a1f6-2b257859ca84';  -- Live Event Lighting Technician
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/atmospheric-scientists-and-hydrologists.htm' where id = '3433d1ed-7798-4f96-b99b-09fe8598b5a9';  -- Climate Data Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2031.00' where id = '3741ed20-8b75-408f-be36-942f02bf673e';  -- Fundraising Consultant
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/payroll-specialists.htm' where id = '3787dbd9-395b-4f72-b80f-0b6532aeabe0';  -- Payroll Compliance Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '37955160-cf48-4e31-9a42-56aabdedcf82';  -- Senior Video Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1132.00' where id = '38184007-ba58-47a6-9f70-c9b697847790';  -- Software as a Service (SaaS) Developer
update public.careers set source_url = 'https://www.bls.gov/ooh/production/quality-assurance-inspectors.htm' where id = '3e561acc-2263-470f-b2b9-3c500b9720c1';  -- Quality Assurance Manager (Manufacturing)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = '3f740066-bc7b-44c1-a4b1-0a91efcd582c';  -- Quality Assurance Automation Engineer
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' where id = '418d66dd-8a27-4e20-8a66-c571b5a01dec';  -- Clinical Laboratory Scientist
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = '46195c3d-c921-4d62-8ea8-06040f2bdb18';  -- Polymer Chemist
update public.careers set source_url = 'https://www.bls.gov/ooh/arts-and-design/film-and-video-editors-and-camera-operators.htm' where id = '4cf4641b-be3f-4161-8dec-237fb7c85070';  -- Video News Editor
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-records-health-information-technicians.htm' where id = '4ea7b552-585e-4c11-913f-3e87e42e4829';  -- Medical Coding Specialist
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' where id = '52f26cde-7982-4797-8e0c-abd822bfa6b6';  -- News Producer (Broadcast)
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = '569ce2bf-403b-4365-805e-a132285e9e40';  -- Pharmaceutical Chemist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' where id = '5bbf7750-631a-46e3-abd2-b37c568ab8df';  -- Orthopedic Sports Medicine Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4091.00' where id = '5dacd8d9-c201-4d43-9727-7cf22b4fadda';  -- Environmental Test Technician
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/claims-adjusters-appraisers-examiners-and-investigators.htm' where id = '64874d86-edb3-415e-869e-f673008cd8bf';  -- Insurance Claims Adjuster
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9061.00' where id = '66746713-bd85-4fa7-aaca-de118d4c38b5';  -- Real Estate Development Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/medical-laboratory-technologists-and-technicians.htm' where id = '6a200c0f-2cad-4cb4-99a1-05608994c919';  -- Genetic Laboratory Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2031.00' where id = '6a2da00b-e125-4959-9da6-36ba347d7b4e';  -- Influencer Marketing Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = '6f4e9c3f-4c4b-45ca-8d3b-22410a46acfb';  -- AI-Powered App Developer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1132.00' where id = '7aaeb4e3-e00c-4911-a244-31bb2f21965a';  -- Backend API Developer
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = '7f728ce0-e860-4cd3-862b-58a151cd9a41';  -- Physical Medicine and Rehabilitation Specialist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-laboratory-technologists-and-technicians.htm' where id = '81dfe359-ab31-4420-9caa-6e9fbc3a7f1f';  -- Genetic Laboratory Technologist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' where id = '8e436142-8831-4949-b5f7-dfd7ecad1e1f';  -- Emergency Room Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4013.00' where id = '900a4b22-69da-407f-bdb9-d65a2d200ce8';  -- Theater Lighting Technician
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = '929c4575-4558-43c5-bf92-2e482123dc97';  -- Investigative Journalist
update public.careers set source_url = 'https://www.bls.gov/ooh/sales/pharmaceutical-sales-representatives.htm' where id = '9476bb49-7394-4f34-a6ce-87ad2f22cefd';  -- Pharmaceutical Sales Representative
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = '95e0633e-3bc1-40ea-bdfc-3a4a304dbd4e';  -- Hospital Epidemiologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1069.00' where id = '95e51c7f-2c8a-4a10-bbd8-465896bd97e9';  -- Naturopathic Doctor
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' where id = '9969fd3f-26b9-4810-b532-5fc050c7ef4f';  -- Sports Medicine Doctor
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-including-meteorologists.htm' where id = 'a30ee8fc-d0ba-41c0-b917-f41e8c2b6b25';  -- Atmospheric Chemist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3011.00' where id = 'ac023d5e-65d8-4211-bbaf-d3bada1b5ed8';  -- Fitness Facility Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/51-5061.00' where id = 'b9529660-7e6b-4ea3-a26b-a5b1757b70c3';  -- Print Production Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'b9feef08-8079-48df-8791-6306101b8e0e';  -- Documentary Journalist
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'ba613049-49db-4627-8b93-702086e4e5c5';  -- Travel Journalist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-1104.00' where id = 'bc335dee-6db5-4ee0-b0df-27b0ca92c75e';  -- Laboratory Animal Care Specialist
update public.careers set source_url = 'https://www.bls.gov/ooh/education-training-and-library/tutors-and-teachers.html' where id = 'bcaa1b68-38ec-4c70-8004-7acf9151de39';  -- Academic Tutor (Specialized Subjects)
update public.careers set source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' where id = 'be196e5d-d106-474e-a5a0-5a021992430e';  -- Franchise Operations Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' where id = 'c0410a07-dafc-47ec-80bf-6df69518bf46';  -- Quantum Physicist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = 'c978c25c-fd07-42e8-84fc-8c5fb5b3e541';  -- Quality Assurance Engineer (Software)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/nurse-anesthetists-nurse-midwives-and-nurse-practitioners.htm' where id = 'c97d80e0-d374-47a4-8111-aab29f23de13';  -- Psychiatric Nurse Practitioner
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/emergency-medical-technicians-and-paramedics.htm' where id = 'cbf748b1-95c8-40d0-b5be-2273f16db6ca';  -- Emergency Room Technician
update public.careers set source_url = 'https://www.bls.gov/ooh/education-training-and-library/school-counselors.htm' where id = 'cd8d2362-af0a-4ff6-ab76-42345ecba330';  -- High School Guidance Counselor
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'd1ecea5f-0843-4f68-b33c-103b7004d88f';  -- News Correspondent
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/claims-adjusters-appraisers-examiners-and-investigators.htm' where id = 'd227822f-fceb-4e95-bb10-722f0b091e73';  -- Insurance Adjuster
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-1011.00' where id = 'd22eb87f-3643-476b-9b0a-e5c359364950';  -- Laboratory Animal Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = 'd3ef55b2-1209-4b65-9461-e642697c937b';  -- Quality Assurance Engineer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2211.00' where id = 'd59a3a38-cef6-4488-a65e-faa83880ff30';  -- Energy Efficiency Auditor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = 'da5157a8-eca9-426a-b786-396808f70533';  -- Mobile App Developer (iOS/Android)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.00' where id = 'da807d6c-5815-4ad2-8a0b-942534e32889';  -- Cosmetics Quality Control Analyst
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4091.00' where id = 'dd4cbeb9-615e-46c7-8875-2cf56e4ed814';  -- Renewable Energy Auditor
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = 'de2f269e-d8d1-43e4-b843-492b8b27868a';  -- Beauty Chemist
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = 'de7bfe85-416c-4cf8-b5ef-95b17c3dc42c';  -- Organic Chemist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = 'df7c9071-876b-45a5-89c5-0fa1771715aa';  -- Physical Medicine and Rehabilitation Doctor
update public.careers set source_url = 'https://www.bls.gov/ooh/education-training-and-library/school-counselors.htm' where id = 'e045b607-5251-4ab0-b2bf-23973d7166fa';  -- High School Career Counselor
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'e45fe45c-e06e-489b-8f1a-a980e9c5cf8f';  -- Community News Reporter
update public.careers set source_url = 'https://www.bls.gov/ooh/management/park-recreation-managers.htm' where id = 'e5591c48-e0fa-4a62-bfd1-75dda84e801a';  -- Parks and Recreation Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = 'e5ebc79d-f5aa-4f71-a9de-50805be419f1';  -- Medicinal Chemist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1257.00' where id = 'e6fac05a-1dcd-41f6-bfe2-11872487348f';  -- Game Developer (Indie)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' where id = 'e985178d-2f68-4187-9e74-624dbb57f71d';  -- Occupational Sports Medicine Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9011.03' where id = 'ea921b74-303b-4986-bfaa-30f1525bbfb3';  -- Food Safety Manager (Hospitality)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = 'f1f49d00-dad3-4b72-a0cb-5a53266dfed6';  -- Software Quality Assurance Engineer
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'f62523e5-fd2a-4da1-b9cb-f975648cd7a9';  -- Freelance Journalist
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/conservation-scientists-and-foresters.htm' where id = 'fb5b42aa-58aa-4661-a0b9-474991e3c1f5';  -- Forest Restoration Technician
update public.careers set source_url = 'https://www.bls.gov/ooh/protective-service/sheriffs-and-detectives.htm' where id = 'fe31a8bf-cb41-4332-a126-0271f136154a';  -- Deputy Sheriff

commit;
