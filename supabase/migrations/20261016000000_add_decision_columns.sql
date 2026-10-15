-- Add source_type, visible, and duplicate_of columns to public.careers.
-- Additive only: no column is dropped, renamed, or retyped.
--
-- source_type: nullable text, restricted to 'related' or 'emerging' by a
-- CHECK constraint. NULL means not yet classified -- this migration does not
-- backfill it for any existing row.
--
-- visible: boolean NOT NULL DEFAULT true. Postgres 11+ stores a constant
-- DEFAULT as table metadata rather than rewriting every row, so every
-- existing row reads as visible = true immediately, with no table rewrite.
--
-- duplicate_of: nullable uuid, self-referencing careers(id), ON DELETE SET
-- NULL (never CASCADE) -- deleting a career never cascades into deleting
-- whatever row points at it as a duplicate. A CHECK constraint additionally
-- rules out a row marking itself as its own duplicate.
--
-- RLS: no policy change needed. public.careers has two existing policies --
-- "Public can read careers" (USING (true), for SELECT) and "Service role
-- full access" (for service_role, all commands) -- both are row-level, not
-- column-scoped, so they already cover these new columns for every existing
-- role without modification.
--
-- Note: an earlier, never-applied migration
-- (20260819000000_add_careers_visible_column.sql) already proposed a
-- standalone `visible boolean not null default true` column with the same
-- definition. This migration's `if not exists` guards make it safe to run
-- whether or not that one ever gets applied, and it supersedes it.

alter table public.careers
  add column if not exists source_type text,
  add column if not exists visible boolean not null default true,
  add column if not exists duplicate_of uuid references public.careers(id) on delete set null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'careers_source_type_check' and conrelid = 'public.careers'::regclass
  ) then
    alter table public.careers
      add constraint careers_source_type_check
      check (source_type is null or source_type in ('related', 'emerging'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'careers_duplicate_of_not_self_check' and conrelid = 'public.careers'::regclass
  ) then
    alter table public.careers
      add constraint careers_duplicate_of_not_self_check
      check (duplicate_of is null or duplicate_of <> id);
  end if;
end $$;

create index if not exists careers_duplicate_of_idx on public.careers (duplicate_of) where duplicate_of is not null;

comment on column public.careers.source_type is
  'Classification for careers without a confident O*NET citation: ''related'' (linked to the closest occupation) or ''emerging'' (no link, a recognized role with no O*NET code yet). NULL = not yet classified.';
comment on column public.careers.visible is
  'Whether this career is shown to students. Default true.';
comment on column public.careers.duplicate_of is
  'If set, this row is considered a duplicate of another careers row (self-reference). ON DELETE SET NULL: deleting the referenced row never cascades a delete here.';
