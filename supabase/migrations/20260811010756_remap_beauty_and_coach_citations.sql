-- Re-map the beauty and coaching citation patterns (audit round 2).
--
-- BEAUTY (91 rows). Manicurists and Pedicurists held 93 careers of which
-- exactly one — "Nail Technician" — is nail work. It had become the default for
-- anything cosmetic: 40 wig and hair roles, 23 brow/lash/skin, 5 makeup artists,
-- 7 piercers and 15 personal stylists. Wig work goes to Hairdressers,
-- Hairstylists and Cosmetologists; brow, lash and microblading to Skincare
-- Specialists; makeup to Makeup Artists, Theatrical and Performance.
--
-- Piercers and personal stylists go to Personal Care and Service Workers, All
-- Other. O*NET genuinely has no occupation for either, and a truthful residual
-- beats a confident wrong answer — those rows lose their CareerOneStop link
-- (it has no page for All Other codes) and fall back to O*NET.
--
-- COACHING (35 rows, deliberately narrow). 219 careers named coach or
-- instructor cite something other than Coaches and Scouts, but most are fine:
-- 27 fitness roles correctly cite Exercise Trainers. Only clearly-wrong cases
-- are touched, and Coaches and Scouts is ATHLETIC, so it is used only for sport.
-- An acting coach goes to Self-Enrichment Teachers, a health coach to Health
-- Education Specialists. 238 rows were left alone as defensible or unclear —
-- sweeping them all into one code would repeat the mistake this pass exists to
-- fix.
--
-- Two of my own errors were caught while writing these rules. The first draft
-- routed every "absurd" coach into Coaches and Scouts, which would have filed an
-- acting coach as an athletic coach. The second used unanchored keywords, so
-- "St(art)up Pitch Coach" matched the "art" branch — the same substring
-- collision fixed earlier in the generator. Both corrected before applying.
--
-- Revert: reports/citation_remap2_revert.sql
-- Prior values: reports/citation_remap2_backup_before.csv

begin;

--   40 rows -> Hairdressers, Hairstylists, and Cosmetologists  (39-5012.00)
--      from: Manicurists and Pedicurists x40
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-5012.00'
where id in (
    '019ce137-ef4f-444c-a80e-d7b894b6eaac',
    '050fff3b-0795-4031-afee-95e5141b0a5b',
    '1371c03b-7729-49ef-903b-352cb6c9a6e9',
    '17a3b0a6-ff37-499f-8503-0b6e421894c1',
    '1952201a-54e5-4625-b3de-b173f473453f',
    '1f26e7fb-8d15-421d-b557-b4b398efafca',
    '2348c2f9-379b-4471-bd16-ba06c54a1b84',
    '261ac87d-74eb-49ec-947b-47e7956c80f4',
    '2ad02645-0935-4c76-a48d-84a9bf321171',
    '2bb9210a-9a3b-479d-9f4c-8592f1bd661a',
    '2be4b459-6bf9-4659-9a1b-f5afe6bc8ac3',
    '2faa94e6-d9a6-42c1-bc18-e36f1b926c8a',
    '412fc54a-9d79-4681-8721-47db747da8f4',
    '42177d69-fb96-4403-9716-c0a4569391db',
    '4a8ba467-3859-4a41-966a-3ee44255fcf1',
    '4ccb6044-bae9-47cc-90d1-3701455197e3',
    '4dff4604-3218-4fd8-8cd0-85ddb0c868ea',
    '4e44f767-b870-47b8-beca-17701e5dabb5',
    '4fa286a7-ac69-4f3b-8845-acb3c3f3e68f',
    '598a4f77-c8f6-4af3-acb9-30043ce762e7',
    '5cb16207-a351-48fa-bbad-86f0c97c318e',
    '629d3a13-1d1a-457b-9b27-c9485dc81a70',
    '65dd6f90-3337-4f0f-ad15-7ad371c341cc',
    '6f638846-d2d9-495f-8b4f-8ebc60e51426',
    '72061a2e-bf4c-4e05-85cb-9c942bc79789',
    '844aa3e6-2d3f-416b-8ba4-29c4ccc2d8bb',
    '86875572-554e-4703-908a-4297c5f9d027',
    '992c5aaa-7522-4ccb-981c-d541412a8abb',
    'a1699ef0-1688-4c11-96e6-e448a9952ae2',
    'a2a62e0b-9176-4a70-9665-70fe423b5fdf',
    'a34c76bb-c059-46f2-8570-962c16e2c983',
    'abd34aea-53a8-498a-8456-1e41df71fe6f',
    'ae5de036-b4cf-4260-8e33-6af104e82e96',
    'b35e9a15-0bb1-4a63-9fe2-cb36ab044b39',
    'b55c59a9-003e-4498-83ff-dd8d3eb06f42',
    'd49de42c-e5b5-48c5-80d2-ad18707d4ebd',
    'e01b2584-0134-463b-a1c3-b873076591ad',
    'e01ddca7-d74f-4153-b120-fa6424ca143d',
    'ed0c1c14-e039-4a25-ae6f-d61363c04866',
    'ed3b4dd7-fad7-4cde-a3ad-1cea19daf3fa'
  );

--   23 rows -> Skincare Specialists  (39-5094.00)
--      from: Manicurists and Pedicurists x23
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-5094.00'
where id in (
    '3bd37f34-0847-42e0-ad6a-90921e17c86c',
    '47e994e4-392d-4901-8550-1d1f1b120e41',
    '48906b38-0150-4e01-a2c1-0e200f452288',
    '4e6d3639-b127-406d-9bb6-718b300d0c73',
    '759a42b2-acd7-465a-a2fa-18a0619658a6',
    '7e6f56d9-a6b2-46ea-980a-0afe959d80ee',
    '86e057f2-1678-4e99-86de-ca48fdfd39de',
    '873a663e-510c-4e23-ac7d-6d1d815b4960',
    '87d4a39f-e60e-4eff-a24c-c7bb3a233dbc',
    '8a0dc902-a87b-4ced-bd4b-2a5acabf9b6e',
    '91492b53-a465-4948-b31a-f4845a2b2bc1',
    '91e1c288-d963-4cb5-8164-3c28f590b0e2',
    '92e6174e-42d1-4068-bbf8-dcd4fb148d9f',
    '94d24189-66bb-4789-955c-f34c5d83005b',
    'b12a23af-3b3c-4adb-a572-436f89e15e62',
    'b56cb860-b6ef-4497-af29-db043d6f72e8',
    'c26d1714-bb03-4ecb-8da8-94027312b1a7',
    'c37a755f-0f59-4bcb-9ed5-3fb043c88dc3',
    'c72e4ab1-5f4d-407e-bf1b-bab5aacc74a0',
    'c73980a6-3810-4426-be3f-e58ffdc63a92',
    'da0187bc-9219-40c9-8af2-474da03d0b8f',
    'da56616b-6220-47d7-848d-bcd0625811d9',
    'de66eead-230c-479a-be7f-28f3455a87b7'
  );

--   22 rows -> Personal Care and Service Workers, All Other  (39-9099.00)
--      from: Manicurists and Pedicurists x22
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-9099.00'
where id in (
    '0aec8bfe-c070-4005-acdd-f7340dcac998',
    '14d34357-f40b-4b89-a3be-5842f9a2221e',
    '1d2c7692-2aba-4258-baca-91f115ba5f5e',
    '3d53c0e7-8857-4838-a693-09b6baf2fe1f',
    '43cc97e6-e01b-4b86-99e9-eafd9049b17c',
    '48ec5742-5071-4297-bee8-1d0be01cabe8',
    '4d879e92-1a87-4572-9032-e18e1e511f21',
    '57d5eec4-8672-4ac4-abb5-b1c318c83bed',
    '62e57b3e-6ca0-4e2d-a089-d610bde3e87c',
    '65e04780-ceb0-47d2-a5fc-ea204ddc894d',
    '6e825811-88a8-44a6-9f09-5dd7406b4ac7',
    '79f21577-4536-408d-b538-b242bb4d7baa',
    '7f4551bd-51e9-452f-a1a3-d99971d0da28',
    '83258e50-1b2b-42fd-8b8d-aaf6c69ef967',
    '96dc6fd9-5d52-46b2-bd47-8d96b0d36a13',
    '992ad98f-4c7a-4efb-8276-83a099bcec20',
    '99f6248f-44c6-4a9f-a840-14e6e35e367e',
    'ac5285b1-cb23-48c1-8e20-f557f06e31ad',
    'bf2683bc-4082-45c4-a5e6-53cf8b9ebc59',
    'c2c0bf96-a54e-435f-a2e4-1162fd440a71',
    'cfeab702-eb1e-4bd6-9d22-a4379aeb320f',
    'eb26b7e9-2d65-485e-893c-ef78a39666c8'
  );

--   20 rows -> Coaches and Scouts  (27-2022.00)
--      from: Motion Picture Projectionists x7; Amusement and Recreation Attendants x5; Dietitians and Nutritionists x4
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00'
where id in (
    '01597a8b-260c-46a8-aae9-6d21afca76d4',
    '111c7add-e918-4633-b36b-be5fa92976cb',
    '1d9912e0-0f82-4eef-8207-38c226c37e41',
    '209e40a8-3611-48ca-bad8-e748356950de',
    '32a2c1e4-5fb4-4f64-afb2-d8f91dfaa5d1',
    '3316f8ff-0ea8-427e-902c-ae919580851b',
    '39322130-7f05-467e-bc69-53612fb9e5f1',
    '42befc96-dbef-4ff9-acca-d8ce428fa9bc',
    '47eafeda-b078-418c-8b89-6e770ac93a4b',
    '5247fc63-7626-44f4-8b97-67c678fcbf18',
    '5368cd7f-6c16-47a6-93b3-cd666e3da1af',
    '5ef31bd0-0a6f-4aa3-ac9b-ba79aa2a03c6',
    '6bdc0336-9aec-4c0a-91db-901e83e6f6a6',
    '6e1ae633-e049-4fa0-b30d-91c915a17de5',
    '8677e605-cebd-4aef-9378-5d07ae3914aa',
    '8c481190-6c08-4b0c-ad9c-c4f699960ab8',
    '9df64cd4-af04-48ab-bacd-38a980d957a2',
    'cd2b921e-85d8-4be1-ae23-c24dd2fdb95a',
    'd2b40242-074e-4c8a-a770-011abd3adb34',
    'f125a122-bcf2-49ff-b49f-8ab049e76154'
  );

--   13 rows -> Self-Enrichment Teachers  (25-3021.00)
--      from: Teachers and Instructors, All Other x6; Dancers x4; Actors x2
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3021.00'
where id in (
    'ec69e89e-d7a2-4d36-8bc9-1b4d14914842',
    '0c20c515-f7a4-4841-8a2b-27d39d5cf5b7',
    '13b5e7a8-290a-4f49-99e6-60b7b4730943',
    '2d2ddab8-a75e-4dc5-be21-53c8617d3339',
    '303801c1-3afb-4327-ae0c-ffed0a8d8f1c',
    '3a6c5f62-086a-41bc-beea-a6b0b30a06af',
    '41087069-e480-4dff-a6e7-e32a45a17cbb',
    '6597cfd9-cbe1-435e-b937-c45d0cc96409',
    '9a60b758-00a9-4577-8d86-0230d5bbc3ca',
    '9ffd689d-5ac6-4af9-b809-52c2a9d836e6',
    'a4f1c0ea-0397-48c8-8a9d-b67e6a78f0ac',
    'cfd30c42-de56-4c28-becb-aa2c54adac02',
    'e23a3122-9789-44cc-af17-c0727f8a5f29'
  );

--    5 rows -> Makeup Artists, Theatrical and Performance  (39-5091.00)
--      from: Manicurists and Pedicurists x5
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-5091.00'
where id in (
    '52891ccc-24d8-41a5-a7d1-b854525c14b6',
    '54159b88-fb2a-4eff-b569-0434fa68c85c',
    '56707dcf-8533-426e-8d88-3fb5408f9aa6',
    '77903b67-1c9e-4df0-af84-0f68cfb510cf',
    'be6b6353-c29f-4851-8174-b046f478c592'
  );

--    3 rows -> Health Education Specialists  (21-1091.00)
--      from: Speech-Language Pathologists x3
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1091.00'
where id in (
    '02777cec-3e4b-4e13-bda4-41abc9ed7589',
    '88192639-0b46-4a94-bc0b-abc625319107',
    'b2070f49-bc5f-41e4-8321-ce3d09c0db2b'
  );

commit;
