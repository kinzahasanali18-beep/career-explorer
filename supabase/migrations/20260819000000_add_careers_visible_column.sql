-- Add a visibility flag to public.careers.
--
-- Phase 4 verification classified every career against O*NET, CareerOneStop and
-- BLS, but deliberately does NOT set this column for any row. Adding it with a
-- default of true means nothing changes for students until a later, reviewed
-- pass hides specific rows.
--
-- Report: reports/PHASE4_SUMMARY_2026-08-19.md
-- Per-career data: reports/PHASE4_VERIFICATION_2026-08-19.csv
--
-- Safe to re-run: the add is guarded by `if not exists`.

alter table public.careers
  add column if not exists visible boolean not null default true;

comment on column public.careers.visible is
  'Whether this career is shown to students. Default true. Phase 4 verification (2026-08-19) produced a hide/show recommendation per row but did not apply it.';
