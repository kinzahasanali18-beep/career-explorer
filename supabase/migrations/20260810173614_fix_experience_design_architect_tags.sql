-- Second batch of keyword-collision fixes (audit report Q4 follow-up).
--
-- Three rows the first migration's keyword filter missed, plus one correction.
-- All four are experience/UX design roles, and the table already categorises
-- their near-twins under Design & Creative:
--
--   Experience Architect        <- 'Experience Architect (UX)'          is Design & Creative
--   Information Architect       <- 'Information Architecture Designer'  is Design & Creative
--   Metaverse Architect         <- 'Metaverse Experience Designer'      is Design & Creative
--   Virtual Reality Architect   <- 'Augmented Reality Experience Designer' is Design & Creative
--
-- Information Architect was set to Tech & Engineering by the previous migration;
-- this supersedes that, matching how the rest of the table treats UX work.
--
-- Not guarded on a single prior value because the four rows start from two
-- different ones (three Architecture & Urban Planning, one Tech & Engineering);
-- pinning by id keeps it precise, and re-running is a no-op.
-- Revert: reports/q4b_revert.sql

begin;

update public.careers
set primary_industry = 'Design & Creative'
where id in (
    'e54734bf-cbb9-4d58-a2d7-9e94d63aa77d',  -- Experience Architect (was: Architecture & Urban Planning)
    '1bd40894-8a80-441f-9fba-1a00c3025c6e',  -- Metaverse Architect (was: Architecture & Urban Planning)
    'ace61410-e798-44af-9266-5228db32d3e6',  -- Virtual Reality Architect (was: Architecture & Urban Planning)
    '1e385456-6895-46cf-af1c-5f17705d94d4'  -- Information Architect (was: Tech & Engineering)
  );

commit;

-- Still outstanding, found while checking precedent for these four:
--   UX roles are split inconsistently across two industries. 'User Experience
--   Designer', 'User Experience (UX) Designer', 'User Experience Researcher',
--   'Interaction Designer' and 'Product Designer' sit under Science & Research,
--   while their near-identical twins ('UX Writer', 'UX Motion Designer',
--   'Interaction Designer (UX)', 'Digital Product Designer') sit under
--   Design & Creative. Science & Research is wrong for all of them.
--   Other strays seen nearby: 'Virtual Reality Creator' -> Environment &
--   Sustainability, 'Augmented Reality Developer' -> Hospitality & Events,
--   'Service Design Consultant' -> Healthcare & Medicine.
