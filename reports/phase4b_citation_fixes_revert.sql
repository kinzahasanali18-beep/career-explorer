-- Revert 20260819010000_citation_fixes.sql — restores the previous source_url for 72 rows.
-- Note: the previous values are the fabricated bls.gov URLs. This exists to undo
-- the migration exactly, not because those URLs were good.

begin;

update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/emergency-medical-technicians-and-paramedics.htm' where id = '02fa8c04-94e9-47b4-9e49-48cfc7e5c4a4';  -- Emergency Medical Technician
update public.careers set source_url = 'https://www.bls.gov/ooh/education-training-and-library/tutors-and-teachers.html' where id = '0815d925-a3b4-4bec-8f72-ea2a7fbc2448';  -- Tutor (Private Mathematics)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-occupations/clinical-laboratory-technologists-and-technicians.htm' where id = '093d0ab1-2c1e-4154-8f2f-84d1c657b599';  -- Clinical Laboratory Technologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '0d1fe05b-3845-4197-917f-da94cc7841ed';  -- Video Editor (Freelance)
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' where id = '0f4714e5-e12a-4b6a-8b99-3cf6a916e796';  -- Physicist (Research)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/physicians-and-surgeons.htm' where id = '10fc9ed0-3b28-45d7-b0cc-2007f05d800a';  -- Cardiologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '1239ef70-78de-4645-881f-06b03f04c3f6';  -- Video Editor (Media)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '149b4016-44a1-4a69-bd39-5182c7539f15';  -- Video Editor (Documentary)
update public.careers set source_url = 'https://www.bls.gov/ooh/computer-and-information-technology/computer-network-architects-and-administrators.htm' where id = '1dac1327-4bb6-4ae9-af80-3b6cc82e3e0d';  -- System Administrator
update public.careers set source_url = 'https://www.bls.gov/ooh/food-preparation-and-serving-related/food-and-beverage-servers.htm' where id = '2b322872-2c36-46b3-a1a2-bdb4bc1409d6';  -- Barista (Specialty Coffee)
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' where id = '2e10f388-89a7-4622-991a-cf8bf84f9e39';  -- Radio Announcer
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' where id = '315fdacd-41ec-4076-9b48-1b9ec4b35eff';  -- Sports Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '31a440f1-e78d-4474-9dd5-0390a42635ff';  -- Video Editor (Media Production)
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/conservation-scientists-and-foresters.htm' where id = '32dcff21-4d05-463f-a5d1-332fa0e25a6a';  -- Conservation Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '33555605-b24d-46be-bb12-d5aaa56f86bb';  -- Video Editor (Broadcast)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/physical-therapist-assistants-and-aides.htm' where id = '3416965f-3b3c-4a2a-928e-6ff0b3f0c775';  -- Physical Therapist Assistant
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.00' where id = '344aa5f0-9bde-4c06-b132-1c6d8f2ed5f5';  -- Quality Control Analyst (Laboratory)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/physicians-and-surgeons.htm' where id = '395614dc-ee4f-43d7-a02a-e480e88ee0cd';  -- Dermatologist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' where id = '3b0b8dd4-26b7-4212-b761-81e9a1f2d176';  -- Medical Lab Technologist
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/teachers-kindergarten-and-elementary-school.htm' where id = '43b74c51-2136-4b76-864c-76a033c573c2';  -- Substitute Teacher
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = '43c925a8-cf0a-4f5a-80fe-3c1917635e6a';  -- Neurologist
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/kindergarten-and-elementary-school-teachers.htm' where id = '470ca10e-b238-4977-a5e6-ad21f1c1eb44';  -- Elementary School Teacher (STEM)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3093.00' where id = '498ecb55-c136-492b-a034-32455a8c716e';  -- Lab Animal Scientist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/clinical-laboratory-technologists-and-technicians.htm' where id = '53d86ab4-1c26-4efa-850e-087c957410cf';  -- Medical Technologist (Laboratory)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2071.00' where id = '5c0d722c-b8db-4187-afa9-a634377fd7f6';  -- Athletic Trainer (College Sports)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' where id = '5df0e8df-71b5-4061-994c-ce71b7fe33b3';  -- Physical Medicine and Rehabilitation Physician
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' where id = '5e1f4361-6262-4bad-8a05-cd731c384cc3';  -- Medical Technologist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/speech-language-pathology-assistants-and-aides.htm' where id = '656efb27-2e00-4015-a5cb-8d00fc845b38';  -- Speech Pathology Assistant
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = '666a3382-126f-4bdb-8ff7-6e8cbf70f595';  -- Chemist (Pharmaceutical)
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/multimedia-artists-and-animators.htm' where id = '667305da-6861-4aa2-92be-0d022614723c';  -- Video Editor (Broadcasting)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = '74bdd8b9-124d-492c-ae1e-7cc4252afd7f';  -- Pediatrician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.00' where id = '78900236-642e-4a22-b78e-54d4ff1e1fec';  -- Quality Control Analyst (Pharma)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = '7bbd5f38-70da-4e99-bb55-31375e3b4387';  -- Emergency Medicine Physician
update public.careers set source_url = 'https://www.bls.gov/ooh/computer-and-information-technology/database-administrators-and-architects.htm' where id = '81ec9725-3131-4b87-93e7-1e246d4d859b';  -- Database Administrator
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/emergency-medical-technicians-and-paramedics.htm' where id = '83ee3265-e692-4cf4-99c8-c1f0f4da878d';  -- Emergency Medical Technician (EMT)
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' where id = '88e2bab9-98d4-47a9-b28f-d36ffa205a9d';  -- Physicist (Particle Physics)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-1011.00' where id = '8b2fa566-d4e3-4bf9-a6c7-c0166ec4d470';  -- Lab Animal Caretaker
update public.careers set source_url = 'https://www.bls.gov/ooh/computer-and-information-technology/computer-network-architects-and-administrators.htm' where id = '8d7a7933-64a1-436e-9a8f-dfe79340b000';  -- IT Systems Administrator
update public.careers set source_url = 'https://www.bls.gov/ooh/education-and-training/kindergarten-and-elementary-school-teachers.htm' where id = '95a08cbc-f7d3-4b65-9b83-afa16657b787';  -- Elementary School Teacher (Science)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-2092.00' where id = '9761b636-41ea-4ae8-97d3-087a6931eeb0';  -- Law Clerk (Judge)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = '983ea7c3-4560-4cb0-8330-7dc3a67d0063';  -- Video Editor (Content Creator)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1199.09' where id = '99c58209-cc00-4940-a62b-ac89ff737a1b';  -- Systems Architect
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = '9b26d9d5-39da-48d8-9c99-881bc23a492c';  -- Physical Medicine & Rehabilitation Physician
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' where id = 'a0b1d9ff-d3f0-426e-a70e-70041c2bc374';  -- Sports Medicine Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1199.03' where id = 'a1e4fa31-9bed-4b41-9154-1e90be722f2b';  -- Acupuncturist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/clinical-laboratory-technologists-and-technicians.htm' where id = 'a3037ace-2a33-482d-b000-938ecc26ffd1';  -- Laboratory Technician (Clinical)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/diagnostic-medical-sonographers-and-cardiovascular-technologists-and-technicians.htm' where id = 'a4b5fb63-37af-4ccc-b8c2-198a4712acaa';  -- Sonographer (Ultrasound Technician)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-6031.00' where id = 'a6753a83-3fe5-4ebb-92a4-9f9225fe022e';  -- Tour Guide (Adventure Tourism)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4011.02' where id = 'ad6a86b6-1c88-434b-bf80-9771a097bbcd';  -- Food Science Technician
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = 'ae88cdda-6be0-4956-86ee-75f2fb11d3cc';  -- Ophthalmologist
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-and-geoscientists.htm' where id = 'aed40ffa-5144-4270-be1f-d5e8beb5964c';  -- Atmospheric Scientist
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = 'b02cd8b4-a370-481d-85bb-aaed32ba9976';  -- Chemist (Industrial)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-occupations/anesthesiologists-and-nurse-anesthetists.htm' where id = 'b3843afc-483a-44d3-a6ae-18e324192488';  -- Nurse Anesthetist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4091.00' where id = 'b6dc7d0f-8fcd-4940-94c6-d3b1424bae32';  -- Clinical Research Coordinator
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = 'ba09bfc6-0de7-4a59-9eed-ee1343aacb30';  -- Urologist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' where id = 'bb0e4da1-2508-487d-8de5-a850e7297e81';  -- Psychiatrist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = 'bd4cedc4-0e2a-4fc0-ad8d-3477bf4f8b7b';  -- Video Editor (Content Creation)
update public.careers set source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/claims-adjusters-appraisers-examiners-and-investigators.htm' where id = 'be7e7fa0-e5e4-4b26-b326-a0ebb4478697';  -- Claims Investigator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = 'cdd84a78-75f4-47f6-8718-c2756beaa17a';  -- iOS App Developer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4008.00' where id = 'd1df8f5a-290f-4e83-8caa-8dd0c9d97a35';  -- Video Editor (Post-Production)
update public.careers set source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/medical-records-and-health-information-technicians.htm' where id = 'd2bc8681-e8db-490f-8d0f-b7a02634e832';  -- Medical Records Specialist
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/emts-and-paramedics.htm' where id = 'd30517f2-fab0-45bb-9d6f-be2226bf891c';  -- Paramedic
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' where id = 'd97506d1-6942-4c1d-82b7-eb32e86d5b2a';  -- Laboratory Technologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1256.00' where id = 'd9d954bb-6216-4138-931c-67e4a126d85a';  -- Quality Assurance Tester (Software)
update public.careers set source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' where id = 'e0f19af4-5ab0-47d2-a715-5e758ae3909b';  -- Reporter (Specialized Beat)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' where id = 'e8f0552d-e07d-45fd-8fb5-5b6621e2eccb';  -- Orthopedic Surgeon
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/diagnostic-medical-sonographers-and-cardiovascular-technologists-and-technicians.htm' where id = 'ea047698-9ca8-4020-a7ea-a71f1b14333f';  -- Medical Sonographer
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/occupational-therapy-assistants-and-aides.htm' where id = 'ed4ef5d7-49f6-4396-9d38-7699dae98f71';  -- Occupational Therapy Assistant
update public.careers set source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' where id = 'ef440bc2-ec6a-46c9-881a-41979b4ec6d5';  -- Chemist (R&D)
update public.careers set source_url = 'https://www.bls.gov/ooh/healthcare-support/home-health-aides-and-personal-care-aides.htm' where id = 'f557259c-3dd3-471b-bfb3-aa07ef5bad3e';  -- Home Health Aide
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-2091.00' where id = 'f835712c-fb54-49f5-ac6b-591531cd71e8';  -- Court Reporter (CART)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3011.00' where id = 'fbc170df-5639-4952-8517-864823f5802e';  -- Athlete Agent

commit;
