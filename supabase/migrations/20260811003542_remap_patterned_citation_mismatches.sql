-- Re-map the two patterned citation failures found by the accuracy spot-check.
--
-- The source gate proves a cited occupation exists; it cannot prove it is the
-- right one. A 50-row hand audit put the mismatch rate at 42%, and the failures
-- were patterned rather than random. This fixes the two largest patterns.
--
-- PATTERN 1 — catch-all executive codes (150 rows).
--   230 rows cited Chief Executives (11-1011.00) and 62 cited Chief
--   Sustainability Officers (11-1011.03), absorbing every founder, owner,
--   manager, coordinator, associate and consultant regardless of seniority or
--   field. 54 of the 62 sustainability rows never mentioned sustainability at
--   all. A Business Incubator ASSOCIATE and a Board Liaison both cited a chief
--   executive occupation.
--
--   Founders, owners and CEOs are LEFT on Chief Executives — that code is
--   correct for them, and 132 rows were verified as already right and untouched.
--   Everything else is mapped by role: nonprofit and board work to Social and
--   Community Service Managers, elected office to Legislators, advisory work to
--   Management Analysts, non-executive sustainability work to Sustainability
--   Specialists, and so on, with General and Operations Managers as the truthful
--   fallback for generic management.
--
-- PATTERN 2 — tutors (40 rows).
--   O*NET has a dedicated Tutors occupation (25-3041.00) and not one of the 40
--   careers named "*tutor*" cited it; they were filed as secondary school
--   teachers, postsecondary administrators and "Teachers, All Other", which
--   carry different credentials and pay.
--
--   Inspecting the 40 first mattered: 9 are not tutors. A Tutoring Center Owner,
--   three Tutor Coordinators and a Virtual Tutoring Platform Manager administer
--   tutoring rather than doing it, so they go to Instructional Coordinators,
--   Education Administrators and Chief Executives instead. Filing them under
--   Tutors would have swapped one mismatch for another.
--
-- Every target code was confirmed to exist in the O*NET taxonomy. 10 rows were
-- left alone as genuinely ambiguous (Venture Builder, White House Staffer,
-- Corporate Innovation Intrapreneur and similar), where Chief Executives is at
-- least plausible.
--
-- Revert: reports/citation_remap_revert.sql
-- Prior values: reports/citation_remap_backup_before.csv

begin;

--   58 rows -> General and Operations Managers  (11-1021.00)
--      from: 11-1011.00 x48, 11-1011.03 x10
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-1021.00'
where id in (
    '096f77f7-d755-434d-874c-75ed247a4e0e',
    '0afd2926-cf24-45d4-ab79-52e3a4e6fec1',
    '0d227d9e-9b8a-40f4-bf7d-61a3bed616f4',
    '0fd5b7c9-c53e-460f-8186-fbcac36f6ede',
    '1c70b047-8638-4e29-96eb-522795307597',
    '1dc62146-55ef-4a8b-9c45-87ba5594b65e',
    '1e78b99b-fa37-4558-91a4-a5c5f622b659',
    '2449d955-7e9b-41e7-a6c8-b171f1fae8fe',
    '284f7c3f-cc74-4fb2-a6ac-6c6dad0ba0a9',
    '2902868c-0c58-4fea-afd1-70b0a82053aa',
    '29f5433e-8822-4602-82c3-fd1ed81db80d',
    '2be97eed-459e-4d62-ac87-123c8b3aa029',
    '303795f8-d7b2-475e-9410-a72a3b5046e6',
    '3313a855-b5a8-4856-929b-01851a189cae',
    '340cb3cf-627f-41b0-ba47-eaf667d3e87c',
    '364ed3d3-e7b1-4eda-939d-ca57663a7775',
    '384ca429-ff8e-4203-a1e2-02b5d0f245e7',
    '3eb1b7e5-f90a-4b3c-98ea-868be16c7f39',
    '3f8ba2e0-a386-4cde-988f-2ea997d7bb68',
    '453d41ab-bca3-4bd7-8778-c2372eb67a6e',
    '4d12c2db-162d-4957-b90d-16c480886708',
    '4d7ea0c2-a035-436a-9335-9ca3e1855951',
    '575b2cd2-f1ec-4a97-9806-f3347b18bd47',
    '5784f212-adbf-492d-a209-ace55b4b70b9',
    '5e57239a-d8b6-42c0-a094-aba5b3160bdc',
    '640b5f96-2a67-48c0-9972-cc036e993ed4',
    '663d2004-3b39-4eb0-941e-1eb641858596',
    '694859d9-e9f4-470c-874d-6899034ded6a',
    '6f7e45d8-c413-498e-959e-8d4c4fd6dc29',
    '6fb9fbd4-d282-4845-a32e-ac8c0b7232f5',
    '7022059e-3a94-4057-966b-e5a8652ba3f6',
    '74c6209e-f37d-4824-970d-f5641c687976',
    '7515fac5-2780-426e-b8fe-76d907d89a38',
    '75a8bb65-20de-411f-b872-7fe48abf8870',
    '7a503905-266f-4da0-b9d4-203f2f5a784f',
    '7df1ed22-7908-4d7c-bf48-7b0a1481b9b3',
    '82d90c12-a04d-43b0-9f5a-26e425214eaa',
    '83f12676-a4b4-45ad-a459-0abbb6d593fa',
    '8852e0dd-7801-4648-9262-970c4694869f',
    '88adc74c-9c76-4b93-9b86-30f90ca16a09',
    '90326da8-0159-45ce-a8ed-6ff5751a9d7a',
    'a30b4653-6c9c-47fc-a49d-f8af5751919e',
    'acb569ce-4549-45bf-95c0-00d18b7c1b9c',
    'adce3bfc-adb9-406e-9456-bc3ae7f9ce0b',
    'b0b9b61a-d86b-4889-8b2b-e64c4f286c86',
    'ba59b45f-a3d8-40ee-8e4e-64dce5ec6a11',
    'ba651d26-d91f-4a21-937e-f77e62ae720c',
    'bbe1e016-3de8-4221-acd1-9aa3ee3892cc',
    'bcc039a8-df07-409c-a55b-52de38258b7c',
    'cb1cb345-3a2f-4357-9835-252b196419a8',
    'd3fdfb33-2a24-44cf-9729-f02cb960c871',
    'd8f4f72b-870d-44a4-8c25-853942db1f2a',
    'e0795c5d-d390-4161-b26f-e427e8dacfb2',
    'e3c49bea-4c36-4b0e-ad3e-46fd4183b301',
    'e505baa9-22e6-4744-a82c-675b9febf708',
    'e6814a76-9bdb-4cc5-ac1b-14af940f80ea',
    'eaa21c2e-8c45-447d-a9c9-bc60cddd2c0d',
    'fae5cea3-2970-4c86-9429-f680d144b6d3'
  );

--   31 rows -> Tutors  (25-3041.00)
--      from: 25-3099.00 x9, 25-3098.00 x7, 25-2031.00 x3, 25-3097.00 x3, 25-3011.00 x3, 25-1081.00 x2, 25-3098.03 x1, 25-1194.00 x1, 25-2059.00 x1, 25-3099.01 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3041.00'
where id in (
    '0214a679-0822-44bc-b511-1ea770f43438',
    '02549d8a-8676-485d-9451-2279ed3e87f9',
    '11fff269-d431-4966-b1fa-5aeeefeb9658',
    '17835c63-7250-4891-8f10-1e2b88a55e17',
    '1c642aa9-3b10-445d-9057-0c787c3606a8',
    '1f4e0033-67da-4726-be24-1f7b02bb903c',
    '226754bd-e0b8-4d9d-851e-7d289645d503',
    '3ad406f8-5e48-43d9-bb9f-b8287e011dfb',
    '4697a5bf-8222-4b99-b31d-cd12c55db4ba',
    '4f3e2b3d-f659-41f7-9796-d50d8880abc0',
    '4f85ec9e-a855-43ad-9043-216788d8123e',
    '58fb1118-e003-4667-8f32-acf69f4b41a3',
    '5b2bd2d7-cbaf-4498-ae03-5ce116598cb7',
    '62c99a75-eae6-4510-87b7-c6bd7491bcf4',
    '72b729ac-8dae-4362-b686-d179080be3e9',
    '85b38141-8e10-4a58-9b8a-16e1080577a2',
    '8637e3b7-277c-4d04-8ec4-f673918be2d5',
    '88646cc3-5ebe-434a-8c2c-ceee645a7fbf',
    '9198d822-115a-4880-94cf-287c549314f6',
    '94f88cc4-a0bd-4dc6-aa29-50854a3a29fa',
    '9d4fbaf0-6940-4d4f-8bfc-a2824269308e',
    '9d874fb5-5c32-47bb-b5fb-f2b7d53e3c19',
    'bacf8f18-989a-43f8-ad32-b308a865bc1f',
    'c2a15922-dd82-47d7-a430-144a6ec0fc9f',
    'cc059a3f-cc90-481a-9aa0-c50d27e7ca1e',
    'd3aeb411-29c0-47f2-9758-9f95f2d21307',
    'da26c81f-ab49-482b-9a3d-1eeed5eeb375',
    'dd794fb6-eb96-4d58-8c3b-4d1c3fea2164',
    'e78b19f4-459b-4942-9d39-cb1fe365f0ec',
    'eb8afa4a-1290-4a54-a26e-421b383207c1',
    'ff45ae8d-f3aa-49a0-ac06-a20e3a471ad7'
  );

--   18 rows -> Management Analysts  (13-1111.00)
--      from: 11-1011.00 x12, 11-1011.03 x6
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1111.00'
where id in (
    '1f59c7cc-9d03-4e95-94d2-d4eb0bc8df8c',
    '316cd183-57c3-41be-a748-23b98b6e2286',
    '3f07096f-6ed9-4e17-bad7-8750a6028296',
    '5135bd22-64a5-4b71-87d8-1cb1da10dd3d',
    '67958779-91d6-4c60-99a9-379ad4f48ff1',
    '698345d7-f39d-4811-a6b9-0edb43e1a375',
    '6a8fe5b9-ba4d-4f61-a989-3e5077f2b4cf',
    '7a854166-0d23-4a50-9e53-0bbe01ff79d0',
    '7ea0966f-0543-433c-b662-a59a134e17ea',
    '850f4335-8c5a-4a93-a42a-c805be39fb68',
    '88056f02-c033-40b3-94d0-a0f0197cc4ac',
    '8949adfc-5ed8-4049-94f4-8d3600d78206',
    'a87d3913-a934-46b3-9a10-e06494900a06',
    'ab488458-0ed7-4d79-a616-ff9bcd6b8b18',
    'b51d6a67-4962-4723-876e-c28f564afee3',
    'b77aba67-f44a-4317-9cae-7b347c694643',
    'd96c08a2-8a91-433d-834d-a149bd0376de',
    'f4f80ea7-1cbd-420e-bf66-b44c2745fccc'
  );

--   17 rows -> Chief Executives  (11-1011.00)
--      from: 11-1011.03 x16, 11-9033.00 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-1011.00'
where id in (
    '008b8d6a-1a1a-496f-8845-be82b51d4a1a',
    '04ccb968-39d4-4268-99fe-5d0095518090',
    '18a30072-18d6-4c12-912c-1b8f8c1e2583',
    '1f8640d6-e4b0-4a33-aa69-33cff405dd1a',
    '2e08ea9e-9fbb-4c86-8535-d8b4e62aeb97',
    '2fc73e5c-35f9-4eb7-ba73-62c11fa9b4ca',
    '45474090-160c-48a4-baa1-3799cef4bf48',
    '6373bc66-8451-4f62-b1a1-561ac04c905a',
    '723251cc-c99b-40ad-b55b-8388ca949cef',
    '7e6b1bf5-e3a3-4d30-a817-082ce24ba8f0',
    '8a858cfc-8178-4671-96f0-9fb7286a2664',
    '8cc5d075-6670-43a7-b8ef-bd85bab624b7',
    '8f594a32-c06c-457e-a264-bdf02e3dd0bc',
    'add276a1-3c6d-4e4a-bfac-950f885aff20',
    'c14de034-467e-48dc-b99c-300f617b1292',
    'd9bf3892-c511-4724-84e8-1efea599f535',
    '212143b3-0077-4c2c-a42b-8aa5c432618c'
  );

--   17 rows -> Social and Community Service Managers  (11-9151.00)
--      from: 11-1011.00 x9, 11-1011.03 x8
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9151.00'
where id in (
    '0a28107e-ad56-4090-a44f-f34a85f78a58',
    '1af77015-cdfc-42c7-93ac-fc3ec20e592d',
    '281d73ad-a0ea-4df9-b154-3b180cb85ff1',
    '2a864eca-5a39-48a1-8a67-52e145fc692e',
    '2be7f121-c4b2-4a16-9f97-ec984f93a307',
    '4a9783bd-05d5-4d65-8f13-5a9019e55422',
    '4de3c291-23af-451e-b26e-33e0e85bd53b',
    '4e725b62-cd00-4609-942f-cc2d60cdc94c',
    '705f9cdd-5529-4d75-bc19-8a9f04460898',
    '84121a8b-0b0b-4876-8d10-a480b042b8a7',
    '951525b2-8552-43fe-9cdc-68b8fc29af9f',
    'a333eff6-ea1d-4764-948c-b9b28da93d6a',
    'c4161d75-6df9-4b15-b45a-4e6427851542',
    'd2792429-2c4d-4239-b447-c941beec643d',
    'd99c8f5e-8dd4-4633-88fb-46921f91038d',
    'e688ed14-282d-4e52-8185-1ebee0fd10cd',
    'e9bb9b85-87cd-4706-b46a-7a9281a2353e'
  );

--   12 rows -> Sustainability Specialists  (13-1199.05)
--      from: 11-1011.00 x10, 11-1011.03 x2
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1199.05'
where id in (
    '03db3738-9574-4c4b-ac62-c0e17bbefffe',
    '09f444b7-806b-4aec-b47b-9bfbdbfc13c6',
    '27550afd-1f0d-4c67-91e8-da5034a9ad76',
    '400bc728-5c94-42f7-9c80-fed069583bd2',
    '41dbda47-282b-4e31-8465-61a1a6217642',
    '50751ffd-7346-4e32-9197-32799673ea47',
    '5b6e3b5e-3f1d-4295-b387-8cfb7ff9b48d',
    'a8482bd9-aefc-4e9e-b461-c2b36cc896ea',
    'aa2416f9-12d9-445d-a3ce-ff87a7e3fac1',
    'acd921ef-5e33-4b7f-83c7-a0291d836946',
    'ad87f6a3-e51f-4d48-b751-c335fff9f8e6',
    'b6f60fa6-28ce-4031-9ff0-506d8c5ae668'
  );

--    9 rows -> Public Relations Managers  (11-2032.00)
--      from: 11-1011.00 x6, 11-1011.03 x3
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2032.00'
where id in (
    '37f5392c-0930-4c83-92db-99d22bf65291',
    '3e935770-d4a1-44f6-b75e-15128efdd551',
    '6af70cfc-bbd5-41ec-88e9-107868c4c4ce',
    '6cca7afd-9d8e-4667-8714-d40902a08448',
    '7b7791fb-f2ce-459a-a9bd-3bc4cd4432a0',
    '7e65afb4-89c6-4998-ac88-40f2ba41a327',
    'a71e253d-5afd-472a-9474-bc85cbf788f1',
    'c9cb1265-3b29-4cdf-839f-66f8b203d232',
    'db0928e7-b10f-4050-964a-6ee35a50abe1'
  );

--    7 rows -> Legislators  (11-1031.00)
--      from: 11-1011.00 x5, 11-1011.03 x2
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-1031.00'
where id in (
    '234e11bc-f832-497b-a56e-dbe046488845',
    '3bab044b-82b0-44c3-8528-f01f7596702c',
    '55ab5918-7d08-4b85-98a5-3d07c25f75ea',
    '621c9c53-6cca-4b06-99a7-8096898ce30d',
    '6a405340-e5e5-4ee3-b204-1e61371d2a6a',
    'a67abc6d-c1b7-4172-b90b-c4394675b5d3',
    'dcbea90b-03dd-45f1-b293-49e61f280bc5'
  );

--    5 rows -> Instructional Coordinators  (25-9031.00)
--      from: 25-9041.00 x2, 13-1081.02 x1, 11-9033.00 x1, 13-1051.00 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9031.00'
where id in (
    '03f47792-8b6a-46c4-9ff0-415e183f8407',
    '1a1dbcfc-1349-472b-8aba-451cb329dae1',
    '3f3bdb47-445d-4cf3-87dd-fefba5029bcd',
    '3f4ca6ce-3eb9-46d1-8d66-3a2047cbcfe5',
    'e623e667-ffe5-4c9a-b2de-414bc893fff6'
  );

--    3 rows -> Agents and Business Managers of Artists, Performers, and Athletes  (13-1011.00)
--      from: 11-1011.03 x2, 11-1011.00 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1011.00'
where id in (
    '1a9a4ecc-342e-47e7-ab4d-eb37119da7be',
    '654e8082-a029-430b-9ef6-f4fed88e8c32',
    '6cbc21ee-2d60-4c0b-b4bc-5c87fa84e60e'
  );

--    3 rows -> Financial Managers  (11-3031.00)
--      from: 11-1011.03 x3
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3031.00'
where id in (
    '571c284e-f931-4f82-8eaf-3192e13fbad5',
    '5dc85d85-dee8-4af3-b71e-0bf4faec337b',
    '617715aa-ddb5-4815-b5ad-04f8d6fcbbed'
  );

--    3 rows -> Education Administrators, All Other  (11-9039.00)
--      from: 25-9031.00 x2, 11-9033.00 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9039.00'
where id in (
    '30a94fcb-3914-4530-b9ea-25fe997015bd',
    '3b050c58-c6bf-4746-9122-276a9832acea',
    '413c174d-c05c-4b4c-8b9d-cb5a30bbfc00'
  );

--    2 rows -> Marketing Managers  (11-2021.00)
--      from: 11-1011.03 x1, 11-1011.00 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2021.00'
where id in (
    'bfe5896d-2724-4a90-adbb-1d6fe444b386',
    'e1ed391e-65d3-4cda-8f43-15012b0d30e9'
  );

--    2 rows -> Compliance Officers  (13-1041.00)
--      from: 11-1011.00 x1, 11-1011.03 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1041.00'
where id in (
    'd72750e6-076a-4682-ba45-a17e1ff0d023',
    'e3936ab6-00e9-4c38-ac96-a3a4a0109d51'
  );

--    1 rows -> Human Resources Managers  (11-3121.00)
--      from: 11-1011.03 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3121.00'
where id in (
    '682312c1-5d87-4da5-897d-f638bcb85214'
  );

--    1 rows -> Information Security Analysts  (15-1212.00)
--      from: 11-1011.03 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1212.00'
where id in (
    '8e7288f7-0970-44a2-ae0b-b4ab24f620aa'
  );

--    1 rows -> Lodging Managers  (11-9081.00)
--      from: 11-1011.03 x1
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9081.00'
where id in (
    'a6d66213-a005-411c-9418-fde2af5a7b65'
  );

commit;
