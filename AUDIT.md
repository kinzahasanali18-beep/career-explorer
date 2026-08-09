# Sparq — UI / UX / Correctness Audit

**Scope:** layout & positioning, navigation/interaction states, component consistency, accessibility, console errors, mobile-specific issues.
**Method:** full read of all 6,365 lines of `src/` + `index.html`, plus `eslint` and a production build (both run; build is clean, eslint reports 18 errors / 2 warnings).
**No code was changed.**

---

## 0. The reported issue, diagnosed

> *"On mobile, the profile menu and sign-out button overlap the screen content when scrolling."*

**Confirmed.** `src/App.jsx:2278-2294`

```jsx
<div style={{ position: "fixed", top: 14, right: 16, zIndex: 9999, display: "flex", gap: 8 }}>
  <button onClick={() => setShowProfile(true)} …>  {/* 30px icon pill */}
  <button onClick={signOut} …>Sign out</button>    {/* ~29px text pill */}
</div>
```

**Root cause — there is no app bar, only two bare floating pills.**

Three things combine:

1. **The buttons are `position: fixed` with no containing bar.** They are two individually-rounded pills painted directly onto the page. Every other fixed element in the app gets a full-bleed container — `BottomNav` (`App.jsx:1263-1269`) is `left: 0; right: 0` with an opaque background *and* `backdropFilter: blur(12px)`. The top-right controls got neither, so there is nothing to separate them from content passing underneath.

2. **Collision is avoided only by a one-time top padding, which stops working the moment you scroll.** Every screen hard-codes `padding: "72px 1.25rem 90px"` (`App.jsx:475`, `App.jsx:992`, `SparqGuide.jsx:171`, `WhenToApply.jsx:189`, `HiddenGems.jsx:64`, `CareerTimeline.jsx:422`). That 72px clears the pills at `scrollY === 0` only. Padding reserves space in the *document*; it cannot reserve space in the *viewport*. As soon as the user scrolls, card titles, industry pills, star buttons and each page's own top-right `?` / `⚡ Sparq Mode` buttons all slide beneath the two opaque pills.

3. **`zIndex: 9999` makes it a tap-interception bug, not just a visual one.** Nothing on any screen exceeds `z-index: 100`, so the pills sit above all page content permanently and swallow pointer events in a ~150×30px region of the top-right corner. Any star button, card, or link that scrolls into that region is untappable — and the tap lands on **Sign out**. That is the worst possible target to place invisibly over scrolling content: a mis-tap ends the session.

**Also broken on desktop, and slightly worse.** `index.css:191-193` overrides the padding at `≥768px`:

```css
.sparq-screen { padding: 2.5rem 3rem 3rem !important; }
```

`2.5rem` = 40px, but the pills occupy y = 14…44px. So on desktop the page header row starts *4px underneath* the pills even at scroll 0, and because `.app-shell` is `max-width: 1400px`, at viewport widths below ~1400px the "Sign out" pill horizontally overlaps each page's own `?` and `⚡ Sparq Mode` buttons.

**Severity:** breaks functionality (accidental sign-out; unreachable controls).
**Suggested fix:** replace the floating pills with a real fixed full-width top bar (opaque + `backdrop-filter`, `left: 0; right: 0`, `z-index` between the nav and the overlays) and derive each screen's `padding-top` from that bar's height in one shared place instead of the six hard-coded `72px` values.

---

# Breaks functionality

### 1. Fixed profile / sign-out pills overlap and intercept taps over all scrolling content
`src/App.jsx:2278-2294` — see §0 above. **Fix:** move them into a real fixed top bar with an opaque background and a single shared content offset.

---

### 2. The Explore industry filter is silently wiped on every page load
`src/App.jsx:1982-1985`

```jsx
const validNames = new Set(INDUSTRY_CONFIG.map(c => c.name));  // "Tech & Engineering", …
const valid = data.industries.filter(i => validNames.has(i));  // data.industries = ["tech", …]
setSelected(valid);          // always []
lsSet("ce_industries", valid); // overwrites saved selection with []
```

**Why:** `profiles.industries` stores **slugs**, not display names. The only two writers confirm it — `ProfilePage.jsx:139` saves `selectedIndustries` (which are `industry.id`: `'tech'`, `'biz'`) and `App.jsx:2305` upserts the quiz's `topIndustries` (also ids). The file *documents* this mismatch at `App.jsx:102-115` and provides `normalizeIndustries()` for exactly this purpose — and the very next lines (`1986-1988`) use it correctly for `profileIndustries`. This branch just forgot to.

So `valid` is **always** `[]` for every onboarded user. Consequences:
- A user finishes the quiz picking 5 industries, and Explore still shows *"Start exploring — Pick an industry to start exploring careers."*
- Worse, the same line clobbers `localStorage.ce_industries`, so any industry the user picks in the sidebar is erased on the next refresh — they watch their selection appear from cache and then vanish a few hundred ms later when the profile fetch resolves.

**Severity:** breaks functionality. **Fix:** use `normalizeIndustries(data.industries)` for `setSelected`/`lsSet`, as the adjacent `profileIndustries` code already does.

---

### 3. Saved deadlines, opportunities and skip history leak between accounts
`src/App.jsx:1871-1882`, `1909-1920`, `1302-1308`; `AuthContext.jsx:44-47`

Starred **careers** live in Supabase per user (`saved_careers`, `App.jsx:1947`), but starred **deadlines** (`sparq_when_starred`), **opportunities** (`sparq_opportunities_starred`), the permanent **skip list** (`sparq_skipped_careers`), the daily deck, industry click tallies and search history are all plain `localStorage` keys with **no user id in the key**, and `signOut()` never clears them.

**Why:** two parallel persistence models were added at different times and the localStorage one was never namespaced.

**Result:** sign out, sign in as a different user on the same browser → the new user's Shortlist is pre-populated with the previous user's saved deadlines and opportunities, and Sparq Mode permanently hides careers *the previous user* skipped. On a shared/family device this is both a privacy leak and a silently broken recommendation engine. It also means these saves don't follow the user to another device, while starred careers do — inconsistent from the user's point of view.

**Severity:** breaks functionality. **Fix:** namespace every key by `user.id` (or move these into Supabase alongside `saved_careers`) and clear them on sign-out.

---

### 4. The onboarding quiz is a trap — there is no way to exit it
`src/App.jsx:2302-2310`, `src/OnboardingQuiz.jsx:291-537`

`OnboardingQuiz` accepts only `onComplete`. It renders as `position: fixed; inset: 0` (`:356`) with no ✕, no backdrop-click handler, and no Escape key handler. `handleBack` from question 1 returns to the age picker (`:319-323`) — which itself has no way out.

Reachable from **"Retake quiz"** in the profile (`ProfilePage.jsx:316`), which is a normal-looking secondary button. Tapping it out of curiosity commits the user to answering all 6–7 questions before they can get back to the app. There is no browser-back escape hatch either (see #13).

**Severity:** breaks functionality. **Fix:** pass an `onClose` and render a ✕ / Escape handler, matching `SparqModeOverlay`'s dismissal pattern.

---

### 5. Quiz options are clipped and unreachable on short viewports
`src/OnboardingQuiz.jsx:356-361`

```jsx
position: 'fixed', inset: 0, …
display: 'flex', alignItems: 'center', justifyContent: 'center',
padding: 20, overflow: 'hidden',
```

**Why:** a vertically-centered flex child inside an `overflow: hidden` fixed container. The content is ~580–620px tall (progress bar + label + 2-line question + flavor + four ~75px option cards + Next + Back). When that exceeds the viewport, centering pushes it out of *both* ends and `overflow: hidden` makes it unscrollable — the overflow is simply gone, with no scrollbar and no way to reach it.

Tier 3 question 2 (`:206-212`) has **five** options, making it the tallest screen in the app. On an iPhone SE (568px) or any phone with the URL bar expanded, the last option and/or the Next button are unreachable and the quiz cannot be completed. Note `ProfilePage` got this right (`ProfilePage.jsx:164`: `maxHeight: '90vh', overflowY: 'auto'`).

**Severity:** breaks functionality. **Fix:** `overflow-y: auto` on the container and `align-items: flex-start` (or `margin: auto`) so tall content scrolls instead of being clipped.

---

### 6. A failed careers fetch leaves the Shortlist on "Loading…" forever
`src/App.jsx:954`, `2045`

```jsx
const loading = allCareers.length === 0 && starredIds.size > 0;   // :954
… .catch(err => { console.error("fetchCareers failed:", err); setCareersLoading(false); });  // :2045
```

**Why:** `loading` is inferred from *empty data*, not from an actual request state, and the fetch's only failure handling is a `console.error`. When the fetch fails (offline, RLS, Supabase down) `allCareers` stays `[]` forever, so a user with starred careers sees an infinite "Loading…" with no error and no retry. On Explore the same failure renders *"No careers match — try removing a filter"*, which actively misleads the user into fiddling with filters that aren't the problem.

There is **no error state anywhere in the app** — `fetchCareers` and `fetchHiddenGems` (`:1905`) both only log.

**Severity:** breaks functionality. **Fix:** track an explicit `error` state alongside `careersLoading` and render a "Couldn't load careers — Retry" state on both screens.

---

### 7. Starring a career fails silently
`src/App.jsx:1951-1960`

```jsx
await supabase.from("saved_careers").insert({ user_id: user.id, career_id: careerId });
setStarredIds(prev => new Set([...prev, careerId]));
```

**Why:** the Supabase result is destructured nowhere — `{ error }` is never checked, on either the `insert` or the `delete`. Because the state update is *after* the await (not optimistic), a failure means the star simply doesn't change and the user gets no feedback at all. They tap the star, nothing happens, and the app looks broken.

Compounding: `handleSparqSwipe` (`:2228-2239`) calls `toggleStar` **without awaiting**, so a right-swipe animates the card away as "saved" regardless of whether the write succeeded.

**Severity:** breaks functionality. **Fix:** check `error` and surface a toast / revert, and await the write in the swipe handler.

---

### 8. Sign out throws an unhandled rejection and looks dead on failure
`src/App.jsx:2290` + `src/AuthContext.jsx:44-47`

```jsx
<button onClick={signOut} …>Sign out</button>
```

**Why:** `signOut` is an `async` function that `throw`s on error, wired directly as the click handler. There is no `try/catch`, no `disabled` state, and no pending indicator. On failure you get an `Uncaught (in promise)` in the console and a button that appears to do nothing; on a slow network there's no feedback that anything is happening.

**Severity:** breaks functionality (console error + dead-feeling control). **Fix:** wrap in a handler with `try/catch` plus a pending/disabled state.

---

### 9. Quiz scoring silently discards misspelled industry weights
`src/OnboardingQuiz.jsx:47, 48, 57, 70, 77, 182, 220`

`scoreAnswers` guards with `if (scores[industryId] !== undefined)` (`:278`), so any key that isn't a real industry id is dropped **with no error**. Seven such keys exist:

| Line | Bad key | Should be |
|---|---|---|
| 47, 70, 220 | `architect` | `architecture` |
| 48 | `travel` | *(no such industry)* |
| 57 | `math` | *(no such industry)* |
| 77 | `education` | `edu` |
| 182 | duplicate `biz` | — (eslint `no-dupe-keys`) |

**Why:** hand-authored weight maps with 22 keys each and no schema validation; the defensive `!== undefined` guard turns typos into silent no-ops.

**Result:** Architecture & Urban Planning is under-weighted on three of the highest-signal answers, and Education & Coaching loses the "heist movie" signal entirely. The quiz is the single input to the user's recommended industries, so this skews the core personalisation output.

**Severity:** breaks functionality (wrong results, invisibly). **Fix:** validate weight keys against `ALL_INDUSTRIES` at module load and throw in dev, then fix the seven keys.

---

### 10. Every card, quiz option and industry tile is a `<div onClick>` — keyboard users are locked out
`OnboardingQuiz.jsx:432`; `App.jsx:285` (`CareerCard`), `840` (`DeadlineCard`), `888` (`OpportunityCard`); `HiddenGems.jsx:216`; `WhenToApply.jsx:283`; `SparqGuide.jsx:269`; `ProfilePage.jsx:62` (`IndustryTile`); `CareerTimeline.jsx:317` (`DiscoveryCard`)

**Why:** clickable `<div>`s with no `role`, no `tabIndex`, and no key handler. They are not focusable, not in the tab order, not activatable by Enter/Space, and screen readers announce them as static text.

The **quiz options are the most severe**: they are the only way to answer, so a keyboard-only or switch-access user cannot complete onboarding — which is a hard gate in front of the entire app (`App.jsx:2296`). Also affected: opening any career, expanding any Guide term / deadline / hidden gem, and picking industries in the profile.

**Severity:** breaks functionality (for keyboard and AT users). **Fix:** make each of these a real `<button>` (or add `role="button"` + `tabIndex={0}` + Enter/Space handling).

---

### 11. "Delete my account" does not delete the account
`src/ProfilePage.jsx:145-149`

```jsx
await supabase.from('profiles').delete().eq('id', user.id);
await supabase.auth.signOut();
```

**Why:** the client-side anon key cannot delete an auth user; that requires a service-role call (edge function / admin API). This deletes the `profiles` row only — the auth user, and every row in `saved_careers`, survive.

The confirmation copy promises the opposite (`:377`): *"This will permanently delete your account and all your data. This cannot be undone."* Signing in with the same email works immediately afterwards and restores the old starred careers. Neither error is handled and `deleting` is never reset, so a failure leaves the button stuck on "Deleting…".

**Severity:** breaks functionality (and a data-deletion promise the app doesn't keep — likely a compliance problem). **Fix:** call a service-role edge function that deletes the auth user and dependent rows, and don't reset `deleting` until it resolves.

---

### 12. The tour spotlights off-screen targets and blocks scrolling
`src/Tour.jsx:25-48`, `:82`

`measure()` reads `getBoundingClientRect()` but **never scrolls the target into view**, and the click-blocker at `:82` (`position: fixed; inset: 0; zIndex: 30000`) sits above the page and swallows touch, so the user can't scroll to it either.

**Why:** the callout is positioned from a viewport rect on the assumption the target is already visible, with no `scrollIntoView` and no scroll pass-through.

**Result:** on a phone, `EXPLORE_TOUR_STEPS`' 4th step (`[data-tour="filters"]`, `App.jsx:23`) is below the fold on first load. The spotlight box is drawn off-screen while the callout gets clamped into the viewport by `:74-75`, so the tour shows a floating caption pointing at nothing, with no way to scroll and see what it means. `CALLOUT_H_EST = 150` (`:15`) is a hard-coded guess, so longer step text overflows and the flip-above logic at `:72` mispositions.

**Severity:** breaks functionality (the walkthrough is the app's primary onboarding for its filters). **Fix:** `scrollIntoView({ block: 'center' })` the target before measuring, and re-measure after the scroll settles.

---

### 13. No routing or history — hardware Back exits the app
`package.json:14`, `src/App.jsx:1842` (`useState` screen), `2051` (`goTo`)

`react-router-dom@7.18.1` is a declared dependency and **never imported anywhere**. Navigation is a `screen` string in `useState`, persisted to `localStorage`.

**Why:** the router was added but the screen switch was hand-rolled instead.

**Result on mobile, where this matters most:**
- Android hardware Back / iOS edge-swipe leaves the app entirely instead of going back one screen — from a career roadmap, from a modal, from anywhere.
- No screen is linkable or shareable (`vercel.json` already rewrites all paths to `index.html`, so routes would work today).
- The career detail screen is excluded from `showNav` (`App.jsx:2077`), so the bottom nav disappears there and the only exit is the in-page "← Back" button (`CareerTimeline.jsx:432`).
- `prevScreen` is written by `goTo` (`:2051`) and never read — eslint flags it as unused — because `DesktopSidebar` and `BottomNav` are wired to raw `setScreen` (`:2341`, `:2418`) and bypass `goTo` entirely. Navigation goes through two different paths depending on which control you use.

**Severity:** breaks functionality (mobile back gesture). **Fix:** adopt the already-installed router, or at minimum push/replace history state per screen and handle `popstate`.

---

# Visual bugs

### 14. `--textDim` fails WCAG contrast in both themes — 1.95:1
`src/index.css:23` (`--textDim: #4A4D66` on `--bg: #1E2030`) and `:40` (light: `#9CA0B5` on `#F4F5FA`)

Measured contrast ratios: **1.95:1 dark**, **2.38:1 light**. WCAG AA requires 4.5:1 for body text and 3:1 for large text — this fails both, by a wide margin. (`--textMid` measures 5.05:1 and is fine, so the problem is isolated to one token.)

`textDim` is not decorative — it carries real content: the **inactive bottom-nav labels** (`App.jsx:1275`, 10px — the app's primary navigation), result counts ("15 programs", `HiddenGems.jsx:202`), hidden-gem status footers (`HiddenGems.jsx:266`), pagination state (`App.jsx:731`), unstarred star icons (`App.jsx:302`), quiz option sub-labels (`OnboardingQuiz.jsx:446`) and every uppercase section label.

**Why:** the token was picked as "one step dimmer than `textMid`" against the card background without a contrast check; at 10px it's effectively invisible.

**Severity:** visual bug (accessibility). **Fix:** lighten `--textDim` to ≥ #6E7290 (dark) / darken to ≥ #6B7085 (light) and stop using it for nav labels.

---

### 15. Desktop padding override puts page headers under the fixed buttons
`src/index.css:191-193` vs the inline `72px` on all six screens

`.sparq-screen { padding: 2.5rem 3rem 3rem !important }` cuts top padding from 72px to 40px at `≥768px`, while the fixed pills still occupy y = 14…44px.

**Why:** two competing sources of truth for the same offset — an inline value per screen and a `!important` media-query override — with no shared constant tying either to the height of the floating buttons.

**Severity:** visual bug. **Fix:** one CSS variable for the top-bar height, consumed by both rules.

---

### 16. Three different, conflicting industry color maps
`App.jsx:73-96` (`INDUSTRY_CONFIG`, 22 entries) · `CareerTimeline.jsx:9-32` (`INDUSTRY_ACCENT`, 22 entries, **different hexes**) · `WhenToApply.jsx:9-20` (`WORLD_COLORS`, **only 10 entries**)

Same industry, three colors. Examples:

| Industry | Explore (`INDUSTRY_CONFIG`) | Roadmap (`INDUSTRY_ACCENT`) | Gems/Deadlines (`WORLD_COLORS`) |
|---|---|---|---|
| Business & Finance | `#BA7517` | `#F0A030` | `#BA7517` |
| Healthcare & Medicine | `#1D9E75` | `#2DD4A4` | `#1D9E75` |
| Cybersecurity | `#EF4444` | `#FF6666` | *missing → `#7F77DD`* |
| Sports & Fitness | `#D85A30` | `#FF7A50` | *missing → `#7F77DD`* |

**Why:** each screen was built with its own local palette instead of importing one. `WORLD_COLORS` covers only the 10 industries that appear in `WhenToApply`'s hard-coded data, but `HiddenGems.jsx:10` and `App.jsx`'s `DeadlineCard`/`OpportunityCard` (`:833`, `:880`) import it anyway — so on Hidden Gems and the Shortlist's Opportunities tab, **12 of 22 industries all render as the same generic purple**, destroying the color-coding that is the app's main wayfinding cue. `OnboardingQuiz.jsx:12-35` and `ProfilePage.jsx:15-37` add two more near-duplicate lists.

**Severity:** visual bug. **Fix:** export one industry registry (name, slug, icon, color) from a single module and delete the other four.

---

### 17. Sticky hover states on touch — cards stay highlighted after a tap
`App.jsx:291-292, 848-849, 896-897`; `HiddenGems.jsx:223-224, 297-298`; `WhenToApply.jsx:295-296, 394-395`; `SparqGuide.jsx:282-283`; `ProfilePage.jsx:323-324, 349-350, 368-369`; `OnboardingQuiz.jsx:401-402`; `OnboardingScreen.jsx:85-86`

Every hover effect in the app is a JS `onMouseEnter`/`onMouseLeave` pair that mutates `style` imperatively.

**Why:** on touch devices browsers synthesise `mouseenter` on tap but frequently never fire the matching `mouseleave`. Because these handlers write directly to `element.style`, the mutation outlives any React re-render — the card's border stays in its hover color indefinitely, so tapping through a list leaves a trail of falsely-highlighted cards that look selected.

**Severity:** visual bug. **Fix:** move these to CSS `@media (hover: hover) { :hover { … } }` so they never apply on touch.

---

### 18. `CardGrid` is defined during render — the whole Shortlist grid remounts on every keystroke
`src/App.jsx:968-982` (eslint: *"Cannot create components during render"*)

```jsx
function ShortlistScreen(…) {
  …
  function CardGrid({ careers }) { … }   // new component type every render
```

**Why:** a component declared inside another component's body is a *different type* on each render, so React unmounts and remounts the entire subtree rather than reconciling it. Typing in the shortlist search box tears down and rebuilds every card on every keystroke — losing DOM state, re-running mount effects, and producing visible flicker on long lists.

**Severity:** visual bug. **Fix:** hoist `CardGrid` to module scope.

---

### 19. Returning to Explore jumps to a stale scroll position
`src/App.jsx:381-383`, `2364` (eslint: *"Cannot access refs during render"*)

```jsx
useLayoutEffect(() => { window.scrollTo(0, restoreScrollY || 0); }, []);   // :381
…
restoreScrollY={savedScrollY.current}                                      // :2364, read during render
```

**Why:** `savedScrollY.current` is written **only** in `handleViewCareer` (`:2057`) and never reset. `CareerGridScreen` restores it on *every* mount, not just on return-from-career. So Explore → (open a career, scroll to 1200px) → Shortlist → Explore lands the user 1200px down a list they just re-entered from the top. Reading a ref during render also means the value isn't guaranteed to be current.

**Severity:** visual bug. **Fix:** pass an explicit "restore once" flag and clear `savedScrollY` after consuming it.

---

### 20. The Hidden Gems tour points at an element that doesn't exist on mobile
`src/App.jsx:44-47` vs `src/HiddenGems.jsx:88-109`

```jsx
const HIDDENGEMS_TOUR_STEPS = [
  { selector: '[data-tour="gems-age"]',   … },
  { selector: '[data-tour="industries"]', text: "Your industry picks in the sidebar filter these too.", placement: "right" },
];
```

**Why:** on Explore, the mobile industry button carries `data-tour="industries"` so the tour can spotlight whichever of sidebar/button is visible (`App.jsx:507-509`, and `Tour.jsx:30-33` implements exactly that "first visible match" logic). Hidden Gems' equivalent button (`HiddenGems.jsx:88`) was added later — the commit message says *"match Explore pattern"* — but the `data-tour` attribute was left off.

**Result:** on mobile the sidebar is `display: none`, no element matches, `rect` is `null`, and the user gets a centered caption telling them about a "sidebar" that isn't on screen and can't be. The step text is desktop-only language regardless.

**Severity:** visual bug. **Fix:** add `data-tour="industries"` to the Hidden Gems mobile button and reword the step to be viewport-neutral.

---

### 21. The Shortlist "?" tour describes controls that aren't rendered
`src/App.jsx:1014-1024` vs `:1025`, `:1100`, `:2007`

The auto-tour correctly waits for content (`:2007`: `if (screen === "shortlist" && starredIds.size === 0) return;`), but the manual "?" replay button is rendered unconditionally and has no such guard. Meanwhile `shortlist-groupby` (`:1026`) and `shortlist-filters` (`:1100`) only exist when `starred.length > 0`.

**Why:** the gating logic lives in the auto-open effect rather than on the trigger.

**Result:** on an empty Shortlist, tapping "?" walks the user through a Group-by dropdown and filter panel that are nowhere on screen — two of the three steps spotlight nothing.

**Severity:** visual bug. **Fix:** hide or disable the "?" when its anchors aren't present.

---

### 22. Two Sparq tour steps spotlight the identical element
`src/App.jsx:49-53`

```jsx
{ selector: '[data-tour="sparq-card"]', text: "Swipe right to save it, left to skip…" },
{ selector: '[data-tour="sparq-card"]', text: "Or just tap a card to open its full roadmap." },
```

**Why:** two messages about the same target were split into two steps instead of one.

**Result:** pressing "Next" appears to do nothing — the spotlight doesn't move and only the caption text swaps, which reads as a broken button.

**Severity:** minor polish. **Fix:** merge into one step, or anchor the second to a different element.

---

### 23. Star buttons are ~16px targets nested inside a clickable card
`App.jsx:297-305`, `853-860`, `909-916`; `HiddenGems.jsx:229-237`; `WhenToApply.jsx:331-339`

```jsx
fontSize: 16, lineHeight: 1, padding: "0 0 0 2px"
```

**Why:** the button is sized purely by its glyph with effectively no padding — a ~16×16px hit area (WhenToApply's is `fontSize: 15, padding: 0`). WCAG 2.5.8 requires 24×24 minimum; iOS HIG recommends 44×44.

Because the star is `e.stopPropagation()`-wrapped inside a card whose entire surface is also clickable, a near-miss doesn't just fail — it triggers the *other* action (navigating to the roadmap, or expanding the card). Saving is the app's core interaction and it's the hardest thing to hit.

**Severity:** visual bug (mobile usability). **Fix:** give the star a ≥44×44 padded hit area (negative margin to keep the visual size).

---

### 24. Ad-hoc z-index values with three overlays sharing the same layer
`App.jsx:1264` (100) · `App.jsx:2279` (9999) · `App.jsx:1668` `SparqModeOverlay` (10000) · `ProfilePage.jsx:154` (10000) · `OnboardingQuiz.jsx:357` (10000) · `App.jsx:535` + `HiddenGems.jsx:115` industry sheets (15000) · `OnboardingScreen.jsx:15` (20000) · `Tour.jsx:82,93,102` (30000-30002)

**Why:** each overlay picked its own magic number in isolation; there is no scale and no shared constant.

Three distinct full-screen overlays sit at exactly `10000`, so their paint order is decided by DOM order in `AppContent`'s JSX rather than by intent. It happens to be safe today only because the handlers close one before opening the next (`:2328` closes Sparq before opening the profile) — an invariant nothing enforces. Meanwhile the mobile industry *sheet* (15000) outranks every *modal*, and the `9999` pills outrank all page content, which is the root of §0.

**Severity:** minor polish (latent). **Fix:** define a `Z` scale (`nav: 100, floating: 200, modal: 1000, sheet: 1100, tour: 2000`) in one module and use it everywhere.

---

### 25. No safe-area handling and no `viewport-fit=cover`
`index.html:6`, `App.jsx:1264-1281`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

`env(safe-area-inset-*)` appears nowhere in the codebase. The bottom nav's only clearance is a hard-coded `padding: "10px 8px 14px"`.

**Why:** never addressed. Today it's masked — without `viewport-fit=cover`, iOS Safari already insets the layout viewport, so `bottom: 0` lands above the home indicator. But this is fragile by accident, not by design: adding `viewport-fit=cover` (needed for any edge-to-edge treatment, a PWA manifest, or an installed shell) would immediately drop the nav labels under the home indicator, and the 14px bottom padding is doing load-bearing work it wasn't designed for.

Related: `min-height: 100vh` in five places (`index.css:71,82,87`, `App.jsx:2276,2427`) rather than `100dvh`, which overshoots by the mobile URL-bar height and adds phantom scroll.

**Severity:** minor polish (latent). **Fix:** add `viewport-fit=cover` and `padding-bottom: calc(14px + env(safe-area-inset-bottom))` on the nav, and switch to `100dvh`.

---

### 26. Two Supabase clients → "Multiple GoTrueClient instances" console warning
`src/supabase.js:3-6` and `src/supabaseClient.js:6`

```js
// supabase.js
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, …);   // not exported
// supabaseClient.js
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Why:** two modules each call `createClient` with the same URL and key. Both are loaded (`App.jsx:3` imports from `supabase.js`, `App.jsx:4` from `supabaseClient.js`), so two `GoTrueClient` instances share one `localStorage` auth key.

**Result:** Supabase logs its standard warning — *"Multiple GoTrueClient instances detected in the same browser context… may produce undefined behavior when used concurrently under the same storage key"* — on every page load, and two independent token-refresh timers race on the same session.

**Severity:** visual bug (console warning + latent auth race). **Fix:** have `supabase.js` import the shared client from `supabaseClient.js`.

---

### 27. Remaining eslint errors worth fixing
`npx eslint src/` → 18 errors, 2 warnings. Beyond those already covered (#9 dupe key, #18 component-in-render, #19 ref-in-render):

- `Tour.jsx:38, 41` — `react-hooks/set-state-in-effect`: `measure()` calls `setRect` synchronously in both `useLayoutEffect` and `useEffect`, and the `useEffect` re-runs on every `measure` identity change → cascading renders on every scroll event (the `scroll` listener is registered with `capture: true`, so this fires on *every* scrollable ancestor).
- `App.jsx:1949, 1994` — `exhaustive-deps`: effects keyed on `user?.id` but reading `user`.
- `App.jsx:1297, 1892, 1939` — `no-empty`: silent `catch {}` blocks around `localStorage` writes, so a quota/private-mode failure is invisible.
- `App.jsx:1853` — `prevScreen` assigned, never read (see #13).
- Six `react-refresh/only-export-components` errors (`AuthContext.jsx:56`, `ThemeContext.jsx:11,38`, `WhenToApply.jsx:9,32,131`) — these break HMR: editing `WhenToApply.jsx` full-reloads the app instead of hot-updating, because it exports data (`WORLD_COLORS`, `collegeData`, `highSchoolData`) alongside its component.

**Severity:** minor polish. **Fix:** `npx eslint src/ --fix` for the mechanical ones; move `WhenToApply`'s data and `WORLD_COLORS` into a separate module (which also resolves #16).

---

### 28. Six overlays, four different dismissal contracts
| Overlay | Escape | Backdrop click | ✕ | Body scroll lock | Focus trap |
|---|---|---|---|---|---|
| `Tour.jsx` | ✅ `:51` | — | ✅ | (blocker) | ❌ |
| `SparqModeOverlay` `App.jsx:1642` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `ProfilePage.jsx:159` | ❌ | ✅ | ✅ ×2 | ❌ | ❌ |
| Industry sheets `App.jsx:533` / `HiddenGems.jsx:113` | ❌ | ✅ | ✅ | ❌ | ❌ |
| `OnboardingQuiz` | ❌ | ❌ | ❌ | ❌ | ❌ |
| `OnboardingScreen` | ❌ | ❌ | ❌ (Skip) | ❌ | ❌ |

**Why:** each was written independently with no shared modal primitive.

**Result:** Escape works in two of six, so the key feels unreliable. **No overlay locks body scroll** — with the profile modal open on mobile, dragging on the backdrop scrolls the page behind it, and closing the modal leaves the user somewhere else than where they were. No overlay traps focus or restores it to the trigger, so tabbing inside a modal walks into the page behind. `ProfilePage` has *two* Close buttons (`:170`, `:342`) while the sheets have one.

**Severity:** minor polish (accessibility). **Fix:** extract one `<Modal>` that owns Escape, backdrop click, `overflow: hidden` on `<body>`, focus trap and focus restore.

---

### 29. Filter chips: one reusable component, three hand-rolled reimplementations
`FilterChip` (`App.jsx:254-268`) is used only on Explore and the Shortlist. Three other screens rebuild it inline with drifted styling:

- `HiddenGems.jsx:182-193` — active state is `border: 1px solid var(--text)` + `background: color-mix(in srgb, var(--textMid) 13%, transparent)`, i.e. **neutral/white**, whereas every other chip in the app uses a colored border + `${color}22` fill. The age filter therefore looks like a different control from the world filter directly above it. This is also the only `color-mix()` in the codebase, inconsistent with the `${hex}22` alpha-append convention used everywhere else (documented at `index.css:14-16`).
- `WhenToApply.jsx:241-268` — duplicates `FilterChip`'s exact styling by hand, plus a separate hard-coded "All" chip.
- `SparqGuide.jsx:236-248` — same again.

The "?" replay button has the same problem: `30×30, borderRadius: "50%"` on five screens (`App.jsx:483`, `1019`; `SparqGuide.jsx:189`; `WhenToApply.jsx:204`; `HiddenGems.jsx:79`) but `32×32, borderRadius: 10` in `SparqModeOverlay` (`App.jsx:1684`). Close glyphs alternate between `✕` (`App.jsx:547`, `ProfilePage.jsx:170`) and `×` (`App.jsx:629`, `1697`, `Tour.jsx:116`).

**Severity:** minor polish. **Fix:** route all four chip sites through `FilterChip` (add an `all` variant), and extract `ReplayTourButton` and one close-glyph constant.

---

### 30. The same item is a link on one screen and a whole-card `window.open` on another
`App.jsx:835-837`, `883-885` vs `HiddenGems.jsx:280-299`

On Hidden Gems, a program's URL is an explicit `<a target="_blank" rel="noopener noreferrer">` labelled *"Official program page ↗"* — revealed only after expanding the card. On the Shortlist's Deadlines/Opportunities tabs, the **entire card** is a `<div onClick>` calling `window.open(item.url, "_blank")`, with no link affordance, no `↗`, and no visible cue that tapping navigates off-site.

**Why:** the Shortlist cards were built as a separate card family from the source screens they mirror.

**Result:** the same saved item behaves differently depending on where you meet it; on the Shortlist a tap intended to expand a card instead opens a new tab. Because it's not an anchor there's no href preview, no long-press menu, and no middle-click. The identical pattern on Explore's `CareerCard` navigates *in-app*, so "tap a card" means three different things across the app.

**Severity:** visual bug. **Fix:** use a real `<a>` with a visible `↗` on the Shortlist cards, matching Hidden Gems.

---

### 31. Zero headings and zero landmarks in the entire app
`grep -c '<h[1-6]' src/**/*.jsx` → **0** across all 14 files.

Every heading is a styled `<div>` — "Explore Careers" (`App.jsx:478`), "Your Shortlist" (`:997`), "Hidden Gems" (`HiddenGems.jsx:69`), and so on. There is no `<nav>`, `<main>`, `<header>` or `<aside>`: the sidebar is `<div className="desktop-sidebar">` (`App.jsx:187`), the bottom nav is `<div className="sparq-bottom-nav">` (`:1263`), and the content wrapper is `<div className="main-content">` (`:2347`).

**Why:** the app is built entirely from `div` + inline styles, with no semantic layer.

**Result:** screen-reader users get no document outline, no heading navigation (the primary way AT users skim a page), no skip-to-content, and no way to distinguish navigation from content. The Shortlist tab bar (`:1055-1073`) is buttons with no `role="tablist"`/`aria-selected`, the bottom nav has no `aria-current`, and the Group-by `<select>` (`:1027`) has no label — only a placeholder `<option>`.

**Severity:** visual bug (accessibility). **Fix:** one `<h1>` per screen with `<h2>` for sections, wrap the navs in `<nav>` and content in `<main>`, and add `aria-current`/`aria-selected`/`<label>` to the nav, tabs and select.

---

### 32. The salary progression chart is unreachable dead code
`src/App.jsx:2059-2071` vs `CareerTimeline.jsx:401`, `:518`, `SalaryChart` at `:246-268`

`handleViewCareer` builds the career object it passes to `CareerTimeline` with `growth: []` hard-coded (`:2066`), alongside `school: ""` and `day: ""`. `CareerTimeline` then renders `SalaryChart` only `if (growth.length > 0)` (`:518`) and the education/day-in-the-life blocks only when `school`/`day` are truthy.

**Why:** the normalizer was written for a data shape (`growth`, `school`, `day`) that `fetchCareers` (`supabase.js:25-39`) doesn't select, and the empty defaults were left in place.

**Result:** `SalaryChart` (23 lines), the "A day in the life" card (`:506-515`), and the `school` branch of every salary pill can never render. The timeline always falls through to `generateTimeline()` (`:413`), which fabricates salary figures from a heuristic (`lo * 0.45`, `lo * 0.7`, `hi * 1.3`) — presented to the user with no indication that the four-stage progression is derived rather than sourced.

**Severity:** minor polish. **Fix:** either select these columns and pass them through, or delete the dead branches and be explicit in the UI that the progression is estimated.

---

### 33. Dead code and dead files
- `src/industries.js` (138 lines) and `src/airtable.js` (72 lines) — never imported.
- `src/App.css` (184 lines) — untouched Vite starter boilerplate (`.hero`, `#next-steps`, `.ticks`, `#spacer`). Never imported by anything; the only `:focus-visible` rule in the codebase lives in it, on the unused `.counter` class.
- `src/supabase.js:64-81` — `fetchReviewedCareers` and `scoreCareers`, never called.
- `App.jsx:2078` — `const showSidebar = true;` makes four `{showSidebar && …}` conditionals and two ternaries (`:2276`, `:2347`) permanently dead branches.
- `App.jsx:1989` — `localStorage.setItem("ce_landing_seen", "1")` is written and never read.
- `App.jsx:1853` — `prevScreen` (see #13).
- `OnboardingQuiz.jsx:291` — the `isRetake` prop is never passed by `App.jsx:2302`, so the "Retake Quiz" header (`:377`) never appears even when reached via "Retake quiz".
- `@keyframes fadeSlideUp` is defined three times: `index.css:60`, and re-injected via inline `<style>` in `CareerTimeline.jsx:424` and `OnboardingScreen.jsx:21`.
- `App.jsx:1239-1249` — the Scholarships tab is a permanent "coming soon" empty state, indistinguishable from the three working tabs until tapped.
- Build warns the bundle is 565 kB (157 kB gzip) in a single chunk; ~40% of it is the hard-coded quiz/guide/deadline datasets that could be split or moved to Supabase.

**Severity:** minor polish. **Fix:** delete the unused files and branches; consolidate the keyframes into `index.css`.

---

## Summary

| Severity | Count |
|---|---|
| Breaks functionality | 13 |
| Visual bug | 12 |
| Minor polish | 8 |

**Highest-leverage fixes, in order:**

1. **#2** — one-line change (`normalizeIndustries`) that restores the industry filter for every onboarded user. Almost certainly the app's biggest silent breakage.
2. **#1 / §0** — a real fixed top bar; removes the accidental-sign-out hazard and fixes #15 with it.
3. **#3** — namespace localStorage by user id; cross-account data leak.
4. **#16** — one industry registry; deletes ~100 lines of duplicated palettes and fixes the washed-out Hidden Gems / Opportunities color coding.
5. **#10 + #31** — `<button>` and heading/landmark semantics; the quiz being keyboard-inoperable currently gates the whole app.

Three themes explain most of what's here: **layout offsets duplicated across six files instead of shared**, **four parallel copies of the industry vocabulary** (full names, slugs, `WORLD_COLORS`, `INDUSTRY_ACCENT`) with translation missing in exactly one place, and **`div` + inline style used for everything**, which is what makes hover states sticky on touch, keyboard access impossible, and every reusable pattern drift.
