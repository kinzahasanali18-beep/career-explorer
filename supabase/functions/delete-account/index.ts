// ─── delete-account ───────────────────────────────────────────────────────────
// Permanently deletes the calling user's account and all their data.
//
// This has to run server-side: removing the auth.users row requires
// auth.admin.deleteUser(), which needs the service_role key. That key bypasses
// RLS for every user in the project and must never reach the browser bundle —
// so the client can only ever delete its own table rows, never the account
// itself. Before this function existed, "Delete my account" removed nothing at
// all: public.profiles has no DELETE policy, so the client's delete was denied
// by RLS and reported as a successful no-op.
//
// Because it runs as service_role, RLS is bypassed and no DELETE policies are
// needed on any table.
//
// Security: the user id comes from the *verified* JWT, never from the request
// body. Trusting a body parameter would let any signed-in user delete anyone.
//
// Deploy: see README.md in this directory.

// Pinned to the same supabase-js version the app uses. Deno 2's lint prefers a
// bare specifier backed by a deno.json import map, but Supabase Edge Functions
// resolve a fully-qualified URL everywhere, whereas import-map pickup varies by
// CLI version — and a module that fails to resolve at deploy time is a far
// worse outcome than a style warning. Keeping the explicit URL deliberately.
// deno-lint-ignore no-import-prefix
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.102.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  // Supabase injects SUPABASE_SERVICE_ROLE_KEY automatically; SERVICE_ROLE_KEY
  // is a fallback for projects where it's set manually as a function secret.
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error("delete-account: missing environment configuration");
    return json({
      error: "Account deletion is not configured. Please contact support.",
    }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Not signed in." }, 401);

  // ── Identify the caller from their JWT ──────────────────────────────────────
  // getUser() validates the token against the auth server rather than merely
  // decoding it, so an expired or forged token fails here.
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return json(
      { error: "Your session has expired. Sign in again and retry." },
      401,
    );
  }

  // ── Delete everything, as service_role (RLS bypassed) ───────────────────────
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Order matters. Dependent rows go first so that a failure part-way through
  // leaves the account intact and retryable, rather than deleting the auth user
  // and orphaning rows that nobody can reach afterwards. Every step is a
  // delete, so the whole function is idempotent and safe to retry.
  const { error: savedError } = await admin
    .from("saved_careers")
    .delete()
    .eq("user_id", user.id);
  if (savedError) {
    console.error("delete-account: saved_careers delete failed", savedError);
    return json({
      error:
        "Couldn't delete your saved careers. Nothing was removed — please try again.",
    }, 500);
  }

  const { error: profileError } = await admin
    .from("profiles")
    .delete()
    .eq("id", user.id);
  if (profileError) {
    console.error("delete-account: profiles delete failed", profileError);
    return json(
      { error: "Couldn't delete your profile. Please try again." },
      500,
    );
  }

  const { error: deleteUserError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteUserError) {
    console.error("delete-account: auth user delete failed", deleteUserError);
    return json({
      error: "Couldn't delete your sign-in record. Please try again.",
    }, 500);
  }

  return json({ success: true }, 200);
});
