-- Revert Q4 primary_industry changes. Restores the exact prior values.
-- Generated before any write was attempted.
begin;
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = 'a778d7fb-5587-4ad9-bc58-b295f93b6a1a';  -- Cloud Architect
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = '386a345a-a7dd-4058-ae52-7355e4978403';  -- Cloud Solutions Architect
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = '699e0b78-7ebb-4279-ac3b-2e41b3123941';  -- Database Architect
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = '1e385456-6895-46cf-af1c-5f17705d94d4';  -- Information Architect
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = 'e3327e1b-fba9-491d-8b29-f6ad1d475f4f';  -- IoT Solutions Architect
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = 'b0a380ca-ec99-418e-b775-14fc85791a9c';  -- Software Architect
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = '7fdd0e73-9311-4596-b770-0071cdd3dd4f';  -- Solutions Architect
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = '99c58209-cc00-4940-a62b-ac89ff737a1b';  -- Systems Architect
commit;
