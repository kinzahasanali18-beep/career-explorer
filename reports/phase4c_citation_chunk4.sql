-- Phase 4c citation fixes, chunk 4 of 4 — 2 rows, 2 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 47-4011.01 Energy Auditors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-4011.01'
where source_url = 'https://www.onetonline.org/link/summary/17-2211.00' and id in (
  'd59a3a38-cef6-4488-a65e-faa83880ff30'
);

-- 47-4011.01 Energy Auditors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-4011.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  'dd4cbeb9-615e-46c7-8875-2cf56e4ed814'
);

commit;
