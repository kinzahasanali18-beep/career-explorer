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

// Scope a key to a user. With no usable id — first render before auth resolves,
// or a signed-out visitor — the key goes to a distinct "anonymous" namespace.
//
// The bare key is NOT a safe fallback, which is what this used to do. The bare
// key is the pre-namespacing slot that migrateLegacyUserStorage() treats as
// inheritable and copies into the next user who signs in. So anonymous writes
// landing there are adopted by whoever signs in next on that device. That path
// is reachable in normal use: the starred-item toggles and tour flags pass
// `userId` straight through with no guard, and `userId` is `user?.id ?? null`,
// so it is null on the first render before auth resolves.
//
// Anything that is not a usable id — null, undefined, "", whitespace, objects,
// NaN — collapses to the same anonymous namespace rather than stringifying into
// "[object Object]" or a bare "key:" suffix. Keys for a real id are unchanged.
const ANONYMOUS_USER_NS = "anonymous";

export function userKey(key, userId) {
  const id =
    typeof userId === "string" ? userId.trim()
    : typeof userId === "number" && Number.isFinite(userId) ? String(userId)
    : "";
  return `${key}:${id || ANONYMOUS_USER_NS}`;
}

// Per-user equivalents of ls/lsSet.
export function userLs(userId, key, fallback) {
  return ls(userKey(key, userId), fallback);
}
export function userLsSet(userId, key, val) {
  lsSet(userKey(key, userId), val);
}

// Remove everything belonging to `userId`, plus the anonymous bucket and any
// pre-namespacing leftovers. Called on sign-out so nothing survives for the next
// person on the device. Idempotent.
export function clearUserStorage(userId) {
  try {
    USER_KEYS.forEach(key => {
      if (userId) localStorage.removeItem(userKey(key, userId));
      localStorage.removeItem(userKey(key, null)); // anonymous / pre-auth bucket
      localStorage.removeItem(key);                // legacy un-namespaced copy
    });
  } catch { /* localStorage unavailable — nothing to clear */ }
}

// ─── Guest (anonymous) session hygiene ───────────────────────────────────────
// Anonymous data lives under `key:anonymous` (see userKey). Unlike a signed-in
// user's data there is no sign-out to trigger clearUserStorage(), so on a shared
// school or library computer the next guest would otherwise inherit the previous
// guest's saved items.
//
// Trigger choice. beforeunload / pagehide were considered and rejected on two
// counts: they do not fire reliably when a mobile browser discards a background
// tab, and they DO fire on ordinary refresh and on back/forward-cache
// navigation — so clearing there would wipe a guest's data mid-session.
//
// A plain age check also does not fit the threat: any window long enough not to
// disrupt a real session (hours) is far longer than the gap between one person
// closing the browser and the next person opening it (minutes).
//
// So the guest bucket is treated as session-scoped and cleared at the START of a
// new browser session. sessionStorage is the matching primitive — it survives
// refreshes inside a tab but is gone once the tab or browser closes. The
// timestamp is only a backstop for browsers that restore tabs, and with them
// sessionStorage, after being closed.
//
// Known trade-off: sessionStorage is per-tab, so opening a second tab reads as a
// new session and clears the first tab's guest data. Guest data is device-local
// and low-stakes, and a fresh tab starting clean is defensible, but it is a real
// cost of getting the shared-computer case right.

const ANON_SESSION_FLAG = "sparq_anon_session";      // sessionStorage
const ANON_LAST_SEEN = "sparq_anon_last_seen";       // localStorage
const ANON_MAX_AGE_MS = 4 * 60 * 60 * 1000;          // 4h session-restore backstop

// Drop every anonymous-namespaced key. Safe to call at any time; a signed-in
// user's data is in a different namespace and is untouched.
export function clearAnonymousStorage() {
  try {
    USER_KEYS.forEach(key => localStorage.removeItem(userKey(key, null)));
    localStorage.removeItem(ANON_LAST_SEEN);
  } catch { /* localStorage unavailable — nothing to clear */ }
}

// Call once on page load. Clears leftover guest data when this is a new browser
// session (or when the last-seen stamp is older than the backstop), then marks
// the session active. Returns whether anything was cleared, for tests.
export function startGuestSession(now = Date.now()) {
  let cleared = false;
  try {
    const newSession = sessionStorage.getItem(ANON_SESSION_FLAG) == null;
    const lastSeen = Number(localStorage.getItem(ANON_LAST_SEEN));
    const stale = Number.isFinite(lastSeen) && lastSeen > 0 && now - lastSeen > ANON_MAX_AGE_MS;
    if (newSession || stale) {
      clearAnonymousStorage();
      cleared = true;
    }
    sessionStorage.setItem(ANON_SESSION_FLAG, "1");
    localStorage.setItem(ANON_LAST_SEEN, String(now));
  } catch { /* storage unavailable — nothing to clear or mark */ }
  return cleared;
}

// Run on import so the sweep happens on page load without a call site
// elsewhere. Guarded above, so a non-browser environment is a no-op.
startGuestSession();

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
