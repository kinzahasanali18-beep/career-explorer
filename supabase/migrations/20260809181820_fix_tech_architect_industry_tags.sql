-- Fix keyword-collision industry tags (audit report Q4).
--
-- Eight technology roles were classified under 'Architecture & Urban Planning'
-- purely because their titles contain the word "architect". Their descriptions
-- are unambiguously software/infrastructure work — cloud infrastructure,
-- database design, software systems — with nothing to do with the built
-- environment.
--
-- Guarded by the current value so this is idempotent and cannot touch rows that
-- have already been corrected or were never affected.
-- Revert: reports/q4_revert.sql

begin;

update public.careers
set primary_industry = 'Tech & Engineering'
where primary_industry = 'Architecture & Urban Planning'
  and id in (
    'a778d7fb-5587-4ad9-bc58-b295f93b6a1a',  -- Cloud Architect
    '386a345a-a7dd-4058-ae52-7355e4978403',  -- Cloud Solutions Architect
    '699e0b78-7ebb-4279-ac3b-2e41b3123941',  -- Database Architect
    '1e385456-6895-46cf-af1c-5f17705d94d4',  -- Information Architect
    'e3327e1b-fba9-491d-8b29-f6ad1d475f4f',  -- IoT Solutions Architect
    'b0a380ca-ec99-418e-b775-14fc85791a9c',  -- Software Architect
    '7fdd0e73-9311-4596-b770-0071cdd3dd4f',  -- Solutions Architect
    '99c58209-cc00-4940-a62b-ac89ff737a1b'  -- Systems Architect
  );

commit;

-- NOT changed here, deliberately, and still outstanding:
--   * All eight rows also carry 'Environment & Sustainability' and
--     'Design & Creative' as secondary tags, which look equally formulaic
--     (Environment & Sustainability makes no sense for a Cloud Architect).
--   * 'Information Architect' is arguably Design & Creative rather than
--     Tech & Engineering — information architecture is a UX discipline, and
--     this app's own taxonomy files UX/UI under Design & Creative.
--   * 349 further rows carry 'Architecture & Urban Planning' as a SECONDARY tag.
