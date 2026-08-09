# delete-account

Permanently deletes the calling user's account and all their data:
`saved_careers` rows → `profiles` row → the `auth.users` record.

## Why this exists

Removing the `auth.users` row requires `auth.admin.deleteUser()`, which needs
the **service_role** key. That key bypasses RLS for every user in the project,
so it can never ship in the browser bundle — meaning the client can delete its
own table rows at most, never the account itself.

Before this function, "Delete my account" removed **nothing**: `public.profiles`
has no DELETE policy, so PostgREST denied the client's delete and reported it as
a successful no-op (`204`, zero rows). The `auth.users` row and every
`saved_careers` row were left behind, and signing in again with the same email
restored the account with all its starred careers intact.

## No RLS changes needed

The function runs as service_role, which bypasses RLS entirely. You do **not**
need to add a DELETE policy to `profiles`. (`saved_careers` already has one; it
just wasn't being used.)

## Deploy

The repo has no `supabase/config.toml` yet, so start with `init`. It will not
overwrite the two existing SQL files.

```bash
# 1. One-time, from the repo root
supabase init

# 2. Link to the project (find the ref in Dashboard → Project Settings → General)
supabase link --project-ref <your-project-ref>

# 3. Deploy
supabase functions deploy delete-account
```

### Secrets

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are injected
into Edge Functions automatically — **no secrets to set in the normal case.**

If your project doesn't inject `SUPABASE_SERVICE_ROLE_KEY`, the function falls
back to a manually-set `SERVICE_ROLE_KEY`:

```bash
supabase secrets set SERVICE_ROLE_KEY=<service_role key from Project Settings → API>
```

Never put that key in `.env.local` or anywhere the Vite client can read it —
anything prefixed `VITE_` is compiled into the public bundle.

### JWT verification

Supabase verifies the caller's JWT before the function runs (`verify_jwt`
defaults to true). The function *also* calls `getUser()` to validate the token
and derive the user id from it. Both matter: the id must come from the verified
token and never from the request body, or any signed-in user could delete
another user's account.

Do not set `verify_jwt = false` for this function.

## Verifying it works

After deploying, from the app: Profile → Delete my account → Yes, delete
everything. Then check in the SQL editor, substituting the user's id:

```sql
select (select count(*) from auth.users      where id = '<uuid>') as auth_rows,
       (select count(*) from public.profiles where id = '<uuid>') as profile_rows,
       (select count(*) from public.saved_careers where user_id = '<uuid>') as saved_rows;
```

All three should be `0`. Then confirm that signing in again with the same email
creates a genuinely new, empty account rather than restoring the old one — that
is the check that actually distinguishes this fix from the old behaviour.

## Failure behaviour

Deletes run dependent-rows-first, so a failure part-way through leaves the
account intact and the operation retryable, rather than deleting the auth user
and orphaning unreachable rows. Every step is a delete, so the function is
idempotent — retrying after a partial failure is safe.

The client surfaces the returned message inline and re-enables the button; it
only signs out after a `200`.
