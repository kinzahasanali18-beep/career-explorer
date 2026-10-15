-- Revert 20261016000000_add_decision_columns.sql
--
-- Drops the constraints, index, and columns added by that migration, in
-- dependency order. Safe to re-run (every drop is guarded with IF EXISTS).

alter table public.careers drop constraint if exists careers_duplicate_of_not_self_check;
alter table public.careers drop constraint if exists careers_source_type_check;
drop index if exists careers_duplicate_of_idx;
alter table public.careers drop column if exists duplicate_of;
alter table public.careers drop column if exists visible;
alter table public.careers drop column if exists source_type;
