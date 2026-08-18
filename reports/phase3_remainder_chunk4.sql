-- Phase 3 remainder, chunk 4 of 4 — 3 rows, 3 statements.
-- Subtractive only; guarded on exact current value; idempotent (safe to re-run).

begin;

update public.careers set secondary_industries = 'Hospitality & Events,Business & Finance,Arts & Performance'
where secondary_industries = 'Food & Culinary,Hospitality & Events,Business & Finance,Arts & Performance' and id in (
  'a21b0e51-9052-4f33-95e8-edc77f5d82f4'
);

update public.careers set secondary_industries = 'Business & Finance,Design & Creative,Science & Research'
where secondary_industries = 'Tech & Engineering,Business & Finance,Design & Creative,Science & Research' and id in (
  'aac1511a-c76d-498e-aa36-8afacdb1340e'
);

update public.careers set secondary_industries = 'Food & Culinary,Marketing & Communications'
where secondary_industries = 'Hospitality & Events,Food & Culinary,Marketing & Communications' and id in (
  'c89fac58-78f7-4cf2-9f0f-4902eb12c582'
);

commit;
