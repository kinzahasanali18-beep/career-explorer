// ─── Per-user device-local storage ────────────────────────────────────────────
// Registry + helpers for the localStorage keys that belong to ONE signed-in
// user: saved deadlines and opportunities, Sparq Mode's skip list / deck
// history / search history, and the per-screen "tour seen" flags.
//
// These were previously written under bare keys ("sparq_when_starred"), so a
// second person signing in on the same device read the first person's data.
// Every key here is now suffixed with the user id, and clearUserStorage()
// removes all of them on sign-out.
//
// NOT in this registry (deliberately):
//   sparq-theme                        — a device preference, not user data
//   ce_screen / ce_industries /
//   ce_profile_industries              — left as-is for now; ce_industries is
//                                        entangled with a separate open bug
//   ce_landing_seen                    — written but never read

// JSON-encoded localStorage access. Both swallow errors so a disabled or full
// localStorage degrades to "no persistence" instead of throwing mid-render.
export function ls(key, fallback) {
  try { const v = localStorage.getItem(key); return v != null ? JSON.parse(v) : fallback; } catch { return fallback; }
}
export function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

// Saved items the user explicitly starred.
export const STARRED_KEYS = {
  deadlines:     "sparq_when_starred",         // [{ type, n, world, timing, one, url }]
  opportunities: "sparq_opportunities_starred", // [{ type, name, industry, … }]
};

// Sparq Mode state.
export const SPARQ_KEYS = {
  skipped:  "sparq_skipped_careers",  // number[] — swiped-left ids, excluded forever
  recent:   "sparq_recently_shown",   // { [id]: "YYYY-MM-DD" } — excluded for 30 days
  clicks:   "sparq_industry_clicks",  // { [industryName]: count } — sidebar-select tally
  daily:    "sparq_daily_set",        // { date: "YYYY-MM-DD", ids: number[] }
  searches: "sparq_search_terms",     // string[] — recent career-search terms (newest first)
};

// "Walkthrough already shown" flags. Keyed by screen id, plus the Sparq Mode
// overlay (which isn't a routed screen).
export const TOUR_KEYS = {
  home:             "ce_explore_tour_seen",
  shortlist:        "ce_shortlist_tour_seen",
  guide:            "ce_guide_tour_seen",
  "when-to-apply":  "ce_wta_tour_seen",
  "hidden-gems":    "ce_gems_tour_seen",
  sparq:            "ce_sparq_tour_seen",
};

// Every per-user key, in one list, so clear/migrate can't drift from the
// call sites.
const USER_KEYS = [
  ...Object.values(STARRED_KEYS),
  ...Object.values(SPARQ_KEYS),
  ...Object.values(TOUR_KEYS),
];

// Scope a key to a user. Without an id we fall back to the bare key rather
// than inventing a shared "anonymous" bucket — nothing in the app reads these
// while signed out, so this only matters as a defensive default.
export function userKey(key, userId) {
  return userId ? `${key}:${userId}` : key;
}

// Per-user equivalents of ls/lsSet.
export function userLs(userId, key, fallback) {
  return ls(userKey(key, userId), fallback);
}
export function userLsSet(userId, key, val) {
  lsSet(userKey(key, userId), val);
}

// Remove everything belonging to `userId`, plus any pre-namespacing leftovers.
// Called on sign-out so nothing survives for the next person on the device.
// Idempotent.
export function clearUserStorage(userId) {
  try {
    USER_KEYS.forEach(key => {
      if (userId) localStorage.removeItem(userKey(key, userId));
      localStorage.removeItem(key); // legacy un-namespaced copy
    });
  } catch { /* localStorage unavailable — nothing to clear */ }
}

// One-time move of pre-namespacing data onto the signed-in user, so existing
// users don't lose their saved deadlines and opportunities on upgrade.
// Removing the original after copying makes this self-terminating: once a
// device has been migrated there is nothing left for a later user to inherit.
// Never overwrites data already stored under the namespaced key.
export function migrateLegacyUserStorage(userId) {
  if (!userId) return;
  try {
    USER_KEYS.forEach(key => {
      const legacy = localStorage.getItem(key);
      if (legacy == null) return;
      const scoped = userKey(key, userId);
      if (localStorage.getItem(scoped) == null) localStorage.setItem(scoped, legacy);
      localStorage.removeItem(key);
    });
  } catch { /* localStorage unavailable — nothing to migrate */ }
}
