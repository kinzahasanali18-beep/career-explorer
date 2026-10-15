-- Revert 20261015010000_rematch_citation_fixes.sql — restores the previous source_url for 116 rows.
-- Note: the previous values are the wrong-but-valid citations this migration
-- fixes. This exists to undo the migration exactly, not because those URLs
-- were good.

begin;

update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' where id = '030c1cf0-2e24-4ce3-b289-175ae319a4c3';  -- Podcast Host (News)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.00' where id = '07ff5018-2f4d-4697-a9ef-b3b9d70f593e';  -- Textile Innovator (Lab-Grown Fibers)
update public.careers set source_url = 'https://www.bls.gov/ooh/protective-service/building-fire-and-code-inspectors.htm' where id = '0b94ffc1-4b27-47c4-a66e-fdf1e616d464';  -- Municipal Compliance Officer
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/agricultural-scientists.htm' where id = '0ba231ee-0d93-443b-987f-2c16b2589ccc';  -- Agricultural Scientist
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = '0c3d356f-a33b-4bb1-ad4f-c132c3286f36';  -- Research Chemist
update public.careers set source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' where id = '0d66f43b-3a92-4980-ab00-1c6d437f15e0';  -- Coffee Shop Owner
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-1191.00' where id = '0e42bfb9-1eca-430a-8175-027735879d42';  -- Hairstyle Educator
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/medical-and-clinical-laboratory-technologists-and-technicians.htm' where id = '0fbcacdc-c297-4fa6-8ff2-e514c0c30ff7';  -- Clinical Laboratory Director
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' where id = '1257e7af-4351-4465-8ad3-caea767aaa72';  -- Radio Host
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = '13195332-20ce-46d0-89df-01631c538869';  -- English as a Second Language (ESL) Instructor
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/insurance-brokers-and-agents.htm' where id = '138e08c1-f5a3-44e4-b2fd-fd7937c1f8b6';  -- Insurance Broker
update public.careers set source_url = 'https://www.bls.gov/ooh/personal-care-and-service/dancers-and-choreographers.htm' where id = '13ce55ad-ca4d-4143-a010-0aecbdd3e563';  -- Dance Instructor (Classical Ballet)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3011.00' where id = '14fa81b7-ed94-4dcb-b3b6-9802f800393e';  -- Program Manager (Nonprofits)
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/entrepreneurs.htm' where id = '16a97f8b-0dc9-486e-80b8-9a9bef3a86f2';  -- API-as-a-Service Entrepreneur
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2499.00' where id = '1f63f0f8-b185-4aa0-a5b3-e7bb549f85a1';  -- Fiber Artist
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = '209e4f3f-95f4-44fd-b3d1-ee6a96d32625';  -- High School Science Teacher
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/vocational-education-teachers.html' where id = '2350aa25-566a-4252-9448-c7b11fa40fd9';  -- Vocational Instructor
update public.careers set source_url = 'https://www.bls.gov/ooh/arts-and-design/film-and-video-editors-and-camera-operators.htm' where id = '2678f49f-6778-4150-84f3-a82f684b1bea';  -- Video Producer
update public.careers set source_url = 'https://www.bls.gov/ooh/entertainment-and-sports/film-and-video-editors-and-camera-operators.htm' where id = '26bfe83b-6744-4df4-b885-e452f908d6ec';  -- Motion Picture Editor
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' where id = '2a4ddd63-f191-4fba-a2bc-0bc3f635248d';  -- Clinical Lab Director
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = '2c8a3f2d-036e-4fff-b8e0-db98464fd371';  -- English as Second Language (ESL) Teacher
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4013.00' where id = '2cab1e72-c8b9-4a40-991c-1a8af6f78861';  -- Transmission Technician (Broadcasting)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1641.00' where id = '2e2c3006-782b-455a-a2dd-fbac264fca98';  -- Cardiac Surgeon
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' where id = '315e726f-5656-4f7f-a052-c9ca084efd71';  -- Clinical Neurologist
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/purchasing-managers-buyers-and-purchasing-agents.htm' where id = '31b84804-c9d2-4a3b-805b-05b936a9555b';  -- Procurement Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9999.01' where id = '32cd69c5-f73f-45ab-b25d-30ce1ebe09b9';  -- Security Operations Center Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/hotel-receptionists-and-concierges.htm' where id = '38fcb2e4-e1d6-4949-ada0-010fe96d3624';  -- Hotel Front Desk Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/broadcast-news-analysts.htm' where id = '3e9e6b98-28fd-4472-bbad-fbaf34a5147c';  -- Broadcast Journalist (TV/Radio News)
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/special-education-teachers.html' where id = '3ef1e70d-53fa-42f5-bdd9-65c9577add14';  -- Special Needs Teacher (Inclusive Education)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' where id = '477c6fd2-f01d-4570-9d15-6538b922908f';  -- Urologic Surgeon
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = '47e016e0-dddd-4cb1-a0bb-f31699cb1a48';  -- Investigative Researcher (Journalism)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.02' where id = '4a290184-dbaf-4e2e-96fe-6ff023b37e9b';  -- Research Lab Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = '4b42c163-cc8a-4539-830d-e714ffb99313';  -- Language Arts Teacher
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3031.02' where id = '4c33c8b6-6536-4e90-bad7-11a5bce8691f';  -- Educational Diagnostician
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/purchasing-managers-buyers-and-procurement-specialists.htm' where id = '4fc2d9da-37c6-4638-a556-41dbd6f51a62';  -- Procurement Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/education-training-and-library/instructional-coordinators-and-curriculum-specialists.htm' where id = '5311bf30-fa45-4561-bbcc-414c052140fc';  -- Adult Education Program Director
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.02' where id = '55038fc1-7ad8-412e-ab8d-b79c1aa9e45c';  -- Cosmetics Quality Assurance Tester
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial/entrepreneurs.htm' where id = '55048691-54aa-4053-b664-d30d8de7bae4';  -- Real Estate Tech Founder
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' where id = '56ef0650-defc-4ef5-90c4-ff23d1902b74';  -- Radio Producer
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = '5c05267b-e782-4671-bce5-0f4e42d94cf6';  -- Video Journalist
update public.careers set source_url = 'https://www.bls.gov/ooh/personal-care-and-service/recreation-and-fitness-workers.htm' where id = '5ea1eec0-a56a-4667-94e7-ee3a867f959d';  -- Youth Development Specialist (Sports)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2071.00' where id = '6062b780-e7a8-4622-9229-be2aaaba1d6a';  -- Medical Coder (ICD-10 Specialist)
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = '610b8982-655d-4aec-92a9-c8f14174d157';  -- Materials Chemist
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial/advertising-promotions-and-marketing-managers.htm' where id = '61b58425-1520-42db-ac8e-924c53db551f';  -- Makeup Artist Manager (Beauty Brand)
update public.careers set source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' where id = '64a85153-fe30-4a8a-b2a7-392bab2f8d0c';  -- Housekeeping Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/occupational-health-and-safety-specialists-and-technicians.htm' where id = '65288c4f-1689-4dd5-8ec1-1ead67a24ede';  -- Occupational Health Nurse
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-and-hydrologists.htm' where id = '658bac2b-7c38-41d6-b4a7-ba8b74921dae';  -- Climate Modeler
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = '6642e935-49e6-49fc-bc84-329feed05f36';  -- High School History Teacher
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3022.00' where id = '664e6bb2-c842-45f4-9a39-4a27a677a790';  -- Beauty PR Specialist
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = '66e97033-37a3-4a37-842c-f5320b93b5b5';  -- High School Teacher
update public.careers set source_url = 'https://www.bls.gov/ooh/protective-service/federal-agents.htm' where id = '678268b8-38a0-4a76-9732-717d6d648185';  -- FBI Special Agent
update public.careers set source_url = 'https://www.bls.gov/ooh/entertainment-and-sports/broadcast-and-sound-engineering-technicians.htm' where id = '689a4ee7-3d65-44d1-9592-2660df3e209b';  -- Audio Engineer (Broadcasting)
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = '69b5237e-b5f7-4ce7-9b9c-cdb14954645d';  -- Language Arts Teacher (Secondary)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3091.00' where id = '6a8e9d52-bff5-4b52-9d43-fd2bf56f3c70';  -- Cosmetology Instructor
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = '7186a48b-565c-4869-b08c-abfa4c2c370c';  -- Staff Writer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = '728dbbb3-031c-42b9-b503-b8caaa9d2f1b';  -- QA Automation Engineer
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/clinical-laboratory-technologists-and-technicians.htm' where id = '7bf2c4f3-10dc-4076-bcd1-0f1c69a1bc81';  -- Hospital Lab Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' where id = '8057c561-ba98-4b32-8b7e-1a773d19e8b0';  -- Occupational Health Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1199.09' where id = '809b1d04-1613-4c45-a228-7bd3bd6ef82d';  -- Software Architect (Enterprise Systems)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.00' where id = '835063b8-6896-424f-9429-b4e095f45899';  -- Pharmaceutical Quality Assurance Analyst
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/physical-therapist-assistants-and-aides.htm' where id = '837df378-4b7e-4edb-9667-dfacba71a4fe';  -- Physical Therapy Assistant
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2099.00' where id = '84120952-326b-4ac9-a496-021e10bd506e';  -- Robotics Coach (STEM)
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = '849addb7-bcb6-41b6-beda-35737768d568';  -- Video Journalist (Documentary)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-occupations/physicians-and-surgeons.htm' where id = '865e0b28-1f08-4580-b45a-cb46982ff0cf';  -- Team Physician
update public.careers set source_url = 'https://www.bls.gov/ooh/protective-service/federal-agents-and-special-agents.htm' where id = '86d0bab2-ea66-482e-be4e-1e35064574b8';  -- Federal Investigator
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = '8a8dd900-5968-4186-b913-74e63d066bde';  -- ESL/ESOL Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '8b1f8e8d-eb0b-4d32-b525-8a3754cf74d9';  -- Documentary Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2071.00' where id = '8c9979d8-6105-4461-af29-0447479ad036';  -- Medical Coder (Remote Specialist)
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = '8f30f380-426b-4684-94eb-4cf03cc9100d';  -- Pharmaceutical Scientist
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = '9013d1dc-fd12-4fb7-99af-dca18c983f61';  -- Language Tutor (ESL)
update public.careers set source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/court-clerks-and-bailiffs.htm' where id = '928466fe-3214-4a18-8874-452d527025ca';  -- Court Administrator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4091.02' where id = '960ced69-816b-480a-a7f5-cd91a06a27e4';  -- Museum Conservation Scientist
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-and-geoscientists.htm' where id = '9c96cb69-45b4-4123-a603-2449dbc790f4';  -- Climate Scientist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-occupations/clinical-laboratory-technologists-and-technicians.htm' where id = '9cd44ccd-72c1-4211-8741-605a9c088dc1';  -- Medical Laboratory Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1061.00' where id = '9f2e47e3-9079-434b-8fa6-92dd89f7f53a';  -- Clinical Geneticist
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = '9ff5c444-9590-434d-9461-60aaa4a94c13';  -- Digital Journalist
update public.careers set source_url = 'https://www.bls.gov/ooh/architecture-and-engineering/architectural-technologists.htm' where id = 'a0c7c78e-a10f-4afa-bb18-b0173dc2ed78';  -- Architectural Technologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4091.00' where id = 'a2480a1f-022b-4bf1-b188-68ca437aeabf';  -- Sustainability Analyst (Corporate)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-1100.00' where id = 'a6c5d501-acc1-41a9-9257-986891deb762';  -- Wildlife Rehabilitator
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'a76063ab-ebc3-4456-b6ef-b7cc51755cc3';  -- Sports Journalist
update public.careers set source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/payroll-specialists.htm' where id = 'ab451db8-3ac2-411c-acc9-a9e20c46e914';  -- Payroll Administrator
update public.careers set source_url = 'https://www.bls.gov/ooh/legal/judges-and-prosecutors.htm' where id = 'ad7ea8ca-6955-48a8-b6a4-d55d1c354bd7';  -- Municipal Prosecutor
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = 'afd84ea5-ba22-4cd2-9168-701c14bfecd5';  -- Addiction Medicine Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1132.00' where id = 'b20c96d6-8178-429d-9295-2e8ed91564d8';  -- Fitness App Developer
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = 'b328e72d-89a0-4538-b9fb-ae5d5879ea19';  -- K-12 Math Teacher
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/pharmacologists.htm' where id = 'b73ce9d0-38a6-4484-a71c-ad3461c1de06';  -- Clinical Pharmacologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2031.00' where id = 'b80585b6-25f1-486a-ac02-af93070416a9';  -- Social Media Strategy Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' where id = 'bac095a8-8ca4-448d-96e2-6a36919915e4';  -- Coffee Shop Franchise Owner
update public.careers set source_url = 'https://www.bls.gov/ooh/management/self-employed-workers.htm' where id = 'c0818e9e-ebab-4587-9fa3-aae1d9268e1c';  -- Coffee Shop Entrepreneur
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'c271786f-442a-4059-abf1-d8ceb0bac69b';  -- Environmental Reporter
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-9011.00' where id = 'c8502392-2529-4b90-a6e7-e07d8be13842';  -- Lab Safety Officer
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'cc380a76-8962-49db-9a78-88ad4858f7dd';  -- Technology Reporter
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.00' where id = 'cdadaf75-79b4-46b4-8205-3ce0f61db3af';  -- Quality Assurance Chemist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' where id = 'cef58e2d-b748-4830-a6ee-3583d293b95a';  -- Clinical Lab Scientist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-social-support/physicians-and-surgeons.htm' where id = 'd0318652-53ab-48ce-ab52-7637ab84940a';  -- Sleep Medicine Physician
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' where id = 'd4f04120-d851-4d3e-82c7-1090c0c26c24';  -- ESL/ESOL Teacher
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3011.00' where id = 'd8cb2c4a-c70d-44c7-a793-63816e5e5186';  -- Independent Coffee Shop Owner
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' where id = 'dbcc38a0-92ed-4254-ac43-5a5aa8f4f014';  -- Physics Laboratory Technician
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-records-and-health-information-technicians.htm' where id = 'dbceb025-710f-492e-b4f0-b7278d2e5d7a';  -- Medical Coder
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = 'e2344d18-99ff-4719-8662-89b4cb242902';  -- Chemistry Lab Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/broadcast-news-analysts.htm' where id = 'e5e0a77b-dab2-4c55-a0de-0c69913e8f90';  -- Sports Announcer
update public.careers set source_url = 'https://www.bls.gov/ooh/architecture-and-engineering/broadcast-and-sound-engineering-technicians.htm' where id = 'e64de3c9-8f36-4cf3-b31a-3ec7253ec460';  -- Broadcasting Engineer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.00' where id = 'e6675317-35f5-4ce0-b7ec-48b2e8329c76';  -- Physics Lab Technician
update public.careers set source_url = 'https://www.bls.gov/ooh/education-training-and-library/instructional-coordinators-and-curriculum-specialists.htm' where id = 'eae9cb72-8143-4907-ab49-2d2aaa776104';  -- Curriculum Specialist (Gifted Programs)
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' where id = 'ef24fb2c-e153-4765-a888-555150d7b4de';  -- Broadcast Journalist (Radio)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-and-clinical-laboratory-technologists-and-technicians.htm' where id = 'ef3e745e-a01f-4b5b-abee-c2a734d4aa5b';  -- Medical Laboratory Director
update public.careers set source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' where id = 'f30281cb-0688-4580-84b7-08f6a038276a';  -- Franchise Operator (Food & Beverage)
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'f41a2f15-5408-4b19-a2f5-9f9cda16f8b6';  -- Video Columnist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3011.00' where id = 'f5f07eec-33be-4c1b-a574-2448e6be1c8a';  -- Laboratory Operations Manager
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-including-meteorologists.htm' where id = 'f7f3fc68-82f6-4897-87bd-dc79069b7c6a';  -- Climate Modeler (Atmospheric Science)
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'f94e04e4-28c4-4b1d-b4f3-4a2d51b308c4';  -- Science Journalist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/nurse-midwives-and-nurse-anesthetists.htm' where id = 'f965b091-436f-4187-aca9-eb8247c3d0d4';  -- Nurse Midwife
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2014.00' where id = 'fc962015-0bc2-4512-a8c7-3352700cb42c';  -- Performance Capture Artist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-1011.00' where id = 'fd46ce0a-65ca-4df9-b502-db38b2918d77';  -- Resort Guest Services Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-1011.00' where id = 'fe04d74b-7417-49e6-8d44-f544ccc94e62';  -- Hotel Convention Services Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-1099.00' where id = 'ff8daad8-e29f-4f81-a5e9-9410663587c2';  -- Wildlife Rehabber

commit;
