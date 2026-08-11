-- Backfill citations for careers that cited bls.gov.
--
-- 1081 rows carried a bls.gov Occupational Outlook Handbook URL that pointed at
-- a real page, but bls.gov cannot be validated from CI at all (403 to plain curl,
-- browser-UA curl, full browser headers and WebFetch alike). Once the app began
-- gating citations on a checkable O*NET SOC code, these rows showed no source
-- despite having had a good one.
--
-- Each row's BLS occupation slug was mapped to the equivalent O*NET-SOC code and
-- the URL rebuilt the same way the write-time gate now does. Only 167 distinct
-- occupations were involved, so this is 167 mappings rather than 1081 guesses.
--
-- 909 rows mapped automatically by title match against the O*NET taxonomy.
-- 172 rows use a hand-verified code, because the automatic match was wrong or
-- BLS and O*NET use different names for the occupation. Examples corrected by
-- hand: high-school-teachers matched "Special Education Teachers" (now
-- 25-2031.00 Secondary School Teachers); police-and-detectives matched a
-- supervisor occupation (now 33-3051.00 Police and Sheriff's Patrol Officers);
-- teacher-assistants matched "Postsecondary Teachers, All Other" (now
-- 25-9049.00). reporters-correspondents-and-broadcast-news-analysts and
-- top-executives scored low but were verified correct — O*NET simply renamed
-- them.
--
-- Every code below was checked to exist in the O*NET taxonomy before writing.
-- 1039 will cite CareerOneStop; the rest are "All Other" residual categories
-- CareerOneStop has no page for, so they fall back to O*NET.
--
-- Revert: reports/backfill_bls_revert.sql   Prior values: reports/backfill_bls_backup_before.csv

begin;

--  140 rows -> Lawyers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-1011.00'
where id in (
    '00def351-0e8f-406d-af66-42050345c764',
    '03b58e2c-7e89-4860-93a3-17a3d818aa56',
    '03fc9c76-f144-4284-aa8b-bb14f270cc7f',
    '043aabc3-d60c-4ab3-bad1-da2222b34fa1',
    '04965e20-a499-44cd-9b9c-7103dd8544e3',
    '0a9cce28-6f5d-4ada-85b6-21eb7e86dd96',
    '0d39586a-311b-4054-b107-6c6e9371d6d4',
    '0ddc9066-979c-4fa7-84e7-220ce828da3f',
    '0e7002fa-b9ef-45ac-b204-ee738e9ca537',
    '0fe9c922-6a0e-4cb8-81d5-edb45dd18b13',
    '133a7fb1-24d5-41b1-bc3a-173217ff22a2',
    '176faa89-171e-4657-a319-c520d0b3a320',
    '1a5eb0d0-855f-4c7a-8211-9ae6393eb45a',
    '1bc77b02-628c-4652-87db-95af96ad3636',
    '1d3cf0cb-d2ee-48e8-a84c-1dadf698ef98',
    '1d3fb744-9d9b-4a26-a1e3-b2a22e090bcf',
    '1ebd4a35-c3c8-444c-a8fb-a2b05b368187',
    '2110ac6d-684a-46af-bae2-6e207a8183cd',
    '252f0f21-671e-4dff-b7f6-750b6bacaaec',
    '260a8a44-daf0-4f20-99df-89b1ab97c6bf',
    '26cc0dbe-0ed4-4967-b004-91ba570683cb',
    '2733a505-97c0-4e85-b7dd-37787e7118c5',
    '27869400-5fec-4a1d-a15c-9f767ae7421c',
    '27b21e74-e292-41a1-8091-6d5d40f2eac4',
    '28a52831-1d2e-4d75-afad-e673b3665057',
    '28be90fb-616a-4a0c-82f8-b71287440eb6',
    '2c24e443-00bd-4e05-9e61-224d59f26e4e',
    '33639ecc-08b5-4f89-b138-eafe9edc1e45',
    '3383983f-241c-4a36-9cd8-2b5ac20c8098',
    '3b16edbe-8ae8-492c-97c3-ba3988c39cb0',
    '3d90420d-73a4-419f-b2e5-726e1922e1f1',
    '3de0d536-0038-4ca4-a4cf-52589c4ad379',
    '3fc59dd0-0573-4367-adcd-b70ae63701ea',
    '4280a22e-36bf-4310-9f68-3ed7715eba4d',
    '42ce14aa-02d8-4cae-9e06-aa70b9561015',
    '44632abe-cab1-45e2-82e2-abb637cf2539',
    '4651a610-6172-4abc-b754-1271f1f8b2ca',
    '4854c42c-d806-45a6-ae33-4a212cf1f4c5',
    '4dcc5782-2bec-4b79-8e9a-30ee7013049c',
    '52d4acde-b5ff-4c26-aec8-72579103e4bc',
    '53f518a7-c5d6-4f91-a463-dd6446cd4ef3',
    '53f96cab-c978-4010-845b-68ff7e97123d',
    '55d4beeb-3598-4268-b9ed-dc8484dd51fa',
    '56c1fd27-8750-4e03-9467-2ac1ed3059d7',
    '584d1946-a2b1-4819-883d-a351ae7960a9',
    '595b05c1-ae0d-4a9f-a2cb-3f10385ca951',
    '59ad115e-5b1c-4ed0-8578-7f90d39a37a4',
    '5c25906c-7da7-4f95-9ebc-e8c39d4ab1ef',
    '5c53126f-eb98-4104-b994-555d75e255ff',
    '5e249e0d-82fa-4893-ac21-092e4a29c823',
    '649e02fa-d9cc-4a3e-977b-3205746356c0',
    '661a2ad3-a7d0-42bf-b91f-ddba26b49c1c',
    '67039974-be72-4568-bbef-b2e8e55366fc',
    '69664e1a-c9ee-4624-8d01-c7553efa1dc6',
    '6acecdb4-61a5-4904-a7d2-04fd39b67e2f',
    '6b90ba7b-bdd1-4f13-97e6-bb1fe3b9bdc4',
    '6eec7056-b782-4edc-8412-bf3cc7e384ed',
    '70c7201a-6565-4a4d-b8b6-b8ead62c02f1',
    '7279b085-bfd7-4f15-8991-849fea62d065',
    '73fc569a-46fa-4e75-8a4e-c49c784f71d0',
    '76d3193a-f2f8-40c1-bcbd-32c89d19b1cf',
    '7723d35c-4390-41cf-8500-bd8354a5e420',
    '7a0c4821-4412-4af5-b5d7-fd1a00bbbc52',
    '7b5aacd2-670b-43e4-9ad9-fe4b6fb3ecd9',
    '7ba91552-ef6e-4527-a38f-c0dd6a15efeb',
    '7fcfba4e-86e9-48cb-8788-a851793a9c42',
    '8087933f-c0dc-4ac6-81c1-34b588412518',
    '84641b3b-6651-44d3-8444-dc09bb5964df',
    '84cbf27a-06c2-4eff-b003-bbe1df424bac',
    '87acb053-b962-4d3f-9cc9-7c2f9a1ea38e',
    '87e34cc0-8009-47cb-95a1-039dd84ce609',
    '889563cf-8365-44f4-bc1c-c84e6a4b91d8',
    '8bcd1ff9-7f37-42e2-96d1-b331074d9c72',
    '90fe7050-c855-46cf-b676-bedfbcde88f3',
    '91922163-6dd1-4ed9-92cd-3195f3a010bc',
    '94f56993-2af9-4f5e-91f9-087f27b1542f',
    '99a65443-bbb3-4bdd-b5e5-34163146d260',
    '99cd2c5d-a4df-4df4-813c-7a4e271879da',
    '9ab795f8-1f64-4273-ae6f-53699f6178db',
    '9b6567d7-ec25-490b-8ad1-9550262071bc',
    '9be87d2e-7ce1-4f03-a50e-61417ca5507c',
    '9d885ed9-45d1-4784-8747-3d3ef70122c1',
    '9de82fff-8387-4e52-8c06-0be3b8becced',
    '9f740b13-c56b-4bf9-a68d-e56d0b199291',
    'a471a4b5-a097-43ed-a933-b032e6365a04',
    'a4c0c1f5-3fbf-4008-b568-2006cf9722c5',
    'a6b85c22-0551-4ce1-9762-4b64fe821c1b',
    'a89394ca-5902-4cba-a45f-c6d31ed42dc3',
    'aae8a4fa-b140-49ce-aeaa-0a4ffe7bc08c',
    'accb6213-4d61-4b20-99c1-ac234b21016d',
    'acd53164-80d6-42f1-8878-2846dc758da2',
    'ae3fefd4-9889-4632-b0dc-09733ddd81e9',
    'b47fb459-875c-4dab-b717-96598ca3ca9c',
    'b69cba49-b0d2-4751-b92c-b912c57c232c',
    'b912fc5d-7085-43c7-97d2-d84de58eb0a8',
    'b95bd204-7cb6-4281-97bb-7a5a077aa498',
    'bc2edeb3-0a52-46a7-8fe9-52ece8003ad4',
    'bcf1129e-1a52-4cf2-aad1-4346dc57f5a3',
    'be69a788-b3a4-4301-a436-9d188fe03bbd',
    'bed6c1af-5d4f-41ab-b955-bfcb39c9d05d',
    'c2390fb8-4c7c-4e5e-ab3b-f784fd7f2a09',
    'c24c2834-e216-4cd4-839b-36462d124a9e',
    'c7ceb9db-e63c-48ee-bea8-3256f37810ad',
    'c834dcc2-c365-4229-990b-188fc7392133',
    'cb96d20d-4ff8-4826-b3b6-223171d211c3',
    'cc28d9b1-855e-4208-9f23-9ce2fd13215e',
    'cf4a77bc-cc41-4cf4-9964-b091cd857fff',
    'd0bafaa2-ffbf-4ba6-9da3-c05a7ccc38f4',
    'd54da44c-8e89-4517-bc67-3288bb85a308',
    'd6a28f12-236c-4034-b25e-025ad2858049',
    'd70d16c6-eddf-4fc8-8415-a9fe39673766',
    'dda21f6b-a2d7-4d39-87f9-a5e6a2b72929',
    'de055334-8bd3-45c2-b458-76bdb3ba71d5',
    'de3408d2-fac6-4b8f-bdac-ea91e783d878',
    'de6b216a-5e82-44c5-9e09-9c1ae4284933',
    'deb63f7b-5767-4923-95a9-706196c321ae',
    'dfe3cbf6-cb27-47ab-8366-f76a4ed7137b',
    'e00d19ab-35f8-42cf-bc96-55cdfb46dbf7',
    'e050b3c5-740f-4be2-ac75-06667523d9e3',
    'e37c4147-4632-4b9d-b54e-697c3c22030c',
    'e41b629e-b80c-4bcb-a1d9-2f06cc950b58',
    'e5098e13-28ed-4a64-91e6-55ef18e7147f',
    'e800d86b-604a-4a03-a053-27b785523778',
    'ea81ad8f-c984-4354-a293-7e8ae9737039',
    'ec5f3bf8-1c80-41ac-b8de-714d635b9d05',
    'eedd72c1-4a8d-4fce-90b5-a1574fcc0535',
    'ef3a6ff5-88ca-452f-8abb-f13bc76bd8ac',
    'efd65312-1ce9-4102-8631-ca104dbb3b09',
    'f01ec1e8-6967-4498-aac3-217655364fcd',
    'f2c0e75e-e5d8-41e7-8aef-8ba9e4fa093e',
    'f3cca934-9834-47b5-81f4-f393a9c32cf2',
    'f50858a3-01ea-4706-95e7-513e63772d85',
    'f64dbd2b-3794-49ab-aa12-6ae09528711d',
    'f696694e-03a6-44df-ae88-02a2880d764c',
    'f6bff285-0b20-4810-9744-42ff95b8970e',
    'f73ae9d1-d879-454d-ba23-4ebe5e625d5b',
    'f998c3f5-3466-4fbd-a77f-cd4009692586',
    'faa40dee-fb63-491e-a1a1-1ede86d7fac4',
    'fecf3415-a09b-459c-b7c3-1974a3d1801d',
    'feeb2a2b-c2d7-40ff-a517-dd2edc1871b5'
  );

--   64 rows -> News Analysts, Reporters, and Journalists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where id in (
    '009d9f85-84b9-4386-be96-c19106168abd',
    '03a7fb8f-a21a-4a4e-bfe3-4bb4cb7fdd49',
    '0534148f-e8f3-46c7-afc2-72c3443ac4fd',
    '07678c84-019f-41c1-94da-8d31611beedf',
    '089946f2-1cb8-460a-a01a-4e0c64b1e8e0',
    '09bcf50c-9366-4628-82db-8023d2f66f6f',
    '0a114023-56db-4151-adf6-c895cb603995',
    '0d48d8e0-65c2-4d97-8718-f8f5cd47f761',
    '147e7358-d162-4c0c-ae72-e942d62684eb',
    '1787dd22-62af-4f10-b43d-4dd6be9c0b69',
    '185d0df4-690d-4714-ab75-fbd2931ea2e4',
    '1b4dad65-5095-48eb-8e0b-5738ebb999c5',
    '1bcf8f14-0e12-4cac-825f-4eee7a6546e2',
    '1fceaed4-8089-442b-b7f6-f8bf4b884cd0',
    '21251f70-5103-4b0c-b4e0-dc411921f4d4',
    '236c95cb-4cc7-42e3-801a-318877b67faf',
    '2772378a-e15a-43dd-92c0-6ec3858d16e6',
    '2a98cf37-9d56-481e-b606-76e04931f671',
    '2e765de8-4dd7-4300-bcc1-cbf429e2a8b9',
    '311555bf-c93c-44f2-9e8e-b3e5e11fba9e',
    '34d7cb46-99a5-4585-89a9-1454c71d707f',
    '3a02a819-5c3d-4163-97b0-d909d2731a00',
    '409dd5cd-08f3-4227-acf8-ba86c62b1a5b',
    '46347e51-516a-4be6-adb5-2d1e79996bfb',
    '47f9cfe6-6932-474f-a8e6-037bde005e9c',
    '483af109-1637-429e-9900-2785731a9737',
    '487ef452-1067-4746-9b3b-ebc90613c59c',
    '4a753f10-4be1-4758-a2ac-b6335914b56b',
    '4dd2b167-7b1e-4c89-9266-7a27430471c5',
    '4e8d7c15-3caf-4af5-b8f6-96bfc9cd6235',
    '543cb431-c426-4f0c-96eb-f1ee8496a771',
    '62254b50-96be-422d-814b-004c1e9fff47',
    '628b37ee-d5ee-40ed-bda1-bc7a931cab17',
    '64d89d52-941c-44a9-b64a-fe53e99dcf8f',
    '659867c8-c08f-4b17-a66a-e1d904b34a75',
    '68dc2d2a-6f9e-4562-9657-ee648ae4c0cf',
    '7035d63d-fa55-4059-b482-29f447b196ea',
    '71b1bdd3-7bda-46ff-a632-51002f74b82b',
    '73b3dfc4-f352-4683-a9ca-3f1180797213',
    '74bdc737-4b08-43c7-be34-65063656d9fd',
    '766dd32c-400a-4275-845e-b7b7b6659118',
    '79434b70-e940-4b1e-98a2-6feaa7fefefa',
    '7a5a69eb-e1ee-439c-af9b-c975f4cfdee2',
    '7ca9f898-7f1f-47b1-a277-6533e2af5e86',
    '7cff4363-1650-4ca0-a043-5025491710c9',
    '7f5965ea-fe07-48ee-bb74-2cbe41fbab03',
    '80498cf7-5443-4ad7-9ffb-2acbb06cdd42',
    '83f83f6b-1ecf-4d4f-934f-ab5a820e7624',
    '896fc085-b821-4dc6-a8ea-7355b404f3b5',
    '9d1dd821-cffc-4f3f-97a9-0cd3c182d96d',
    '9ea2e59b-601c-4e09-b454-cb8a8d43161f',
    'a2674345-7339-46b8-a901-8e7b42663fda',
    'afe345fd-fd54-4fae-9364-47f229e53a8c',
    'c0c15d09-5c58-4d75-9892-6e68259fdc94',
    'cd21f272-2e50-4511-a17b-be2ce74d7bd1',
    'cfda151e-7289-4541-b272-398000bb8644',
    'd05b9370-6cf3-4e8d-8065-29c195aa7093',
    'd24f47b1-a1a5-43e0-ab4e-53dd38d29117',
    'd2f760e5-6be7-4781-8146-ff1020d13fe6',
    'd305242b-af93-4c21-b44c-a8176d1d0f06',
    'e5896b31-859f-462d-811c-bb9390b933a7',
    'efe97572-5e34-4e60-8ce3-b2bbf04e19f0',
    'f8d63ffd-3b97-45ff-b1f1-1dbe1baafaea',
    'fc039843-5cb4-4d7c-ae36-4bed755e4d02'
  );

--   49 rows -> Chief Executives
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-1011.00'
where id in (
    '04dfa51a-ad8a-4ff5-8851-53221798c335',
    '05d000ea-6f11-4b0c-ab8e-20ce49045390',
    '0e28f936-5467-4feb-9861-40594edf0abf',
    '13134fa7-2fb5-4ced-9243-c4925c0b90a0',
    '139efc5b-1afd-45c0-8f8c-597e891cbbf6',
    '13b60b43-a2ff-44a9-9b20-cfb804e35fa1',
    '19b6beff-af08-453c-b2d6-65c041f50a7d',
    '21c02058-153a-4cb0-b9a6-5c1db9390900',
    '2204a74d-38dd-439c-9af5-6b27ae343a3c',
    '24a04d66-1dfa-43a3-8456-76affc5652b5',
    '2854b5bc-089c-4baf-aa9d-234ee7272306',
    '2d8b1743-c1fb-48d7-9198-fbda7ac26c2b',
    '3749e336-61ce-457b-a880-c4dc545b01b9',
    '3a87a4a6-362b-4f10-97b0-c6ab664cf944',
    '3e6ddf24-6cf0-463e-9907-a0397643394a',
    '413fe077-0b84-4fc9-ba68-ad431e00cb64',
    '4490d5f7-c027-470c-9374-ecce9ec3f96d',
    '4b215253-1b87-4d30-ac5d-23113202e0ee',
    '4bca9a6e-1a5d-4713-97e2-894ffceca555',
    '4cb61c5f-b423-41b3-93b2-0580f4a774d6',
    '4f177ef4-d436-4ca5-b944-ad6aa65733c1',
    '5c25f5be-6705-4e76-b5b9-5a673561b87f',
    '7f8e819b-e3ee-42c7-9a5f-20bf190184d4',
    '81ef9e49-7f28-4ad9-9c10-e06b7e5bd2b3',
    '821e5875-0b90-462e-9136-03c2a3c0b179',
    '83f12676-a4b4-45ad-a459-0abbb6d593fa',
    '8b380c8b-4085-487f-b2ec-8b2b6dde3369',
    '8c2f1120-54d7-4114-ad4c-6e0027e2749a',
    '90591b88-a9b5-4f6a-adb8-26f61ef861fb',
    '97e2c721-d6c8-4627-b36e-2dc052be8a2c',
    '9c6407a9-e1f0-4b74-b9d8-332d13e9d790',
    'b1d0042b-7543-46a8-bf3b-27ccaeb1a12a',
    'b56872e4-3cb6-4cfd-be36-4f73f2eaf453',
    'c38c4ec2-9969-4cb2-ad86-22cbdc57a2e9',
    'c62d5bd2-2501-40ad-8e2e-1c6dff7a679b',
    'cabc1e87-1322-45ee-9b4c-72982b42a61a',
    'ce4ebf0a-5373-4593-897d-2acdf9b561b2',
    'd08812ca-9f22-4b0f-b8db-56fe011a4cae',
    'd50679b3-e99a-4184-bab3-711fb924e8a0',
    'dcbea90b-03dd-45f1-b293-49e61f280bc5',
    'dcce8a96-58bc-4995-a712-c58cd3cedc01',
    'deaff63e-c527-48de-9cbe-f42ccf0775ac',
    'e334a4bd-0fa5-410b-8e9c-cd2d7d059fcc',
    'ed78d79b-2167-4ed5-8c18-3d9a87536580',
    'ee7dd5f1-27d2-4c34-adc9-b364e6e9e7ca',
    'f0863f8a-b881-4d5d-aef7-ad3a17b274de',
    'f6eb051f-1a81-429c-96fb-3f7cc9427ed3',
    'f959659b-6351-44af-a0b0-683928d68ddc',
    'fdfb63da-723e-41f4-9471-2ea2b390fa1f'
  );

--   45 rows -> Software Developers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where id in (
    '0d23709e-0f2a-468f-a143-19f3fdb99cad',
    '16d82ffc-426a-4872-bcb3-e215feec3d9c',
    '1b941b2f-e048-42d7-9004-8a000f94ed98',
    '1bc141eb-7ffe-403f-9c99-bab1163d839f',
    '23826a1a-65c1-427c-be7f-7628201bd6ce',
    '27bacc65-d27d-4b4a-88a0-1d2d519062b2',
    '2c8dbdf5-546a-4983-afcc-bc24e631d95d',
    '2c8e2cc6-a59e-4edd-9d5d-e50461309d14',
    '30954727-b10f-45c9-8e6e-dd7c6d59b295',
    '3aba9774-2b1d-48ae-bea5-21b7abaab3dd',
    '3ac36e38-e0ec-447c-96b4-663ad5f01626',
    '3b2faa11-c7a2-47c4-9c3e-1d1a19e56df8',
    '4b68fb43-19df-4c77-b607-cb103569cd01',
    '4efd98f4-62d2-405e-a636-78d1750c5d8d',
    '5795754d-6267-4d53-bd2d-eb49bf192d57',
    '57cb268c-e9f6-494b-8677-aae1dc7422b3',
    '585c9f04-9925-4855-91bd-8fcdec3696a1',
    '5a4fa759-b94e-41d8-8c8f-9bf3eeafb82a',
    '692e50fb-efe9-421d-b8b2-3ba857d6ba57',
    '6a5655a3-4bd6-4874-b42a-365a55ba0a44',
    '6b2306b2-7dbc-4792-95f2-007404f80d90',
    '6f9ccd6b-5143-4444-8aa5-085299ac9e1e',
    '713b84ca-84c3-4e50-8bb8-a5ffa533b243',
    '803cd14b-67d7-4d80-94b7-040b35b25a27',
    '8f1f4800-b406-4c33-9a38-88ac53268848',
    '9231a4a3-5c19-42fc-96fc-8c6a5cdcb12e',
    '9783e3ff-e6e2-4f82-a513-9e5bd2750973',
    '9a01627c-c4a9-4d6a-981b-f4be54c4ffd2',
    'ace4367d-3852-4bb1-8054-441eb4b85955',
    'b0a380ca-ec99-418e-b775-14fc85791a9c',
    'b2f9c034-fb46-4f52-a4cf-a0e7b5e80792',
    'b34e47a2-9a43-414c-a910-944fbc4df99c',
    'b5196790-2fe1-4c80-8866-bbb0b8705045',
    'ba514328-caa8-4cf2-9dc5-4011f3224752',
    'bbbf5f41-0138-40f9-b3ee-f587885beea9',
    'c3124216-7db1-4c9c-8cc9-94ba67fdfe5d',
    'd36003f1-a98f-4695-8eeb-92c925f6ba73',
    'd955c258-2267-4fc8-b201-99d170807880',
    'dd5ce343-9284-4777-95e0-5e075d8b70ff',
    'ee29f7e7-7f95-4e65-8248-2a8ebce1e8e3',
    'efdefbec-f841-4cee-94c1-f574cce3c764',
    'f0a68bf6-5a1b-4ef1-990f-95dfc908854f',
    'f0b08c9b-43af-48e0-b6b3-0cdf135d9539',
    'fbb8aceb-3b81-4be0-88b0-6e3376337089',
    'fe383e30-82ec-4e79-a71f-3027e5ffa593'
  );

--   33 rows -> Information Security Analysts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1212.00'
where id in (
    '29dbbcfe-5b10-4391-ad7b-1cb1b7789752',
    '29debf99-659d-419f-94d4-13353b75b827',
    '2fba32e4-02c0-49eb-8be4-03bb98efcd86',
    '335c2bc1-1986-42ee-9a3d-6d596018c16a',
    '34eddab7-e324-45e2-b466-1d3a1ed95371',
    '3627717a-52e4-43c3-9bd4-ba2724533311',
    '3924a08e-69ea-4902-aa5f-6850f8116632',
    '3b9343a7-8209-4efb-8d0e-62db92a6f307',
    '40965a9f-05c8-4a9a-8a69-92860a519c00',
    '413869b1-36a0-4581-bb91-153c27fab860',
    '444a399a-f122-4256-bd35-81758421a2a0',
    '45b670c9-0fe7-47dd-93e7-da16569ac16c',
    '4ea81d29-1f9f-4d34-9a51-ad2c933ccf17',
    '54ff087b-1076-4857-9425-ce1241eef33f',
    '5f000910-7b7b-4d2a-aaec-93b0e0b47330',
    '63061e76-7ce1-4d1e-a023-eb4b4e01f38b',
    '6bcba312-a671-4af9-a557-57ff7ac8576c',
    '7b5bf72e-107b-48eb-8677-4f62735e9d8f',
    '829db556-1120-41b0-b874-e56bdc612546',
    '83a89c3c-22d1-4af2-9547-d14196deb272',
    '89383af8-0854-413a-9dae-4d7fa297d55a',
    '8e84ebcc-721f-4ba3-8d37-39495d753e49',
    '8e93f131-c5c0-4ef9-8f2a-24326e438e2f',
    '9a30aae1-13ae-4532-8016-76458bdcd342',
    'ae77b31c-871d-4254-9d1f-3f24833ae322',
    'bfa68e95-f7d2-4514-8632-4cd7117211b0',
    'c1e03b37-dee4-4d53-afcb-d433f5cff9e7',
    'cd6df5de-2be5-48f5-a82d-c9cd0f9e63e7',
    'e0851e23-f7f1-4b1f-aad9-c29f8d9644d8',
    'e87d1636-ed71-4210-b58a-0941511337b2',
    'f3df3f3e-d5df-45a6-aab8-1b68be37ad49',
    'f4567526-1874-4ed8-9edd-cb135a85bba9',
    'fc405513-fd28-41b9-a8e2-9a2eb63247ac'
  );

--   29 rows -> Environmental Scientists and Specialists, Including Health
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2041.00'
where id in (
    '01fe9c88-fc5b-47f9-99c6-49adb38591d8',
    '0301c5b6-5f9f-4ca6-95ac-6fe927d4c0d4',
    '041e2f8f-fa00-401e-9c7f-f2b708f3980a',
    '12e1de8c-f911-4512-811a-4746a82c64f6',
    '13421aeb-9f0d-40be-97bb-67870dfe694d',
    '1557afe6-9f89-4415-bb83-832aee27991b',
    '17826ec0-e7a0-4490-991e-c9736c5201c3',
    '1b385832-7b76-45f0-8238-d100b094f868',
    '1f676475-8185-447c-86fb-18753b6231c2',
    '33ad3b6d-08a6-4e5f-a8e8-2b2224a70ca7',
    '359fe0f6-0372-445f-8aac-5deba57d6724',
    '3f1bfa15-15bc-4948-93e0-5370cfb1c011',
    '44edfe44-d0bd-4a26-8ab8-c7c88db26915',
    '4ca6ff89-cfe4-4afe-af50-9d0c26fe335c',
    '5ad62108-184f-4458-bec4-1c36534fc7e0',
    '6eb75d08-8b7b-48c1-aad8-8c2e1d65847c',
    '769e1e8b-3ebd-4ca8-8d88-cabd6cd6a19b',
    '81180f49-6771-41d5-9146-f382b786dfd9',
    '8e33a119-df1d-42a2-8a3a-7b149d91fe96',
    '95e7ff4b-8179-48b6-b43f-5c6113355fab',
    '99e9ea8c-4169-490d-ad97-e7d45723d7fe',
    'a5ff5926-543d-4f0e-949b-07c3fc42797d',
    'b03f60af-c4fe-45ba-aa55-85334ba0ff88',
    'be646b99-890d-4ef7-9374-5ec9b42402d2',
    'c8f399df-9ffd-4ca3-b31d-0086dbe816f5',
    'cb322631-3927-41f5-b4d6-09b1945a0c35',
    'd380c6fb-ef89-4bd0-9b77-92e295f2805e',
    'da10ceab-4efd-4d36-8308-a32c6aa33d94',
    'f09972ff-c290-4520-9761-6b63eca0888b'
  );

--   26 rows -> Exercise Trainers and Group Fitness Instructors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-9031.00'
where id in (
    '23b6847c-cc6f-4653-b81c-952a61b77f7c',
    '43acc14f-9166-4ac6-883a-dce63a359c51',
    '469f8e8f-a675-45b9-b43e-bc0cbce952d8',
    '524f873e-5e2a-415c-92b9-fd2cc5409565',
    '5d6e2c74-ee6b-4f58-bbb5-7685d4a06f26',
    '5eadf6c5-423c-4fbf-90b9-9a2bcc574298',
    '6316a01a-e7e2-4e83-bc26-4a56877ce014',
    '679f81d9-2a29-4890-846f-0b6959aed768',
    '687302f1-dc51-487a-b86e-2868f02374aa',
    '6b165ba3-0245-4faa-ad6c-3f0f1a586fc3',
    '6cb04170-b9dc-4bbd-9871-2040370f0dfb',
    '875350ee-2557-4498-8a80-22b41d59d984',
    '8bd9a78d-7631-48c0-a6ae-4d8edf00422f',
    '92cf011d-8405-47ea-be77-1d87169447a3',
    '943ce551-d7b2-4e7c-9580-611c5bc8c071',
    '9b52768b-0e17-4f66-9547-260bc1812cbc',
    'a3065879-387d-4cf0-b3b6-0c6eaa879cc8',
    'b0adda71-7c10-4430-8314-49e981f5cb9b',
    'b68bb151-9353-4d3b-af39-fed105215f03',
    'bd9245fe-fd29-4323-b4d1-b0420e6017bb',
    'c873cec6-6190-4041-9520-333db060bc2d',
    'cb3e9ee4-966f-4e00-ad18-4b68dd101a94',
    'd41b3dd3-a1cc-4044-a64f-d506291afd1a',
    'de0d75a5-77a0-4ce3-9cc2-7c222f8baa1e',
    'e016c8a5-8e90-418c-8f7f-a8817cab470d',
    'e34dbe9e-2907-42df-aec2-6b7c6f98b938'
  );

--   24 rows -> Management Analysts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1111.00'
where id in (
    '09c20fb1-3b21-47bb-af5a-8baca06a386d',
    '13a04493-7098-4108-9c72-9d02e84b0e9a',
    '13c03f26-a986-45fc-bde1-979487327120',
    '1548f630-7e12-4823-a246-c57cef83a61d',
    '1812ee11-d3e0-4042-a7bb-57720b706dd6',
    '21d3ba3e-7757-4a46-9d6f-2f37e83df6a5',
    '6b7e5f67-2403-4068-a4e3-37ac07f6a739',
    '70b2cd62-a8f7-417b-a255-20a92cbcdac1',
    '712f0d5b-75f2-4d73-9566-748c94fbfc0b',
    '967c6a51-3e5d-4ea6-9972-2a14f665fd67',
    'a4076024-3edf-4253-9109-51b6aa7d0cdb',
    'a4d915ce-a598-4016-b3c2-0335cc331ba7',
    'b16762b4-e8e6-4576-bedf-21612ed253fa',
    'b2758d9e-051e-40f9-87c2-ce3271071e49',
    'b4bc3fde-8ada-42b5-b012-9a0ddd8bc1bb',
    'bd040f2a-f065-4bb9-b3af-efc118d646c5',
    'c5ccc63b-44e3-41ee-bd3c-8e1009dcd88c',
    'c855ee3e-e983-4d6b-8f59-0354f4e9a2c4',
    'd1b5f452-15a4-473f-9664-fc76f8a8eebc',
    'd33d3e76-cae9-4295-9848-c981b2abad2f',
    'd4d366ec-c7f1-4074-9ad2-12e06fd2aa42',
    'def15e92-0206-4b10-a619-9cd8db591683',
    'e3d6d797-044a-4192-a809-f3b2fba782fb',
    'ebf3b98c-ca6c-4262-a8bf-0db6e6710c5e'
  );

--   20 rows -> Biochemists and Biophysicists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1021.00'
where id in (
    '4e417651-7766-4547-bfe4-382f2567eb21',
    '57763f57-c434-4f52-abc2-861908b074e5',
    '6750aad7-1486-440c-b370-5f37662c4156',
    '704727de-b4a3-4abc-baa4-73905a8ebf89',
    '8411b9d0-4b4f-4309-845f-68eace61a4cc',
    '95d4cdb3-cff2-444d-a169-d60f483ac926',
    '99707c7e-aade-464d-929f-b85f09bc6588',
    'a32ef9a7-e4aa-4d85-8109-996414c3e614',
    'b2f6cadc-9576-47b7-81c5-9bb83c0fe07e',
    'b3e7e1f1-4d35-4dfe-bf09-24c71e2fce63',
    'ceb37cf1-9459-4386-8a0e-2171a4ac82cc',
    'd78e3f7b-8bd8-4c0a-8c50-612206b2248a',
    'dfe1a859-c764-4954-9ce3-b86d3a9088b9',
    'e0e64d3f-0adf-4125-bbd4-c895d024bbcd',
    'f012204d-544d-44b2-8736-b95aa184cfaa',
    'f3bce724-7698-4627-8266-75f73e4b2cb6',
    'f87f4c82-c227-4cd9-b641-ae8c57fc531e',
    'f9078d1c-0fdf-4a96-9f24-28c108316256',
    'fc70f722-76df-4c05-9bbd-a5a18ad39f49',
    'fd770d7b-5ffd-4270-be70-8af192982e3b'
  );

--   19 rows -> Writers and Authors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3043.00'
where id in (
    '08dda6f7-8bfe-416b-8a7c-cf48b5b0688a',
    '282c961e-9bab-4e49-8945-302cb2ee8405',
    '2cb3f8a7-4df0-4dc7-bd7a-37507f56e6ee',
    '346c24ac-7b01-4838-8d6d-3aceae67106d',
    '3a1abf98-529c-4312-a85d-00d3d27b030b',
    '43cfa17f-fe67-4ed4-8875-87a7b90a1d68',
    '4e9a9ab9-1e1b-4fa3-894d-12e88b90051e',
    '5749c93c-bfb8-4e27-b344-e140634dc726',
    '5b60d640-1248-43cb-b3e1-6f7a3382f866',
    '5cd9b8e6-5bfc-4aa2-a902-60baadb5988b',
    '5d9b2151-d8dd-48ce-9517-8188bbba819c',
    '7c3362a9-5bad-41f3-8230-62935782b1fd',
    '8c825d6d-982c-4200-b73c-ddf69d70e235',
    '8dacb71e-358b-450a-8b7b-4fa98c3cceea',
    'a89843e1-d0cf-4e51-9b92-06d7914a722c',
    'b1e047b1-214f-499e-b574-71a9c3a3480d',
    'bbc2ad2e-02b1-454f-9a2a-2582e807527e',
    'd29302fb-ca0c-41d6-a589-46ab53393d3d',
    'faec4966-31db-4090-bca5-61c95d82b726'
  );

--   19 rows -> Police and Sheriff's Patrol Officers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/33-3051.00'
where id in (
    '17c8c85a-4f03-4ad5-a433-f2ef48514dc5',
    '36e2173e-faf9-496e-bec7-4538e70d2570',
    '3eae0f11-7603-433e-ba99-33ea83bd3f35',
    '501f8cd6-489e-40eb-861a-a38a9e52ac73',
    '556271e8-9773-4419-ab2f-c0d576b50760',
    '5da5c557-6357-4b18-b885-fc80ad56253c',
    '5e42dfa2-bfb1-4066-a934-6a8b51b17180',
    '6079b1a9-4300-43b4-adc3-dd6cedb8ab86',
    '85570164-a5ec-42a8-9575-83854622d5d5',
    'a396fae1-7f0b-49fa-a5cc-c24a25dfb6f8',
    'a423ba7c-665f-42eb-878a-1b358f7a45cd',
    'ac8f3253-764f-48d5-9e7a-e5d278b8c6f9',
    'ae69907f-534f-4714-9287-40c0efec8d7f',
    'c79d9bb0-6160-4990-8fe9-24764ca2ec62',
    'ce0ff0ff-2cf0-4c1b-ac3d-13bb7b910727',
    'd01c8706-9705-437c-b7df-2f22fa5c4be3',
    'd83f6c11-dc83-4d6d-adc7-176ee2d65190',
    'd8dfcf62-8473-45aa-b115-d2ee8796e9f7',
    'e0b4ceae-30dd-4577-b694-e03c00e12a96'
  );

--   18 rows -> Broadcast Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4012.00'
where id in (
    '09104511-5ac8-44e1-9c46-e28515cf26cb',
    '0b67d2e9-ba65-49e1-a20f-c0302aa7624f',
    '0d6f4900-1b14-47e4-923c-0a80a10fb022',
    '259068de-60c6-4168-acba-050fe8ca52b4',
    '28c669b2-396d-4618-80ff-c9f4284f989c',
    '29b4c72f-69a2-4a21-b819-778bad8de6f4',
    '29f301ac-992c-4f50-a717-dfefc1b0163e',
    '2e23adc0-16db-4d93-bafc-ad6812af427c',
    '30d62408-148b-40e2-b326-baa3a1d351ea',
    '44714a51-e90e-4fa4-af2f-9cc90866c3ef',
    '5361b60a-4745-452e-9902-371ed341fbe9',
    '6fae6d11-c204-4136-a876-809ed6312505',
    '9199d754-6370-4c30-a883-1239e532ca78',
    'b49f4109-ac4a-4cb0-aa1a-6e56b2f0938e',
    'c0149eb6-51c0-4650-bb2f-3faa684ce66b',
    'dbc5c26e-c223-41e0-9f83-0f8e87c595e2',
    'df544bd2-c2d7-4775-a94d-9d57ec150032',
    'f7629a82-9e89-4d26-a0e1-e58f120e0299'
  );

--   17 rows -> Chemists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2031.00'
where id in (
    '01998b5e-b01c-4317-9eff-f0f7428f5b03',
    '0fc6b6e0-877a-4bb4-8077-3589731e172d',
    '19961b34-7d19-42b7-bbd2-c4ea9c895c56',
    '27e03fc0-3a66-4c6e-8e0b-b80f38299373',
    '3411325f-2d3b-48fd-8e0e-02217679f6a8',
    '43f5aa03-c247-4585-b984-ae9d09ef4648',
    '50f8d50a-05d2-4ea9-8568-1b5ef68b197b',
    '72548336-409f-476b-92e6-b26064332e86',
    '8b0132c7-885b-4a14-8a1f-5bba0649cbf8',
    '96443379-a980-4a29-bff3-ae46f4b3c31c',
    '9ceaea13-a9cc-493d-b461-2836bfa931ab',
    'af0701a8-4f6f-4b5f-ae39-cff489b4ed70',
    'c5ad06e0-1de6-4deb-a616-67b7f83f4271',
    'd0e63976-d1bc-4e36-9f3f-27f090b86cbe',
    'd722276e-7c05-4731-b639-c408a6209a13',
    'd7c5a10c-2501-4bd8-9f44-33d406248a19',
    'dec3ee9b-d40d-4c90-8946-ca9a7b55058d'
  );

--   17 rows -> Secondary School Teachers, Except Special and Career/Technical Education
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2031.00'
where id in (
    '02549d8a-8676-485d-9451-2279ed3e87f9',
    '16ec6c34-bfae-44e1-bd09-91f766501c5b',
    '39060d06-4881-406d-acd8-05de40de9f0f',
    '399234d9-14e8-4993-8d91-b9ecad867fcd',
    '3b4c576f-6c70-4078-bed6-8647bfeb2b68',
    '4d84f6be-11b8-4573-8cc2-a2ca0a13bf10',
    '5703f2c1-987a-419b-8c86-ed6574cfbabd',
    '5777aebd-abf0-4c1e-8a16-e0fe564d7683',
    '58fb1118-e003-4667-8f32-acf69f4b41a3',
    '6c237030-252c-4ef2-83b4-7836f5d33b84',
    '9cd03521-29fa-4b89-b965-77a49be539ee',
    '9d4fbaf0-6940-4d4f-8bfc-a2824269308e',
    '9e419408-4ebb-4acc-a08c-9f7cebb0b03e',
    'a2c5c77a-227b-4d16-97b7-0f2045ba35cb',
    'a2f0224b-7943-4727-a584-d7eba4e1199f',
    'dab480e8-d956-4138-89e5-060b66528b9f',
    'e2f23898-d48a-4485-98be-5d0c0e175cdb'
  );

--   17 rows -> Electrical Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2071.00'
where id in (
    '16cb58c5-0afa-4ea1-bfe2-6694672e9648',
    '23fe7308-5780-4087-9dc2-f2d79aad4ac2',
    '2696b473-2a68-45c8-adf2-d379b53ac920',
    '3ed678ed-278f-4309-a50a-3a06b71726e7',
    '4adc5cad-22e1-44a2-ae86-55ee04ce2d52',
    '4ef515b4-2fca-4948-84a9-43565ab07cbc',
    '5597cc16-55b5-4de8-a508-25471dae3b00',
    'a22435f7-02f0-41fc-9ca8-0cfa5a5fb69f',
    'bb1dea68-a472-418f-baa5-62aa8043a572',
    'cbe4fbde-8462-4ce4-b9b7-f2c16774cbd3',
    'd3c298ab-0c50-4be5-8c87-a5971172027a',
    'd9b4efa4-57b2-48e6-90b5-dc0df58004df',
    'dfe56d97-c539-4238-8eb3-91add71fb34f',
    'e3722bc7-ab3a-40f1-9651-8f3f8eafafd9',
    'f4dadb9b-1f6f-4693-b924-60483f753dd5',
    'f9ef6365-388b-4821-8c9e-43a4f35abc88',
    'fc039799-6dd1-403e-8afe-b730343281ee'
  );

--   17 rows -> Chefs and Head Cooks
update public.careers set source_url = 'https://www.onetonline.org/link/summary/35-1011.00'
where id in (
    '1ec793d2-6449-4406-8e11-ef9d7bb39fc0',
    '2d13ac51-2a80-48bb-9957-31a676dbb941',
    '4293b4ec-e648-4a86-8c89-e16d343db4c0',
    '4490f8ba-dc5a-4379-a09d-4864cd0c69c5',
    '510ebbc0-156e-4033-b748-f3be3032c1bd',
    '6fe8a231-3346-428b-8fb2-beaa28822874',
    '7a167eda-69d4-405a-9e28-ae5b638e8833',
    '882daaa5-5161-4340-8314-2d76b5f21354',
    '8c059de9-2ab2-4a86-bad1-84870947a3ff',
    '8dedc3a9-c2ed-4096-8f68-acf7e7456e8f',
    '945225ec-49ab-454c-8084-87e4710c4f7f',
    '98ad08b3-eaf9-4a85-9759-80ee5be7000d',
    '9fcba78e-2b75-44e1-9951-b185a26ef181',
    'ba78e112-df75-4ef0-9982-b4eed1c66e97',
    'c51c5fcf-1eb2-470e-af3c-afbf423c7ba2',
    'f3f67c98-6e48-4efc-9dbb-1b7b10b1656d',
    'fdcd6ea8-3a72-4e09-bb7f-9f56269ce6ce'
  );

--   16 rows -> Environmental Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2081.00'
where id in (
    '02e3c2d5-87c7-414c-804e-5e5740447cb5',
    '0df06fc1-66da-440f-8949-3eebb97794e4',
    '13a7af24-d8b6-4e0d-94c6-baab9a31ab18',
    '3542a29f-333b-4e13-8b37-2b3a9cb9dbbd',
    '442f7bc1-32e2-45d3-8d5a-a3d4f392517d',
    '6af142c7-38e4-4a24-b40b-835d780296d0',
    '701b52b5-24fa-4e0d-ab07-d04f81c678a8',
    '71c61047-03e4-493f-b24b-8d5b00508f74',
    '80bbe187-9463-4fad-ac20-d9fb5b635bac',
    '9d74b1f6-61c8-4c15-a1a1-3f63f38ec983',
    'a21ab204-c11a-42b0-b8d3-92b749bde90b',
    'a6ae196b-cad0-4d18-836c-a6fab9f19a3e',
    'b81738f9-8cf0-424e-a4e3-475af805e426',
    'c3ed03a0-d280-4daf-bca0-9828c1b4a373',
    'cc919176-47ee-46cb-bafc-10edea1b7017',
    'eb0307b7-74a4-4ca2-921f-667c6a9ad127'
  );

--   14 rows -> Medical Scientists, Except Epidemiologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1042.00'
where id in (
    '1afc299e-dca4-4a04-97ad-ac7948532977',
    '22b8ac61-dcd2-41ea-ba3f-8e645e020696',
    '532318a4-fd4d-4f22-bda0-49ea6f29cd68',
    '8721fb74-3f1b-4765-aaf6-de93120a16cf',
    '8c7e2bcd-ac75-4ca5-aa03-2649dc416a44',
    '93c997b1-0cb9-4b5c-a1fc-9bc443de0a08',
    '9f9631f0-35e0-4e45-9716-ef5f56601a65',
    'af4ed3da-2dd0-4c4d-99af-2d8d82a88e00',
    'b3370223-df60-4fd5-9d1a-aebc84849b29',
    'bf34c61a-e491-44aa-b7f5-25a749588088',
    'ca8f0c81-3f5d-4f52-9283-eb9077dff4fb',
    'd206076f-cb37-41ce-8ff6-39fd052785ab',
    'ecf7c38b-77b6-4ba2-b2ef-9df2083d871c',
    'fc427a67-f191-4d8d-91c4-33d1637e5c67'
  );

--   13 rows -> Editors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3041.00'
where id in (
    '00cf794c-9cbb-4b61-8692-78f384b8f86a',
    '01f56853-22ef-432d-8baa-989ea161be47',
    '0776498e-ec5c-42d6-851f-1e653118217a',
    '08931235-d01a-4107-b931-079d2ca9334c',
    '2b06ccf8-7d6b-4814-861b-8879250f2468',
    '2dfa4bf0-1def-4878-a8c0-de0913c2c511',
    '2f16302c-da55-4121-9544-7e1d54729661',
    '2fef7a85-61a1-4525-a43c-e3ed08596aca',
    '4e46f69b-e4f7-405c-bdc8-9070912ccf4e',
    'bc3ae27a-99e6-42b7-98cf-0577d09b8c0e',
    'd95789cd-4898-4447-afd4-550c2a49fc1d',
    'e0988a61-f113-4cac-bcbd-8b39e6a30c28',
    'eb3c8236-57eb-47ee-9caf-1ff79e823f63'
  );

--   13 rows -> Instructional Coordinators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9031.00'
where id in (
    '0a92a938-9fe3-4c47-a18f-fce4a96110c1',
    '0f32b7b2-f4d1-4876-b57f-f00ff545591f',
    '13600dd9-a21e-4b60-8793-6e3356a312d9',
    '28ae8f72-5006-42af-a07a-6b1bedb4f797',
    '30a94fcb-3914-4530-b9ea-25fe997015bd',
    '34f3f07f-0675-405f-919a-e625a6a52ae7',
    '413c174d-c05c-4b4c-8b9d-cb5a30bbfc00',
    '50f5d6cf-6571-449a-9409-9d981a48a7c3',
    '5b9628a4-c197-47a8-91ce-f1619d09eb64',
    '9cc6b002-932e-42ed-bdf0-7b5bdf625de5',
    'e12c479e-fc71-4f78-9d7f-88523712a5ef',
    'e4ab63eb-419e-4d46-b88c-81d7b6808f03',
    'eee3a941-2a7a-40fd-a5e2-e3c78050f417'
  );

--   13 rows -> Personal Financial Advisors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-2052.00'
where id in (
    '203d3789-0561-4759-8c8e-3f0f5c18e689',
    '64681d2c-ca17-4a66-8073-91f1c9e16845',
    '8ceeef36-981d-4fba-941d-1cdaf813de00',
    '928eff4e-26ea-4aee-a131-7aab06f99cf0',
    '9523ed5f-11ba-4b6f-a4dd-b19ad1baea88',
    '996a158a-fb3c-47c0-9cc0-92c9c5a1680a',
    '9c09aa6a-847b-4059-b1dd-51fbcb111295',
    'a4db2cb3-53e5-438a-a98f-5b11e94678ac',
    'af83a428-fb96-4822-8cf6-bf6f40523683',
    'b8bb8c8e-2618-4f89-9bbb-b4c5d7405e23',
    'c913a23d-8c1f-48f4-844d-33a1763b7cb3',
    'd9b5af79-f36a-41d6-850f-6800605607fb',
    'dcfa7d38-dcf5-4175-b0c1-8d1c755c47a9'
  );

--   13 rows -> Zoologists and Wildlife Biologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1023.00'
where id in (
    '30de9ed5-dec5-4f1f-a942-8ebcba8dffa7',
    '370a3fac-fcdb-4791-9963-0f4710795a87',
    '42c6e02a-4a22-4d60-b1f7-af584d8310d3',
    '4551971f-0d2b-4a3c-8778-b7b3ec1a92c1',
    '4dd09e29-a165-4eba-be86-98ff14d35ef0',
    '7b204aa0-e3b4-4b5e-a0e4-2f4d4fd9bf14',
    '8fa991a0-960e-4f50-93e3-0bff57b5c6fb',
    'a268014f-f838-487b-903b-f295d6e3a203',
    'b1b343c3-3c7a-41be-8764-ab1800584abf',
    'c17ff155-47cd-42ad-a87a-0ec8752e9482',
    'c48806d9-0a2f-497b-8204-913f6efe282d',
    'd2e5e0b3-0110-40b1-b554-33247923aeb6',
    'f3dd4c3f-a3be-4d07-a94c-19d335b5cef6'
  );

--   13 rows -> Financial and Investment Analysts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-2051.00'
where id in (
    '35b04169-f1e2-4ba1-9864-98b62f7d7e7a',
    '486c8937-aa48-442d-9998-279e3259c044',
    '4b57890d-7b25-438c-949f-a9af1e799181',
    '5057056a-75cb-47f9-9492-254b314fef43',
    '5b316ff8-2456-4d8b-88a0-87b8846fe579',
    '699979b2-0ecb-4e11-8ece-92a5ca0ba5bf',
    '71e7be19-d225-4040-9ed4-9fafd08806c8',
    '76f86df4-10c7-4d85-b916-0d93fb15e870',
    '928a5b4b-e54f-4015-950a-0ed0140dcd9b',
    '99e211aa-cbac-410c-af39-2e0b28b1c7b1',
    'c210bf05-a15f-44a4-bba1-17e1cd17a37b',
    'e71551e7-b512-44c2-b0c5-017e21178a60',
    'e7d75bf3-4d70-48c5-b247-af4991dd87d4'
  );

--   12 rows -> Astronomers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2011.00'
where id in (
    '19fddce2-ec72-4cb6-92a2-adf1633118ea',
    '26ce6924-a60c-4987-88a7-5a15d85b21a1',
    '31bea414-a39d-4e25-83e5-ab119951639f',
    '62b6d2df-fb7f-4d36-9ace-7047a4f65a59',
    '6efe7b92-b676-4c8f-846a-e6b77a2939c7',
    '719b72ec-e187-4e05-a102-f8c56d46a1aa',
    '8d95e6e0-438e-4dbc-af2f-e1b4b5f81e18',
    '9765adcc-5ec2-498e-96ef-8b389e05b8bb',
    'a9bf8809-fa97-4cd7-944c-e5f2104863c5',
    'c6ffe11b-349a-4dbb-9790-a4df8d7d9b3f',
    'd64c4100-3914-4a61-b8d7-c77dddb1fcfb',
    'f5fdfb5f-f23c-4248-ab2e-3e144d1ba693'
  );

--   12 rows -> Special Effects Artists and Animators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1014.00'
where id in (
    '21331d42-7526-4588-8ec6-bb959d9e0ae1',
    '22337cc7-556a-4cc9-86f0-5acda8c4c153',
    '28296272-d6ab-4734-8cad-d1a00360f1c8',
    '31760410-e1d7-4dba-8fcd-7cf5f2f843b0',
    '3d92ad9a-131b-4b60-9e16-f1f64964190d',
    '43e68e1c-e8cf-4843-8c25-07601a05537d',
    '4f8c091e-9e83-40e0-a173-e156ce6e9bc0',
    '5d75ace1-cd56-495e-8a4c-994e5b80afe2',
    '70e02f39-760d-4023-b3df-ac9a06270269',
    'acc67dce-f5de-42cd-84c5-ab2d1fa9d5db',
    'dc79e979-a041-4341-8663-5aa10dcb19a0',
    'dd3a60b5-0fec-490b-a41d-e87e37124ea4'
  );

--   11 rows -> Food Service Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9051.00'
where id in (
    '00cb3107-023f-491b-aefe-c22a5902559c',
    '02286f51-7976-4598-84f6-7ee89a140fcb',
    '2e611b31-5d57-45a2-911f-0a2b7e7db4ba',
    '2e7e1c20-b084-4a37-9611-efc7b357f3d8',
    '4ca0f8f4-bdae-4bc5-b410-114bcc8c5ab0',
    '872771da-4c4a-47fd-9ba7-06533048ab01',
    '97e74b58-fa6e-4ffa-b859-66349034d054',
    'abe97caa-2aff-4b61-a193-f71e4927246c',
    'b8ae1654-fc17-4a4e-9eef-12f61deed676',
    'e21bcf6a-4a0e-4ce8-9616-17ae70479347',
    'ea4d4fb4-3b3e-4f49-9091-134a6a2fad28'
  );

--   11 rows -> Public Relations Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3031.00'
where id in (
    '42e26130-8cc2-4829-bba8-caf301f6059b',
    '4401778d-14d3-400c-8c1b-cf5790227882',
    '8627722b-f3c0-4aa1-a46c-47703e379bd8',
    '98db4504-cfe3-47fc-a50c-d2cca2c62f0e',
    'a32b835e-539b-41c6-98bb-707573772cb4',
    'aae9d029-88b3-446c-b842-37a3821d6000',
    'b20a28d7-0925-46d1-9b0d-266a608d03c8',
    'c593ebbb-0059-4a89-af67-d91381e99ed2',
    'd051cea2-0518-45aa-b270-50d1d36f95db',
    'd0f0a5c1-2ac1-4a94-81a0-5bc96e30ac0e',
    'd5346fe0-51e5-43e5-94da-262db23bf53e'
  );

--   10 rows -> Actuaries
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-2011.00'
where id in (
    '0774e904-0de5-4240-8294-67b894f922f8',
    '1f2d696c-ce27-498a-985c-3793515d4ee4',
    '31d195cd-5558-442a-8f1d-48f6324567f1',
    '3930ae98-5566-44a0-9381-24b61a27b209',
    '6c257b36-b591-4f93-8f1d-3f872380bf86',
    '7faaee83-9d94-4691-97e4-f17a67a5108b',
    'a1c5645e-6c80-43a7-b4d4-f2e986b28faf',
    'd6457813-6901-451c-bbd8-5c18a63abb45',
    'edb1307f-094b-475e-8f9a-266a7ff82ba4',
    'ee48c897-a901-4d09-9e2f-861757af94f0'
  );

--   10 rows -> Social Workers, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1029.00'
where id in (
    '0b7e2dbc-dc43-4576-8173-6ba80d1c982e',
    '30a0162a-770d-45ac-9162-d6168d43f2d0',
    '423bde79-4095-4ed5-860b-7b00e24dfcdd',
    '686cae86-8151-4baf-bb1f-dfe4c24f9c21',
    '75fd8ea4-0d46-4c6f-a424-9a6b8914e4c1',
    '7ff238ad-cbc5-44f2-95e1-1ad90fc21514',
    '8310942b-7433-4297-9271-c09895c69bb5',
    'd1328eaf-3a35-4e47-a95d-199f68a20914',
    'e2384eb2-633b-45fc-bf13-e8d299045cdc',
    'e49258f3-ea83-4180-8ecc-088afd8844ab'
  );

--   10 rows -> Actors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2011.00'
where id in (
    '0c20c515-f7a4-4841-8a2b-27d39d5cf5b7',
    '134e8756-7a12-4c9a-980d-44c611b29654',
    '57a1ca6e-050e-436d-850c-ffbc77a18b95',
    '5e3d86e1-6b84-485f-8ae2-b7ac5fe404d8',
    '68c3ca16-2dce-4306-ac42-d8ec990c4186',
    '70d1b7e0-6e1c-4474-ab82-67f087ad873d',
    '793da35c-cb01-4f38-8b32-3b3b6b20db3d',
    '9705287f-ac93-4550-b274-b20d44ca98eb',
    '9ffd689d-5ac6-4af9-b809-52c2a9d836e6',
    'c012fff5-1b8d-4a20-b36a-aa1156ca080c'
  );

--   10 rows -> First-Line Supervisors of Retail Sales Workers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-1011.00'
where id in (
    '533cfe53-f31c-40ec-b77c-52c4a65b5a4e',
    '55e9ed07-c9ab-41fd-be4b-45d83c25e55e',
    '5e3fa746-bbc6-410b-8c32-cf9189a92fb0',
    '8964b8ba-4da6-44f8-afe9-dda02600303b',
    '97d6af8a-f3d2-4cda-a0c2-220d397a4f11',
    'ac3d259d-3444-41e7-9bde-2e14c7e684c1',
    'b633ce90-c192-46d7-a550-856204b148dd',
    'c7bd6149-76b5-4131-a985-bbf213aacb54',
    'd2df88bf-3121-459b-a9ea-3fcce4b7720e',
    'f915041a-33c5-453c-9a74-c8cdc681a650'
  );

--    9 rows -> Network and Computer Systems Administrators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1244.00'
where id in (
    '026daab1-c21e-430c-9c5a-b15e9b3d5b75',
    '2835bfd8-76d0-49eb-acd7-f46c69023366',
    '36b1a509-f5ab-49a7-921b-f927e1a8e974',
    '3b95a19d-1ea7-4670-8290-f6334d0483d8',
    '6c897a67-d486-4e90-b1cb-4c1774bddbde',
    'acc8f8d7-a86e-43b7-a797-430f6f82ce63',
    'b4512e5e-2b4e-4c1c-8827-932c13f5a6e4',
    'c53a98a0-f887-476d-b7b7-7e2b0e44b6ea',
    'fc495914-7347-4463-b0d6-f4803e6e2297'
  );

--    9 rows -> Postsecondary Teachers, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-1199.00'
where id in (
    '038f9275-f1f2-46ec-b939-910443287b53',
    '0cbd57e2-90fa-4127-b60f-550746664e55',
    '3ecad0e3-76ce-4333-80ed-7a7171e90307',
    '6042a81d-e868-402f-811a-026bdd9164cd',
    '92677515-b5a4-4b67-bca0-bc3e625d7945',
    '96ddb0d6-d001-4f10-823a-3b50bb74c0d5',
    'ace4ae61-60cf-46b2-8cd3-ed0e4d3660f0',
    'af530cbe-59e3-4506-b91d-37f0e94922d2',
    'd16dfe52-28d8-4831-8e5d-fc099d762b2d'
  );

--    9 rows -> Statisticians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-2041.00'
where id in (
    '07ea5fd1-52a8-46cc-b5e0-3788fcf0f68e',
    '506b377a-036e-46cd-b356-6608233d3831',
    '76d471ca-f01b-4075-a7f7-0cdbb1371649',
    '8c981ec0-bf6b-4c15-ad00-71567c1a46a9',
    'a0a352f4-2ec7-4485-af30-c05bfdef5410',
    'a73a8ba4-5374-4c66-a475-81b0585c52c4',
    'aab5f0f5-3078-4b89-a7fd-48cd74050968',
    'df1898c5-668c-4ba5-9ec7-de21e0d09a6b',
    'e3bea7e9-8547-4b28-9e39-c9fbce24348e'
  );

--    9 rows -> Special Education Teachers, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2059.00'
where id in (
    '0c028b17-a4a7-43c3-9280-6b7ec404b9c3',
    '749de572-c5fc-4c80-acbe-7effe67fb0ea',
    '8950128e-50ee-47a8-a898-36588e54b9d6',
    '9198d822-115a-4880-94cf-287c549314f6',
    '9694e82b-ad1f-4c0f-9b6e-4edfb32e0c5d',
    'b3774557-b3d5-4493-aecc-996c8443c63a',
    'bd48b39d-92f8-4442-adb1-4900191b3e56',
    'dcf6f285-2ba1-433e-8a25-fe60fbf49364',
    'fa301714-17de-46ab-880d-a7309856b172'
  );

--    9 rows -> Computer Network Support Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1231.00'
where id in (
    '199a1ed2-197b-48b6-9d6f-255447ccb5dd',
    '6ac810ef-7bfc-4f38-8513-4cacce2bdf9f',
    '6ebd2cf3-9a46-48e6-b27f-aa71c188048a',
    '8ca7d858-5409-460b-b401-2c7aa9031095',
    '9828e72a-2112-44c6-8f10-578cde240123',
    'b7416571-cd5a-4d9f-9fb4-b8f537f8be6a',
    'c97cf31a-b040-44ea-951c-0b13eecf213a',
    'ec3756f8-41c6-4813-a22c-5dc3b7693fbd',
    'f1c6ec33-6285-4709-82e0-3fc2056c8c01'
  );

--    8 rows -> Administrative Services Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3012.00'
where id in (
    '09257a56-b78f-49c2-a5e1-67d1e9ccd55a',
    '1227633e-1053-42a3-b9ea-d5111f237aa2',
    '1d509249-fe4d-4c09-a1b9-809e8607552e',
    '66904899-5f0b-4283-a80e-3e4c5e84e031',
    '7be4dd85-0b5a-4070-86cf-4bba98b504be',
    'a4a5f8e2-b18f-483e-94aa-ed0b3ee3ac5e',
    'b4077c66-7953-4d98-99e8-733117b0c5aa',
    'd96db51d-6112-4024-9615-fee94a453142'
  );

--    8 rows -> Paralegals and Legal Assistants
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-2011.00'
where id in (
    '160a619d-4500-49a2-86c0-ef54cf938546',
    '5715b830-f271-49a9-bbac-083e69ff645a',
    '7889b75d-4deb-4899-a3a8-7b08ae4d6a79',
    '7d1e3397-a0c2-4e3c-ac39-30c06bf01b51',
    '9ff4d0ea-7da6-4851-bb7b-cfedc3a684fd',
    'a5ecac3d-da25-4497-9504-bfad758907af',
    'd07a2f21-da3c-4753-b57f-3cdf5b679aed',
    'eb601eb3-cc92-4af5-adca-6501545a7e8e'
  );

--    8 rows -> Technical Writers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3042.00'
where id in (
    '16c81c55-3d96-4bd7-adc3-d4b4cf6ebb42',
    '292297a8-f0b5-431e-a88a-ea650c994a43',
    '63aa3502-8aa1-4c6d-b6e3-91ed0b2358e4',
    '995a7d3b-d62e-45ab-bb6e-908cd6501410',
    'a0714d24-8440-4a3f-888e-b0cbe7649896',
    'c10a88d4-ba53-49b7-9420-4cdec41893bb',
    'efa6ff45-7a2c-4807-a59c-74501aea6194',
    'ffb2d806-24a9-421f-ba5e-9a170c5b0c2e'
  );

--    8 rows -> Graphic Designers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1024.00'
where id in (
    '1dddff9a-4713-4733-94f7-ed33af882233',
    '6aa6ebc6-13d7-4ed6-a894-908d305bfa5d',
    '799ea36a-aacb-4072-8558-c1ede4f983a7',
    'a832e33c-ad56-47ab-8b3b-d30023a8546a',
    'ccff2f25-f571-49cc-8b42-10a45af91395',
    'dc0e9815-6005-4a5d-a0b0-0a4ebc552711',
    'f371ccc3-b8cd-46e7-9c0b-f91e63e80e07',
    'f96849dd-7e2c-471e-a89c-f23565f3f81f'
  );

--    7 rows -> Musicians and Singers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2042.00'
where id in (
    '003c1621-293c-464f-a504-81653794e5dd',
    '328fbb4a-d894-4a8c-94c4-b2f722ff3ffb',
    '46e89e38-3471-4b7e-99b1-1cf7026496e0',
    '53718362-e54e-4b2d-a244-e2e9a7c87452',
    '977b4e07-58d4-4b58-8044-d4de7f766e63',
    '9d4fb6ea-a278-4b78-b1bd-fbeb076bcceb',
    'd98f8c13-a336-45b9-9d93-ca0f2b4828f1'
  );

--    7 rows -> Civil Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2051.00'
where id in (
    '061974b6-85c3-42fb-a6d9-65f0c1c5bfae',
    '65a9cea1-ae03-40d6-9ddf-2ac373e83811',
    '833206ef-fdec-4781-9553-eca91cd4d809',
    'a7974165-97a1-421b-9d83-690757a20daa',
    'c2bf4aea-a2f0-4aed-94b4-d42f114c7a0b',
    'ec091b3f-bf6b-477f-9d2c-f92337b98ec6',
    'fb2279c3-dd8e-49bd-9c30-14214f04453d'
  );

--    7 rows -> Fashion Designers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1022.00'
where id in (
    '21bd7baf-99ae-4ec7-bc04-9dbfbd20bca1',
    '4459fd6e-75e8-48a8-bb82-637a1443c2f4',
    '612f69d1-43b3-44de-9229-79a94aa7c2ef',
    '6cd8daaf-9be8-413c-b2ae-c27449fa7daa',
    'e7d2953b-ffc2-4a6f-be16-71737be4b729',
    'eae2e918-f014-4ba2-88f1-c930f509869a',
    'ecea3410-79d8-49ec-aa24-5635981adb48'
  );

--    6 rows -> Skincare Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-5094.00'
where id in (
    '10a19992-5b7f-4845-9352-8c6b7badb731',
    '6af39fcb-def2-414b-be87-a7d41c6bf282',
    '70093634-b5a2-4ae6-af39-9f819628071a',
    '77eeecbe-2705-4f32-8111-ca9d54a23af0',
    'b00fcb03-37fe-49bb-a9ff-0267e0d9a20d',
    'd444d9b4-e944-4634-a576-e3428f479741'
  );

--    6 rows -> Administrative Law Judges, Adjudicators, and Hearing Officers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-1021.00'
where id in (
    '1c110c3e-b623-4306-b8da-01f0d5be645c',
    '38891be1-99a7-46bc-99f0-f29612e1c23f',
    '600f0ef9-319a-4c00-a42f-0651654c307b',
    '9baa9c10-2509-4d50-b92c-a1bf585ef90a',
    'af612217-c050-4cef-9c62-60864b809db5',
    'e36f2132-e7f4-4b92-97fc-7d20d75be45c'
  );

--    6 rows -> Mathematicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-2021.00'
where id in (
    '49bb3a2e-aec7-4825-9cef-bc1dc8732fdc',
    '55113eb2-ac0a-4726-bea9-d41ad35a5f4e',
    '89c00210-be95-41ee-acb3-73310f93a318',
    'ae9baf0f-8c99-4b4b-a249-4ca2b1bd146e',
    'cb71d474-f03c-4f03-b890-bb28663d6631',
    'fb295ee7-d389-4a69-af73-45f213cb9768'
  );

--    6 rows -> Barbers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-5011.00'
where id in (
    '4db7b97e-9de8-41c7-b095-3b5b6ea50f22',
    '5ee74b3c-1521-4cad-9e06-14827a83d93d',
    '9b6a1eb3-7baf-410a-8f6d-7afb06595f7b',
    'a283d0de-5492-47d6-a1db-a9b80ba9c84f',
    'bb3a2b48-75a2-4323-a3fb-cc1b9ca3ac32',
    'c5544836-89bf-4495-b867-b703abfd87c7'
  );

--    5 rows -> Web Developers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1254.00'
where id in (
    '0ac9e72f-bb1e-43a6-ba11-f014c56c934c',
    '6b0f88b5-1c16-419e-a571-0362b9e8b000',
    '7c0939ea-4876-451b-a813-2b68a3adce36',
    'c4326e7a-cc5c-4d76-b56f-27c33609aadf',
    'cc1a6b6c-dcfc-4f6c-999d-31b2a395501a'
  );

--    5 rows -> Dancers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2031.00'
where id in (
    '1539cdc0-bd03-4a49-b0db-b61f321ec79a',
    '2a0e4de7-eea7-4da2-b191-475dffb4cd8b',
    '2d2ddab8-a75e-4dc5-be21-53c8617d3339',
    '57923e76-5fd8-4009-b97f-9c96693c6d8a',
    '9f0444b9-032d-44f8-86fe-dbbc9f52a61a'
  );

--    5 rows -> Computer Network Architects
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1241.00'
where id in (
    '2d56e71b-ceb7-42b9-b91d-c8345afb0137',
    '386a345a-a7dd-4058-ae52-7355e4978403',
    '42179daf-40f9-41d9-ae1a-3755b2c06a99',
    '75d8bd15-c844-409e-8a60-f9c4ac140dcf',
    '7ac93521-47c9-4f11-b61a-0493cac2ca30'
  );

--    5 rows -> Preschool Teachers, Except Special Education
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2011.00'
where id in (
    '30e1774d-8d65-4a66-a1c6-423544e11ea0',
    '33bf407c-a9b2-49fb-b18a-56b65835d600',
    '49a44361-b4a1-4dfa-987f-e8aa54a829c1',
    '99e684c7-8a72-49c2-b76d-1a4c7311528c',
    'f9040c9e-4c87-47cd-9732-199c00b46260'
  );

--    4 rows -> Aerospace Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2011.00'
where id in (
    '0eb83a9d-cb38-445d-b7b0-fb9ba8b060f9',
    '69e0e2a3-20f6-47d0-88c8-c0937bf32f57',
    '83e1ccdc-96e4-47f5-840b-483de50dffe8',
    'd1f4f76b-7c0b-43f9-b846-da4ef8f7e985'
  );

--    4 rows -> Materials Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2131.00'
where id in (
    '1a4f0804-8973-43da-85b1-61e42ff3fd98',
    '31a91a38-d915-4511-81f5-16f218416150',
    '9175a960-ff10-4a2e-9b5a-1ebd0a799b69',
    'cbfb113d-d5d5-41c9-a016-27727bd26878'
  );

--    4 rows -> Social and Human Service Assistants
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1093.00'
where id in (
    '1daf50ee-fd62-47e0-a99b-5979c2cf63ec',
    '460f86e2-c110-4eb8-9ffe-b804b50d7e64',
    'c68b1546-2bbe-4923-abeb-6a8b82388510',
    'fd2d952c-6f64-4fa1-baaa-558c2413c4d0'
  );

--    4 rows -> Social and Community Service Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9151.00'
where id in (
    '1f02feb9-a71f-4294-81a9-b6d9db766701',
    '367f83b3-9d86-460e-823c-7411e792147e',
    '4f631822-995b-482c-81f1-fd9fab3c6c90',
    'c2f65487-c303-4eb4-a2e2-1b24e929425a'
  );

--    4 rows -> Inspectors, Testers, Sorters, Samplers, and Weighers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/51-9061.00'
where id in (
    '1fb69573-c66d-4bc1-af58-e091797e6c67',
    '2a8b3c3a-fe5c-4213-9648-a648f92e6df8',
    '6e3254b0-d3eb-472d-bfd6-f7ed66766a85',
    'da403941-5334-4841-855b-0aaa6a8db46b'
  );

--    4 rows -> Construction and Building Inspectors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-4011.00'
where id in (
    '40cc6a7e-0f77-4fe8-a057-0b099fb5e134',
    '491804ca-ae4d-40ab-becd-5e27275f7cad',
    '4d6d119f-b9f7-4c2b-a56c-91adf2660f2f',
    '88fa820b-1d18-4fbc-ac65-51940848c692'
  );

--    4 rows -> Arbitrators, Mediators, and Conciliators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-1022.00'
where id in (
    '50612465-a1d6-44c8-8c15-da10ee44d162',
    '6f1a58ae-54c0-4745-affc-993b6dd23498',
    'a6cac919-81f6-4976-b07e-6e77409ee71e',
    'ed9a1549-4304-4ff8-9616-7a785ae194b9'
  );

--    4 rows -> Forensic Science Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4092.00'
where id in (
    '7150660e-6fa0-4dfe-8fbf-0c89672d85f1',
    '831af686-ce38-487d-b618-81db4b77b15a',
    'af122fb3-36a7-44b2-b6dd-ef888851d97e',
    'd2e01a4a-dc00-4a10-862f-9a75f3e47960'
  );

--    4 rows -> Insurance Sales Agents
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-3021.00'
where id in (
    '7c8df8e9-ef96-44c4-91c3-2d0c95d61dfe',
    '8d3052df-59ba-4c34-b277-385bebb3a480',
    'bd3e0907-990c-4da8-a62e-3ea257808ca0',
    'c54077f3-433e-4538-bb4c-99500d6cdc57'
  );

--    3 rows -> Interior Designers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1025.00'
where id in (
    '01635b04-ee65-4226-ad82-d63b678f1e96',
    '93e79c50-87c3-4ba5-a933-55e1a5b956f4',
    'a0a405ab-00cd-47e5-8efb-3c05509954fb'
  );

--    3 rows -> Coaches and Scouts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00'
where id in (
    '047a06fe-d425-48db-b5de-f07ed58ab7c1',
    '1dc589ae-921e-4b0d-9180-99af36b75108',
    '9b55268a-9b55-4a1e-b5cd-401ad71a75e3'
  );

--    3 rows -> Water and Wastewater Treatment Plant and System Operators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/51-8031.00'
where id in (
    '0589b3ae-6d82-4c3e-8b8d-86cfe1225566',
    '194c0280-d417-4860-90e2-9f3ab0ac0077',
    '9643687d-f457-4be9-bf61-9bea2be0a4e7'
  );

--    3 rows -> Photographers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4021.00'
where id in (
    '083620be-f921-457e-a60d-c38ca45106a6',
    '9c471afd-e499-4ade-8f1a-2359df114e55',
    'f59e707c-698d-4682-9753-a7b847a301fd'
  );

--    3 rows -> Producers and Directors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2012.00'
where id in (
    '09130ec2-bb45-4968-80ad-724edd6a37d9',
    '32d5647c-7d21-4f17-bb1b-556d40e2247a',
    'd6870ca3-95d1-471f-a770-50a40b0a81ab'
  );

--    3 rows -> Counselors, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1019.00'
where id in (
    '11229476-7970-4e67-90b4-38e7087649dd',
    '818fb1ed-e2a2-41ae-9327-2d53035be8b3',
    'a406679d-1b3b-4bc4-9f42-afca0ca68ca6'
  );

--    3 rows -> Solar Photovoltaic Installers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-2231.00'
where id in (
    '129996b1-dae7-47c1-bf01-59124bfa14aa',
    '40eb1ed2-2d4b-4f2a-a727-e35ca6719699',
    '79ccf4a0-7188-4488-8f3d-ce2892d41e54'
  );

--    3 rows -> Probation Officers and Correctional Treatment Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1092.00'
where id in (
    '14194f31-358e-40f5-94a7-44a3438ffad1',
    '2d94d89c-a576-4fde-81c8-1395f772ad7a',
    '62a7c1b7-a77d-429e-90e1-b433bdfc9590'
  );

--    3 rows -> Landscape Architects
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-1012.00'
where id in (
    '18be9e47-fa5d-4826-9ee7-943236195a2f',
    '7a351fc0-03e9-4d71-82c1-6aaa188ebd69',
    '975525b0-f4ea-4054-8a93-a54850e639e1'
  );

--    3 rows -> Music Directors and Composers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2041.00'
where id in (
    '1a04432b-2be1-44df-916b-c57d21689499',
    '74bade0c-b724-46a3-8731-c0c85c8bcaf0',
    'fb910e43-c218-44c9-a1d3-cef543db480e'
  );

--    3 rows -> Childcare Workers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-9011.00'
where id in (
    '30ebdcbb-07ac-441b-b9cb-67afe4216b08',
    '33339414-d8fd-4081-8767-715adafde615',
    'ddc91fb4-c0cf-43f8-aea1-542fc0facaa4'
  );

--    3 rows -> Security Guards
update public.careers set source_url = 'https://www.onetonline.org/link/summary/33-9032.00'
where id in (
    '3ce9d562-1a9a-4144-a167-ade1406f87a3',
    '9827ad95-dd35-4cf5-8b59-b287a3169e70',
    'b5d095b0-1bd3-4cf8-b6fa-a24d1f3f84e3'
  );

--    3 rows -> Environmental Science and Protection Technicians, Including Health
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4042.00'
where id in (
    '42094529-e108-4676-b8a1-13c1f5c8d803',
    '64e82fb5-10f9-449a-ac7a-34b3d01510e3',
    '808fe4dc-9f3a-4763-8ab2-04f725f422ef'
  );

--    3 rows -> Real Estate Brokers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-9021.00'
where id in (
    '5116cd22-2913-4cbe-bf55-ba8a7074056d',
    '91543ba0-765d-40e2-8574-fee053453ba1',
    'b003a683-3ee5-47cf-b1bf-f6d2779bb1d7'
  );

--    3 rows -> Librarians and Media Collections Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-4022.00'
where id in (
    '729e450e-9f46-4b80-a966-52d1a1be7f83',
    'db2d0c44-9dda-4044-a85e-a957ff02d8de',
    'ebd9753d-ed21-4dbe-ad04-3d5fa664515e'
  );

--    3 rows -> Psychologists, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3039.00'
where id in (
    '74edbcaa-b305-412a-96eb-5e31738b6524',
    '77ca43aa-e92f-46b9-bf63-523a10dd38d3',
    'ec0f3a5c-94bb-4b75-9c46-df41477b18c1'
  );

--    3 rows -> Medical and Health Services Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9111.00'
where id in (
    '7bf5ecbf-b288-4ada-8132-3035ec9da1f2',
    'c95af0a4-8eaf-40c7-85f0-116361089f57',
    'ddc934d7-12a8-425a-bb86-5c1f63eae865'
  );

--    3 rows -> Bioengineers and Biomedical Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2031.00'
where id in (
    'e1fd18fb-2b7b-48d0-ac2e-4902ee4fc148',
    'e21ba8ab-eb8c-4b03-912f-16e24e4992f9',
    'f1a745a8-fcfc-4ac4-a7d1-f1fb8482b1b7'
  );

--    2 rows -> Travel Guides
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-7012.00'
where id in (
    '090531aa-7b21-4a22-bb7b-ba98e9ec3ce8',
    'bd35318a-815f-495c-b9b1-d3fafaa13c42'
  );

--    2 rows -> Human Resources Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1071.00'
where id in (
    '1c896db8-9232-4241-8efc-6c5d1883931f',
    '638eda61-4fdd-462b-8dc3-b787fe7f5263'
  );

--    2 rows -> Training and Development Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1151.00'
where id in (
    '2d7e99e8-d17d-4672-b1b3-db6ca3df9cde',
    'e36e0030-bce9-4b89-8b44-ab38fedc6905'
  );

--    2 rows -> Mechanical Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2141.00'
where id in (
    '36361570-b9d9-4a01-9435-c069a2d1d257',
    '36d61545-c9ef-4549-8a93-7292116c927e'
  );

--    2 rows -> Education Administrators, Kindergarten through Secondary
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9032.00'
where id in (
    '3f230d4a-c3c5-4fc6-b8eb-95a3caafcb63',
    '8621f068-4dd2-4265-929a-572b6b5f6406'
  );

--    2 rows -> Art Directors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1011.00'
where id in (
    '3f45fb90-0589-4556-87fa-d0323a7df4a1',
    'fc53dc0d-0883-4e8d-aced-70c27a05750b'
  );

--    2 rows -> Epidemiologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1041.00'
where id in (
    '44a6db57-9af0-4544-81c9-3518da3442d3',
    'b04b2d40-b35e-4323-beb7-7529dd03d270'
  );

--    2 rows -> Anthropologists and Archeologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3091.00'
where id in (
    '50ba2f82-c0c8-4db9-8aee-da1c7ea1eee5',
    '9bf1bcdb-68fa-4c4a-8e88-c712a1b67975'
  );

--    2 rows -> Personal Care and Service Workers, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-9099.00'
where id in (
    '52acd84e-115b-4c79-a84c-87c49f4dda3a',
    'daddbf03-87c1-4106-86dc-0a5615db9bff'
  );

--    2 rows -> Occupational Health and Safety Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-5011.00'
where id in (
    '54aaa258-7974-4445-bbb7-a1f2d8e80880',
    'a3696b74-dd59-4315-8cda-8e963602181a'
  );

--    2 rows -> Lodging Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9081.00'
where id in (
    '55c49de1-01b6-4ca2-85a6-8974e1f2ebaa',
    'b8790739-db13-4b86-bc5c-bd9efdf7fc33'
  );

--    2 rows -> Elementary School Teachers, Except Special Education
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2021.00'
where id in (
    '5b45bc6c-f8c3-4a0d-863a-e24f7d742dda',
    'a39b6aa4-d286-4bd7-aa51-9aaaf9daa931'
  );

--    2 rows -> Logisticians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1081.00'
where id in (
    '5cf46f35-ba4a-4104-87ba-a4c9e718433c',
    '6bc29fb9-fc24-482b-b6b1-b177aa8a69e3'
  );

--    2 rows -> Database Administrators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1242.00'
where id in (
    '699e0b78-7ebb-4279-ac3b-2e41b3123941',
    '9b9e4ed1-761c-4163-94d2-1b931f37ec45'
  );

--    2 rows -> Computer Programmers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1251.00'
where id in (
    '70df0734-3fcd-4634-a27f-f35ad108e3b6',
    'a49a31a7-16be-42b9-aace-44df6e3c183f'
  );

--    2 rows -> Market Research Analysts and Marketing Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1161.00'
where id in (
    '9d2aed03-05b6-4716-8b2e-d2c50f049b6e',
    'ed719a28-9cf2-4476-877d-d8cb1eedd6e5'
  );

--    2 rows -> Heating, Air Conditioning, and Refrigeration Mechanics and Installers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/49-9021.00'
where id in (
    '9f636777-7ce4-419e-91ab-c0e0ee5edb94',
    'f06be77a-0ece-4dbf-86ef-d928ab8b78dd'
  );

--    2 rows -> Advertising and Promotions Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2011.00'
where id in (
    'a0135d78-2c50-4ce7-a36c-da42e57eb046',
    'b35d6631-0bd7-43f7-97ad-3a3f6a9717d6'
  );

--    2 rows -> Construction Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9021.00'
where id in (
    'a8037472-24c4-48b3-aefa-eb4ac4299140',
    'cd3d082d-7bfe-4a21-b8b6-e409afdf0657'
  );

--    2 rows -> Cooks, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/35-2019.00'
where id in (
    'b62d7ad4-6247-459f-9899-fdcb3b9b073e',
    'f1022267-d7e4-42f8-a70a-8c25fc33a63b'
  );

--    2 rows -> Recreational Therapists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1125.00'
where id in (
    'b814a04f-88ec-4c5e-ab90-a09bbcc4741f',
    'e762e773-8edb-476a-a278-ad012c4e004e'
  );

--    2 rows -> Executive Secretaries and Executive Administrative Assistants
update public.careers set source_url = 'https://www.onetonline.org/link/summary/43-6011.00'
where id in (
    'bd90c588-05f4-4323-9fbe-6e5cc24c3e46',
    'cccd6e67-c920-4ed1-b79a-0e0d20d0e013'
  );

--    2 rows -> Financial Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3031.00'
where id in (
    'c59c7f77-fcd9-4bb0-9ec6-10a3a820bdbc',
    'eb8e9780-e3cb-443e-8569-cb3513a80dbd'
  );

--    2 rows -> Industrial Production Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3051.00'
where id in (
    'ce853cac-a5f7-4aff-91cb-298173cc03c5',
    'dfcbb2e6-cc88-426a-840a-3b956f220250'
  );

--    2 rows -> Microbiologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1022.00'
where id in (
    'ea8f62f3-4bda-42d8-b395-23e761fb9abc',
    'f70fbae2-d55f-4672-b85c-06fa62f5af26'
  );

--    1 rows -> Bookkeeping, Accounting, and Auditing Clerks
update public.careers set source_url = 'https://www.onetonline.org/link/summary/43-3031.00'
where id in (
    '004abf80-e209-4d02-b12b-8027f8671b15'
  );

--    1 rows -> Physical Therapists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1123.00'
where id in (
    '06dfa212-98be-4fa4-bcd7-3111936f6eea'
  );

--    1 rows -> Wind Turbine Service Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/49-9081.00'
where id in (
    '0a361d95-0cea-40e5-aa56-f82c0a21b8b3'
  );

--    1 rows -> Radiation Therapists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1124.00'
where id in (
    '0da8aa7c-6128-423f-9408-19983e99a53e'
  );

--    1 rows -> Rehabilitation Counselors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1015.00'
where id in (
    '106f5610-6b70-4a43-95f2-8fca5c870b2a'
  );

--    1 rows -> Orthotists and Prosthetists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2091.00'
where id in (
    '249075fe-4df4-4c1c-a664-0d061c3b6fa1'
  );

--    1 rows -> Nuclear Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2161.00'
where id in (
    '2683c9b9-a478-4682-b810-8e067dae6aad'
  );

--    1 rows -> Cost Estimators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1051.00'
where id in (
    '294ff40d-c7ec-426c-8f8f-6ddb7aa55a68'
  );

--    1 rows -> Teaching Assistants, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9049.00'
where id in (
    '321dd5ed-7bab-4490-9435-d86381b082be'
  );

--    1 rows -> Bakers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/51-3011.00'
where id in (
    '3300a681-5c81-4b1b-92b5-dd0ff5b8a611'
  );

--    1 rows -> Travel Agents
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-3041.00'
where id in (
    '3ce79dd1-e058-4d3c-ad46-7dd1e64f7745'
  );

--    1 rows -> Speech-Language Pathologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1127.00'
where id in (
    '4069a294-f4c1-4413-9cae-8d277cfb1bb0'
  );

--    1 rows -> Cartographers and Photogrammetrists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-1021.00'
where id in (
    '41399be9-0a54-45f9-b568-cfb5038e52a2'
  );

--    1 rows -> Conservation Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1031.00'
where id in (
    '42eba046-dee2-4f75-b9e9-9903ae442d19'
  );

--    1 rows -> Court Reporters and Simultaneous Captioners
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3092.00'
where id in (
    '456f1def-49c1-40d6-af76-9d0d3edf18b0'
  );

--    1 rows -> Appraisers and Assessors of Real Estate
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-2023.00'
where id in (
    '49901fcb-f247-48c7-83e5-dbfb740fc7fb'
  );

--    1 rows -> Military Officer Special and Tactical Operations Leaders, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/55-1019.00'
where id in (
    '4c02782e-e221-4cf0-b43a-6da4d104b69a'
  );

--    1 rows -> Health and Safety Engineers, Except Mining Safety Engineers and Inspectors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2111.00'
where id in (
    '53371a1e-23da-4a0d-858f-62ce3fd15d58'
  );

--    1 rows -> Compliance Officers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1041.00'
where id in (
    '5aa6010e-263a-4b78-a056-bde1159906b5'
  );

--    1 rows -> Substance Abuse and Behavioral Disorder Counselors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1011.00'
where id in (
    '6464723e-a698-4de9-a191-73bf44d04dfb'
  );

--    1 rows -> Hazardous Materials Removal Workers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-4041.00'
where id in (
    '68c5d305-0775-49fc-b43f-0c8105505677'
  );

--    1 rows -> Purchasing Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3061.00'
where id in (
    '6bcc9421-fe07-40c2-8bcc-446dc443ff1f'
  );

--    1 rows -> Medical Equipment Repairers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/49-9062.00'
where id in (
    '71fa69d9-4bd7-4e5c-acd2-36e18ed90281'
  );

--    1 rows -> Middle School Teachers, Except Special and Career/Technical Education
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2022.00'
where id in (
    '76383bd0-4911-42d3-9b4b-592a75de3dc7'
  );

--    1 rows -> Urban and Regional Planners
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3051.00'
where id in (
    '778ed806-9390-4737-be80-c2db6b0619bb'
  );

--    1 rows -> Computer and Information Research Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1221.00'
where id in (
    '7a93880d-b207-4be8-af69-f7366f90a822'
  );

--    1 rows -> Jewelers and Precious Stone and Metal Workers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/51-9071.00'
where id in (
    '7e4ef508-660b-4160-ae99-27c04fb2661e'
  );

--    1 rows -> Food Preparation and Serving Related Workers, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/35-9099.00'
where id in (
    '7e96ff76-bd51-4fd1-8580-dd99c1d99364'
  );

--    1 rows -> Set and Exhibit Designers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1027.00'
where id in (
    '7f3384e0-9acf-4148-8226-b0222a36e522'
  );

--    1 rows -> Broadcast Announcers and Radio Disc Jockeys
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3011.00'
where id in (
    '86c450e4-0359-4c48-a3b5-6bfaeb491a0f'
  );

--    1 rows -> Medical and Clinical Laboratory Technologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where id in (
    '8aa80063-5feb-464a-b546-91d377e54b90'
  );

--    1 rows -> Budget Analysts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-2031.00'
where id in (
    '9070ba23-beff-4756-9a30-1caf76325ed4'
  );

--    1 rows -> Recreation Workers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-9032.00'
where id in (
    '973e106a-e408-4163-aece-4b4770363224'
  );

--    1 rows -> Registered Nurses
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1141.00'
where id in (
    '982c8a3d-649f-474f-8060-185d6fad6c9a'
  );

--    1 rows -> Private Detectives and Investigators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/33-9021.00'
where id in (
    '9dfd17c8-4254-4a66-8ac5-190a7bbe7a2b'
  );

--    1 rows -> Exercise Physiologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1128.00'
where id in (
    'a011b447-109b-44d6-9165-2466d0516c68'
  );

--    1 rows -> Buyers and Purchasing Agents, Farm Products
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1021.00'
where id in (
    'a5033969-7db4-4475-8926-2e78b1dc7d59'
  );

--    1 rows -> Chemical Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2041.00'
where id in (
    'a884e63f-dc43-43dd-8bd7-c04f103d2b0b'
  );

--    1 rows -> Audiologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1181.00'
where id in (
    'aac1511a-c76d-498e-aa36-8afacdb1340e'
  );

--    1 rows -> Marriage and Family Therapists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1013.00'
where id in (
    'b061f220-ff0e-452b-b33f-19b57705ee67'
  );

--    1 rows -> Surgical Technologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2055.00'
where id in (
    'b11e6232-8c43-4a01-96fe-e9152b3fcb1c'
  );

--    1 rows -> Meeting, Convention, and Event Planners
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1121.00'
where id in (
    'b5947c91-231b-4a18-a42a-8d39a8c27449'
  );

--    1 rows -> Interpreters and Translators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3091.00'
where id in (
    'b6c7e000-1d1e-4c62-b6c4-c8d7ba6aac61'
  );

--    1 rows -> Dietitians and Nutritionists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1031.00'
where id in (
    'bf619474-9359-45e3-b8d8-76f0c302c9ef'
  );

--    1 rows -> First-Line Supervisors of Mechanics, Installers, and Repairers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/49-1011.00'
where id in (
    'c01f6088-5a86-4e2d-88ba-cca5cfc4125b'
  );

--    1 rows -> Compensation and Benefits Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3111.00'
where id in (
    'c3c25ad5-ba07-47a7-8866-d2ff5dfcf64a'
  );

--    1 rows -> Athletic Trainers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-9091.00'
where id in (
    'c607b90c-0f50-42df-a7a4-b780da8c1b85'
  );

--    1 rows -> Grounds Maintenance Workers, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/37-3019.00'
where id in (
    'd177347c-50d3-46bd-84fc-21fe3af24da3'
  );

--    1 rows -> Political Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3094.00'
where id in (
    'dd4e4089-cb77-4057-a91f-323cd1d4f378'
  );

--    1 rows -> Umpires, Referees, and Other Sports Officials
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2023.00'
where id in (
    'e0ebf060-11ac-4490-89c4-2e0808329bc7'
  );

--    1 rows -> Insurance Underwriters
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-2053.00'
where id in (
    'e7495886-f28b-4ca6-b8b7-bbb0676f5de9'
  );

--    1 rows -> Project Management Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1082.00'
where id in (
    'e795338b-d01b-4697-82cf-012a9fad4519'
  );

--    1 rows -> Emergency Management Directors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9161.00'
where id in (
    'e798972c-638e-434f-a250-b90b50b5a2ed'
  );

--    1 rows -> Sociologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3041.00'
where id in (
    'ebc40dce-b162-44d9-bf0f-88c930a1facf'
  );

--    1 rows -> Commercial and Industrial Designers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1021.00'
where id in (
    'ef6b5b9a-13b1-4ddf-90e0-fec4a0e100a8'
  );

--    1 rows -> Petroleum Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2171.00'
where id in (
    'f7d6be25-7b65-4f94-9612-73a117e2a6f9'
  );

--    1 rows -> Manicurists and Pedicurists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-5092.00'
where id in (
    'f83fd63d-5698-40bc-86ef-b6a04eb4fb42'
  );

--    1 rows -> Elevator and Escalator Installers and Repairers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-4021.00'
where id in (
    'f8b9a181-a458-4354-8443-07804cf71be6'
  );

--    1 rows -> Property, Real Estate, and Community Association Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9141.00'
where id in (
    'f8be7841-5eda-41d0-ae55-c50c231ef74f'
  );

--    1 rows -> Craft Artists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1012.00'
where id in (
    'f8bef1df-bae2-4a90-9f7d-cacc0eb0a1f8'
  );

--    1 rows -> Financial Examiners
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-2061.00'
where id in (
    'fa43e888-2e83-403d-8981-64672fac2b9e'
  );

--    1 rows -> Surveyors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-1022.00'
where id in (
    'fc946614-8316-47be-bf30-ef5901dcedda'
  );

--    1 rows -> Mining and Geological Engineers, Including Mining Safety Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2151.00'
where id in (
    'fe5aeb9f-fab6-47c3-8c07-30cdb305955d'
  );

--    1 rows -> Concierges
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-6012.00'
where id in (
    'fe8455b6-bbf7-4a26-8015-06723bf2e2eb'
  );

commit;
