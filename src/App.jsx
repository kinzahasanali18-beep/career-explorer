import { useState, useEffect, useRef, useLayoutEffect } from "react";
import CareerTimeline from "./CareerTimeline";
import { fetchCareers, fetchHiddenGems } from "./supabase";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import LoginScreen from "./LoginScreen";
import ProfilePage from "./ProfilePage";
import OnboardingScreen from "./OnboardingScreen";
import OnboardingQuiz from "./OnboardingQuiz";
import SparqGuide from "./pages/SparqGuide";
import WhenToApply, { WORLD_COLORS as DEADLINE_WORLD_COLORS } from "./pages/WhenToApply";
import HiddenGems from "./pages/HiddenGems";
import SalaryNote from "./SalaryNote";
import Tour from "./Tour";

// First-time walkthroughs. Each step points at an element by its data-tour
// attribute. Steps intentionally avoid re-teaching repeated patterns (starring,
// tap-to-expand) on every page — those are taught once and skipped elsewhere.
const EXPLORE_TOUR_STEPS = [
  { selector: '[data-tour="industries"]', text: "Pick industries to filter what you see.", placement: "right" },
  { selector: '[data-tour="search"]',     text: "Already know what you're looking for? Search here.", placement: "bottom" },
  { selector: '[data-tour="sparq"]',      text: "Swipe through picks made just for you.", placement: "bottom" },
  { selector: '[data-tour="filters"]',    text: "Narrow things down even further.", placement: "bottom" },
];

const SHORTLIST_TOUR_STEPS = [
  { selector: '[data-tour="shortlist-tabs"]',    text: "Everything you save lands here — careers, deadlines, and opportunities, each on its own tab.", placement: "bottom" },
  { selector: '[data-tour="shortlist-groupby"]', text: "Sort your saved careers by industry, salary, experience, and more.", placement: "bottom" },
  { selector: '[data-tour="shortlist-filters"]', text: "Filter or search inside your saved list to find one fast.", placement: "bottom" },
];

const GUIDE_TOUR_STEPS = [
  { selector: '[data-tour="guide-search"]',     text: "Search any term — even the plain-English version of it.", placement: "bottom" },
  { selector: '[data-tour="guide-categories"]', text: "Jump straight to money, school, or work topics.", placement: "bottom" },
  { selector: '[data-tour="guide-card"]',       text: "Tap any card for the real talk — plus a tip you can actually use.", placement: "bottom" },
];

const WHENTOAPPLY_TOUR_STEPS = [
  { selector: '[data-tour="wta-mode"]',    text: "Flip between College and High School — the whole list retimes itself.", placement: "bottom" },
  { selector: '[data-tour="wta-urgency"]', text: "More dots = start sooner. Five means plan 12–18 months ahead.", placement: "bottom" },
  { selector: '[data-tour="wta-star"]',    text: "Star a deadline to track it in your Shortlist.", placement: "bottom" },
];

const HIDDENGEMS_TOUR_STEPS = [
  { selector: '[data-tour="gems-age"]',   text: "Filter by who each program's actually for.", placement: "bottom" },
  { selector: '[data-tour="industries"]', text: "Your industry picks in the sidebar filter these too.", placement: "right" },
];

const SPARQ_TOUR_STEPS = [
  { selector: '[data-tour="sparq-card"]',     text: "Swipe right to save it, left to skip. Skips are gone for good.", placement: "bottom" },
  { selector: '[data-tour="sparq-card"]',     text: "Or just tap a card to open its full roadmap.", placement: "bottom" },
  { selector: '[data-tour="sparq-controls"]', text: "Not a swiper? These do the same thing.", placement: "bottom" },
];

// Routed-screen tours, keyed by screen id. Each auto-runs once (its localStorage
// key) and is replayable via the page's "?" button. The Sparq overlay tour lives
// inside SparqModeOverlay since it isn't a routed screen.
const SCREEN_TOURS = {
  home:            { key: "ce_explore_tour_seen",   steps: EXPLORE_TOUR_STEPS },
  shortlist:       { key: "ce_shortlist_tour_seen", steps: SHORTLIST_TOUR_STEPS },
  guide:           { key: "ce_guide_tour_seen",     steps: GUIDE_TOUR_STEPS },
  "when-to-apply": { key: "ce_wta_tour_seen",       steps: WHENTOAPPLY_TOUR_STEPS },
  "hidden-gems":   { key: "ce_gems_tour_seen",      steps: HIDDENGEMS_TOUR_STEPS },
};
const SPARQ_TOUR_KEY = "ce_sparq_tour_seen";

const T = {
  bg: "var(--bg)", bgCard: "var(--bgCard)", bgDeep: "var(--bgDeep)",
  border: "var(--border)", text: "var(--text)", textMid: "var(--textMid)", textDim: "var(--textDim)",
  accent: "#7F77DD",
};

const INDUSTRY_CONFIG = [
  { name: "Tech & Engineering",            icon: "◈", color: "#7F77DD", bg: "#1E1B3A" },
  { name: "Business & Finance",            icon: "◉", color: "#BA7517", bg: "#1E1605" },
  { name: "Healthcare & Medicine",         icon: "◎", color: "#1D9E75", bg: "#0F2620" },
  { name: "Design & Creative",             icon: "✦", color: "#D4537E", bg: "#1E0F16" },
  { name: "Media & Journalism",            icon: "◧", color: "#C4508E", bg: "#1E0E18" },
  { name: "Sports & Fitness",              icon: "▤", color: "#D85A30", bg: "#1E1008" },
  { name: "Fashion & Beauty",              icon: "◩", color: "#E91E8C", bg: "#1E0818" },
  { name: "Education & Coaching",          icon: "▥", color: "#639922", bg: "#0E1A08" },
  { name: "Law & Government",              icon: "▣", color: "#378ADD", bg: "#0A1628" },
  { name: "Science & Research",            icon: "◪", color: "#8B5CF6", bg: "#150E28" },
  { name: "Hospitality & Events",          icon: "▦", color: "#534AB7", bg: "#12102A" },
  { name: "Entrepreneurship",              icon: "◔", color: "#F59E0B", bg: "#1E1505" },
  { name: "Arts & Performance",            icon: "◕", color: "#9B59B6", bg: "#180E22" },
  { name: "Social Impact & Nonprofit",     icon: "◖", color: "#10B981", bg: "#0A1E14" },
  { name: "Architecture & Urban Planning", icon: "◗", color: "#64748B", bg: "#10141A" },
  { name: "Aviation & Transportation",     icon: "◐", color: "#0EA5E9", bg: "#081420" },
  { name: "Cybersecurity",                 icon: "◑", color: "#EF4444", bg: "#1E0A0A" },
  { name: "Environment & Sustainability",  icon: "◒", color: "#22C55E", bg: "#081A0C" },
  { name: "Food & Culinary",               icon: "◓", color: "#D97706", bg: "#1A1005" },
  { name: "Gaming & Esports",              icon: "▲", color: "#06B6D4", bg: "#081620" },
  { name: "Marketing & Communications",    icon: "△", color: "#EC4899", bg: "#1E0A14" },
  { name: "Supply Chain & Operations",     icon: "▴", color: "#6B7280", bg: "#10121A" },
];

function getConfig(industryName) {
  return INDUSTRY_CONFIG.find(c => c.name === industryName) || { icon: "◉", color: T.accent, bg: T.bgDeep };
}

// The profile modal + onboarding quiz store industry SLUGS (e.g. "tech") in
// profiles.industries, while INDUSTRY_CONFIG and careers.primary_industry use
// full names ("Tech & Engineering"). This maps slug → full name.
const INDUSTRY_SLUG_TO_NAME = {
  tech: "Tech & Engineering", design: "Design & Creative", biz: "Business & Finance",
  health: "Healthcare & Medicine", arts: "Arts & Performance", edu: "Education & Coaching",
  media: "Media & Journalism", law: "Law & Government", science: "Science & Research",
  hospitality: "Hospitality & Events", sports: "Sports & Fitness", fashion: "Fashion & Beauty",
  entrepreneur: "Entrepreneurship", environment: "Environment & Sustainability",
  nonprofit: "Social Impact & Nonprofit", marketing: "Marketing & Communications",
  cyber: "Cybersecurity", architecture: "Architecture & Urban Planning",
  gaming: "Gaming & Esports", supplychain: "Supply Chain & Operations",
  food: "Food & Culinary", aviation: "Aviation & Transportation",
};

// Normalize a raw profiles.industries array to full industry names, accepting
// both slugs ("tech") and already-full names, and dropping anything unknown.
function normalizeIndustries(raw) {
  const validNames = new Set(INDUSTRY_CONFIG.map(c => c.name));
  const out = [];
  (raw || []).forEach(v => {
    if (validNames.has(v)) out.push(v);
    else if (INDUSTRY_SLUG_TO_NAME[v]) out.push(INDUSTRY_SLUG_TO_NAME[v]);
  });
  return [...new Set(out)];
}

// ─── Filter definitions ───────────────────────────────────────────────────────

const WORK_STYLE_FILTERS = [
  { id: "remote",   label: "Remote" },
  { id: "hybrid",   label: "Hybrid" },
  { id: "inperson", label: "In-person" },
];

const PATH_FILTERS = [
  { id: "No",        label: "No degree needed" },
  { id: "Sometimes", label: "Degree helpful" },
  { id: "Yes",       label: "Degree required" },
];

const VIBE_FILTERS = [
  { id: "fast-paced",      label: "Fast-paced",     terms: ["fast"] },
  { id: "creative",        label: "Creative",        terms: ["creative"] },
  { id: "helping-people",  label: "Helping people",  terms: ["compassion", "empath", "caring", "nurtur", "helping"] },
  { id: "problem-solving", label: "Problem-solving", terms: ["problem"] },
  { id: "building-things", label: "Building things", terms: ["build", "engineer", "construct", "technical"] },
  { id: "analytical",      label: "Analytical",      terms: ["analytic", "data-driven", "research"] },
];

function matchesWorkStyle(workStyle, active) {
  if (active.size === 0) return true;
  const ws = (workStyle || "").toLowerCase();
  for (const f of active) {
    if (f === "remote"   && ws.includes("remote"))   return true;
    if (f === "hybrid"   && ws.includes("hybrid"))   return true;
    if (f === "inperson" && ws.includes("in-person")) return true;
  }
  return false;
}

function matchesVibe(career, active) {
  if (active.size === 0) return true;
  const text = [
    Array.isArray(career.traits)   ? career.traits.join(",")   : (career.traits   || ""),
    Array.isArray(career.keywords) ? career.keywords.join(",") : (career.keywords || ""),
  ].join(",").toLowerCase();
  for (const id of active) {
    const v = VIBE_FILTERS.find(x => x.id === id);
    if (v && v.terms.some(t => text.includes(t))) return true;
  }
  return false;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

// Screens that actually use the sidebar industry list to filter their content.
// Other screens (Hidden Gems, When to Apply, etc.) have their own top-of-page
// pill filters, so the sidebar Industries section is hidden there to avoid a
// redundant / non-functional duplicate.
const INDUSTRY_FILTER_SCREENS = ["home", "hidden-gems"];

function DesktopSidebar({ screen, selectedIndustries, onNavigate, onToggleIndustry }) {
  const showIndustries = INDUSTRY_FILTER_SCREENS.includes(screen);
  return (
    <div className="desktop-sidebar" style={{ background: T.bg }}>
      <div className="sidebar-brand">⚡ Sparq</div>

      <div className="sidebar-section-label">Navigate</div>
      <button
        className={`sidebar-item${screen === "home" ? " active" : ""}`}
        onClick={() => onNavigate("home")}
      >
        <span style={{ fontSize: 14 }}>◈</span> Explore Careers
      </button>
      <button
        className={`sidebar-item${screen === "shortlist" ? " active" : ""}`}
        onClick={() => onNavigate("shortlist")}
      >
        <span style={{ fontSize: 14 }}>★</span> Your Shortlist
      </button>
      <button
        className={`sidebar-item${screen === "guide" ? " active" : ""}`}
        onClick={() => onNavigate("guide")}
      >
        <span style={{ fontSize: 14 }}>📖</span> The Guide
      </button>
      <button
        className={`sidebar-item${screen === "when-to-apply" ? " active" : ""}`}
        onClick={() => onNavigate("when-to-apply")}
      >
        <span style={{ fontSize: 14 }}>📅</span> When to Apply
      </button>
      <button
        className={`sidebar-item${screen === "hidden-gems" ? " active" : ""}`}
        onClick={() => onNavigate("hidden-gems")}
      >
        <span style={{ fontSize: 14 }}>◆</span> Hidden Gems
      </button>

      <div className="sidebar-divider" />

      {showIndustries && (
        <div data-tour="industries" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div className="sidebar-section-label">Industries</div>
          {INDUSTRY_CONFIG.map(ind => {
            const sel = selectedIndustries.includes(ind.name);
            return (
              <button
                key={ind.name}
                className="sidebar-item"
                onClick={() => onToggleIndustry(ind.name)}
                style={{
                  color: sel ? ind.color : T.textMid,
                  background: sel ? `${ind.color}14` : "transparent",
                  fontWeight: sel ? 600 : 400,
                }}
              >
                <span style={{ fontSize: 13, flexShrink: 0 }}>{ind.icon}</span>
                <span style={{ flex: 1 }}>{ind.name}</span>
                {sel && <span style={{ fontSize: 10, flexShrink: 0, opacity: 0.8 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Reusable components ───────────────────────────────────────────────────────

function FilterChip({ label, active, color = T.accent, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
        border: `1px solid ${active ? color : T.border}`,
        background: active ? `${color}22` : "transparent",
        color: active ? color : T.textMid,
        cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
        transition: "all 0.15s",
      }}
    >{label}</button>
  );
}

function CareerCard({ career, onClick, isStarred, onToggleStar }) {
  const title = career.name || career.title || "";
  const desc = career.description || career.desc || "";

  const secondaryList = career.secondary_industries
    ? career.secondary_industries.split(",").map(s => s.trim()).filter(Boolean)
    : [];
  const allIndustries = [
    ...(career.primary_industry ? [career.primary_industry] : []),
    ...secondaryList.filter(s => s !== career.primary_industry),
  ];

  const primaryCfg = getConfig(career.primary_industry);

  return (
    <div
      onClick={onClick}
      style={{
        background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16,
        padding: "14px", cursor: "pointer", transition: "border-color 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = primaryCfg.color; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, flex: 1, lineHeight: 1.35 }}>{title}</div>
        {onToggleStar && (
          <button
            onClick={e => { e.stopPropagation(); onToggleStar(career.id); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 16, lineHeight: 1, padding: "0 0 0 2px", flexShrink: 0,
              color: isStarred ? "#F59E0B" : T.textDim,
            }}
          >{isStarred ? "★" : "☆"}</button>
        )}
      </div>

      {allIndustries.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
          {allIndustries.map(ind => {
            const cfg = getConfig(ind);
            return (
              <span key={ind} style={{
                fontSize: 10, fontWeight: 600, color: cfg.color,
                background: `${cfg.color}18`, border: `1px solid ${cfg.color}40`,
                borderRadius: 20, padding: "2px 8px",
              }}>{ind}</span>
            );
          })}
        </div>
      )}

      {desc && (
        <div style={{ fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>
          {desc.length > 78 ? desc.slice(0, 78) + "…" : desc}
        </div>
      )}
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function FilterGroup({ label, chips, isActive, onToggle, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 7 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {chips.map(chip => (
          <FilterChip
            key={chip.id}
            label={chip.label}
            active={isActive(chip.id)}
            color={color}
            onClick={() => onToggle(chip.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Relevance score for a career against a search query. Weighted so a title
// match beats a keyword match beats a description match, and a full-phrase hit
// in the title (the exact role someone typed) ranks above scattered token hits.
function searchScore(c, tokens, fullQuery) {
  const name = (c.name || "").toLowerCase();
  const desc = (c.description || c.desc || "").toLowerCase();
  const keywords = (c.keywords || []).map(k => String(k).toLowerCase());
  let score = 0;
  if (name.includes(fullQuery)) score += 100;
  if (desc.includes(fullQuery)) score += 15;
  for (const t of tokens) {
    if (name.includes(t)) score += 10;
    if (keywords.some(k => k.includes(t))) score += 6;
    if (desc.includes(t)) score += 2;
  }
  return score;
}

function CareerGridScreen({
  selectedIndustries, onToggleIndustry, allCareers, loading, onViewCareer, onSparqMode,
  workStyleActive, setWorkStyleActive, pathActive, setPathActive,
  vibeActive, setVibeActive, searchQuery, setSearchQuery, restoreScrollY,
  starredIds, onToggleStar, onReplayTour,
}) {
  // Mobile-only industry picker (the sidebar's industry list is hidden < 768px).
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  useLayoutEffect(() => {
    window.scrollTo(0, restoreScrollY || 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleSet(setter, id) {
    setter(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Current page in the paginated career list (see PAGE_SIZE below).
  const [page, setPage] = useState(0);

  // Debounce the search input so we filter/rank the (large) dataset at most
  // once per pause in typing rather than on every keystroke. The input stays
  // bound to `searchQuery` for responsiveness; `debouncedQuery` drives results.
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      // Record career searches so Sparq Mode can weight recommendations toward
      // what the user has looked for (newest first, de-duped, capped).
      const term = searchQuery.trim().toLowerCase();
      if (term.length >= 3) {
        const hist = ls(SPARQ_KEYS.searches, []);
        lsSet(SPARQ_KEYS.searches, [term, ...hist.filter(t => t !== term)].slice(0, 15));
      }
    }, 250);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const q = debouncedQuery.trim().toLowerCase();
  const hasSearch = q.length > 0;
  const searchTokens = q.split(/\s+/).filter(Boolean);

  // "All industries" (nothing selected) is intentionally an empty state — the
  // full unfiltered set is 6,000+ cards, so we prompt the user to pick an
  // industry instead of dumping everything. But an active search overrides this:
  // it queries the whole dataset, so we show results even with no industry set.
  const noIndustrySelected = selectedIndustries.length === 0;
  const showEmptyState = noIndustrySelected && !hasSearch;

  // Accent color for the search focus ring: the selected industry's color (the
  // most recently selected, if several), or the neutral brand accent when none.
  const focusColor = selectedIndustries.length
    ? getConfig(selectedIndustries[selectedIndustries.length - 1]).color
    : T.accent;

  // When searching, rank the whole dataset by relevance so the exact match
  // floats to the top and related roles (shared keywords / same terms) follow.
  // When not searching, keep the dataset in its natural order.
  const base = hasSearch
    ? allCareers
        .map(c => ({ c, score: searchScore(c, searchTokens, q) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(x => x.c)
    : allCareers;

  // Industry (and the other chip filters) apply on top of the search results.
  const displayed = base
    .filter(c => selectedIndustries.length === 0 || selectedIndustries.includes(c.primary_industry))
    .filter(c => matchesWorkStyle(c.work_style, workStyleActive))
    .filter(c => !pathActive || (c.degree_required || "").toLowerCase() === pathActive.toLowerCase())
    .filter(c => matchesVibe(c, vibeActive));

  // The literal text the user typed (trimmed) and the selected industries'
  // display names — used in the zero-results messaging below.
  const queryText = debouncedQuery.trim();
  const selectedIndustryNames = selectedIndustries.map(id => getConfig(id).name).join(", ");

  // ── Pagination ──────────────────────────────────────────────────────────────
  // Break the (potentially huge) list into fixed pages with a light "Page X of Y"
  // control, so scrolling has a defined end instead of running on forever.
  const PAGE_SIZE = 15;
  const totalPages = Math.max(1, Math.ceil(displayed.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1); // guard against a stale page after filters shrink the list
  const pageItems = displayed.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  // Reset to the first page whenever the result set changes (industry, filters,
  // or search) so the user never lands on an out-of-range page.
  useEffect(() => {
    setPage(0);
  }, [selectedIndustries, workStyleActive, pathActive, vibeActive, q]);

  function goToPage(p) {
    const clamped = Math.max(0, Math.min(p, totalPages - 1));
    setPage(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" }); // bring the card list back to the top
  }

  return (
    <div className="sparq-screen" style={{ padding: "72px 1.25rem 90px", fontFamily: "'Inter',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, flex: 1 }}>Explore Careers</div>
        <button
          onClick={onReplayTour}
          title="Replay the quick tour"
          aria-label="Replay the quick tour"
          style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMid,
            fontSize: 14, fontWeight: 700, cursor: "pointer", lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >?</button>
        <button
          data-tour="sparq"
          onClick={onSparqMode}
          title="Swipe through a fresh set of careers"
          style={{
            background: "linear-gradient(135deg, #7F77DD, #38BDF8)", border: "none",
            borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 700,
            color: "#fff", cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", gap: 5,
            boxShadow: "0 2px 10px rgba(127,119,221,0.35)",
          }}
        >⚡ Sparq Mode</button>
      </div>

      {/* Industry filter — mobile only (the sidebar hosts this on desktop).
          Shares the "industries" tour anchor so the tour spotlights whichever
          of the two (sidebar vs. this button) is visible at the current width. */}
      <button
        data-tour="industries"
        className="mobile-only"
        onClick={() => setIndustryModalOpen(true)}
        style={{
          width: "100%", marginBottom: 14,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          background: T.bgCard, borderRadius: 12, padding: "10px 14px", cursor: "pointer",
          border: `1px solid ${selectedIndustries.length ? T.accent : T.border}`,
          color: selectedIndustries.length ? T.accent : T.textMid,
          fontSize: 13, fontWeight: 700, fontFamily: "inherit",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Industries
        </span>
        {selectedIndustries.length > 0
          ? <span style={{ background: T.accent, color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "1px 8px" }}>{selectedIndustries.length}</span>
          : <span style={{ color: T.textDim, fontSize: 12, fontWeight: 500 }}>All</span>}
      </button>

      {industryModalOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setIndustryModalOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 15000, background: "rgba(10,11,20,0.6)",
            backdropFilter: "blur(2px)", display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}
        >
          <div style={{
            background: T.bgCard, borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderTop: `1px solid ${T.border}`, padding: "18px 18px 26px",
            maxHeight: "78vh", display: "flex", flexDirection: "column",
            boxShadow: "0 -12px 40px rgba(0,0,0,0.5)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Filter by industry</div>
              <button onClick={() => setIndustryModalOpen(false)} style={{ background: "none", border: "none", color: T.textMid, fontSize: 20, lineHeight: 1, cursor: "pointer", padding: "0 2px" }}>✕</button>
            </div>
            <div style={{ overflowY: "auto", display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {INDUSTRY_CONFIG.map(ind => {
                const sel = selectedIndustries.includes(ind.name);
                return (
                  <button
                    key={ind.name}
                    onClick={() => onToggleIndustry(ind.name)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "7px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      border: `1px solid ${sel ? ind.color : T.border}`,
                      background: sel ? `${ind.color}22` : "transparent",
                      color: sel ? ind.color : T.textMid, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    <span style={{ fontSize: 12 }}>{ind.icon}</span>{ind.name}
                    {sel && <span style={{ fontSize: 10, opacity: 0.8 }}>✓</span>}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { [...selectedIndustries].forEach(onToggleIndustry); }}
                disabled={selectedIndustries.length === 0}
                style={{
                  flex: 1, padding: "11px", background: "transparent",
                  border: `1px solid ${T.border}`, borderRadius: 12,
                  color: selectedIndustries.length ? T.textMid : T.textDim,
                  fontSize: 14, fontWeight: 600, fontFamily: "inherit",
                  cursor: selectedIndustries.length ? "pointer" : "default",
                  opacity: selectedIndustries.length ? 1 : 0.5,
                }}
              >Clear</button>
              <button
                onClick={() => setIndustryModalOpen(false)}
                style={{
                  flex: 1, padding: "11px",
                  background: "linear-gradient(135deg, #7F77DD, #38BDF8)",
                  border: "none", borderRadius: 12, color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}
              >Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div data-tour="search" style={{ position: "relative", marginBottom: 18 }}>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={T.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search careers..."
          style={{
            width: "100%", padding: "10px 36px 10px 36px",
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: 12, color: T.text, fontSize: 13,
            fontFamily: "inherit", outline: "none", boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
          onFocus={e => { e.target.style.borderColor = focusColor; }}
          onBlur={e => { e.target.style.borderColor = T.border; }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: T.textDim, fontSize: 16, lineHeight: 1, padding: "2px 4px",
            }}
          >×</button>
        )}
      </div>

      {/* Filters */}
      <div data-tour="filters">
        <FilterGroup
          label="Work Style"
          chips={WORK_STYLE_FILTERS}
          isActive={id => workStyleActive.has(id)}
          onToggle={id => toggleSet(setWorkStyleActive, id)}
          color="#38BDF8"
        />
        <FilterGroup
          label="Path"
          chips={PATH_FILTERS}
          isActive={id => pathActive === id}
          onToggle={id => setPathActive(p => p === id ? null : id)}
          color="#22C55E"
        />
        <FilterGroup
          label="Vibe"
          chips={VIBE_FILTERS}
          isActive={id => vibeActive.has(id)}
          onToggle={id => toggleSet(setVibeActive, id)}
          color="#A78BFA"
        />
      </div>

      {/* Loading hint. We intentionally do NOT show a total career count — some
          industries have hundreds/thousands; page position is shown instead. */}
      {!showEmptyState && loading && (
        <div style={{ fontSize: 11, color: T.textDim, marginBottom: 14, marginTop: 4 }}>
          Finding careers…
        </div>
      )}

      {/* No industry selected — prompt to pick one instead of showing all 6,000+.
          Not gated on `loading`: with no industry we never show cards, so this
          should render immediately on first load, before careers finish fetching. */}
      {showEmptyState && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{
            fontSize: 44, marginBottom: 12, lineHeight: 1, display: "inline-block",
            background: "linear-gradient(135deg, #7F77DD, #38BDF8)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent", color: "transparent",
          }}>◈</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>Start exploring</div>
          <div style={{ fontSize: 13, color: T.textMid, marginBottom: 18 }}>Pick an industry to start exploring careers.</div>
          <button
            className="mobile-only"
            onClick={() => setIndustryModalOpen(true)}
            style={{
              display: "block", margin: "0 auto", padding: "11px 24px",
              background: "linear-gradient(135deg, #7F77DD, #38BDF8)", border: "none",
              borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >Choose industries</button>
        </div>
      )}

      {/* Grid */}
      {showEmptyState ? null : loading ? (
        <div className="career-card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16,
              padding: "14px", height: 110,
            }}>
              <div style={{ background: T.border, borderRadius: 6, height: 13, width: "70%", marginBottom: 10, opacity: 0.5 }} />
              <div style={{ background: T.border, borderRadius: 20, height: 18, width: "45%", marginBottom: 10, opacity: 0.3 }} />
              <div style={{ background: T.border, borderRadius: 6, height: 11, width: "90%", marginBottom: 5, opacity: 0.25 }} />
              <div style={{ background: T.border, borderRadius: 6, height: 11, width: "75%", opacity: 0.25 }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="career-card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {pageItems.map(c => (
            <CareerCard
              key={c.id || c.name}
              career={c}
              onClick={() => onViewCareer(c, getConfig(c.primary_industry).color)}
              isStarred={starredIds?.has(c.id)}
              onToggleStar={onToggleStar}
            />
          ))}
        </div>
      )}

      {/* Page control — light "‹ Prev · Page X of Y · Next ›", no total count. */}
      {!loading && !showEmptyState && displayed.length > 0 && totalPages > 1 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 16, marginTop: 22,
        }}>
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 0}
            style={{
              background: "none", border: "none", padding: "6px 8px",
              color: safePage === 0 ? T.textDim : T.textMid,
              fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              cursor: safePage === 0 ? "default" : "pointer",
              opacity: safePage === 0 ? 0.5 : 1,
            }}
          >‹ Prev</button>
          <span style={{ fontSize: 12, color: T.textMid, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
            Page {safePage + 1} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages - 1}
            style={{
              background: "none", border: "none", padding: "6px 8px",
              color: safePage >= totalPages - 1 ? T.textDim : T.textMid,
              fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              cursor: safePage >= totalPages - 1 ? "default" : "pointer",
              opacity: safePage >= totalPages - 1 ? 0.5 : 1,
            }}
          >Next ›</button>
        </div>
      )}

      {!loading && !showEmptyState && displayed.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          {hasSearch ? (
            <div style={{
              fontSize: 44, marginBottom: 12, lineHeight: 1, display: "inline-block",
              background: "linear-gradient(135deg, #7F77DD, #38BDF8)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent", color: "transparent",
            }}>◈</div>
          ) : (
            <div style={{ fontSize: 36, marginBottom: 12 }}>◎</div>
          )}
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>
            {hasSearch ? "No careers found" : "No careers match"}
          </div>
          <div style={{ fontSize: 13, color: T.textMid }}>
            {hasSearch
              ? (noIndustrySelected
                  ? `No careers found for "${queryText}" — try browsing an industry instead.`
                  : `No careers found for "${queryText}" in ${selectedIndustryNames} — try clearing the filter or browsing a different industry.`)
              : "Try removing a filter or selecting different industries."}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shortlist helpers ────────────────────────────────────────────────────────

const GROUP_BY_OPTIONS = [
  { value: "industry",   label: "Industry" },
  { value: "workstyle",  label: "Work Style" },
  { value: "salary",     label: "Salary" },
  { value: "experience", label: "Experience level" },
];

const SALARY_ORDER = ["Under $70k", "$70k – $100k", "$100k – $140k", "$140k+", "Salary unlisted"];

function salaryBucket(salaryStr) {
  const nums = (salaryStr || "").match(/\d+/g);
  if (!nums) return "Salary unlisted";
  const lo = parseInt(nums[0]);
  if (lo < 70)  return "Under $70k";
  if (lo < 100) return "$70k – $100k";
  if (lo < 140) return "$100k – $140k";
  return "$140k+";
}

function experienceGroup(degreeRequired) {
  const d = (degreeRequired || "").trim().toLowerCase();
  if (d === "no")        return "No degree needed";
  if (d === "sometimes") return "Degree helpful";
  if (d === "yes")       return "Degree required";
  return "Unspecified";
}

function buildGroups(careers, by) {
  if (!by) return null;
  const map = new Map();
  careers.forEach(c => {
    const key =
      by === "industry"   ? (c.primary_industry || "Other") :
      by === "workstyle"  ? (c.work_style || "Unspecified") :
      by === "salary"     ? salaryBucket(c.salary_range || c.salary || "") :
      /* experience */      experienceGroup(c.degree_required);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(c);
  });
  const pairs = Array.from(map.entries());
  if (by === "salary") {
    return SALARY_ORDER
      .filter(k => map.has(k))
      .map(k => ({ label: k, careers: map.get(k) }));
  }
  return pairs.sort(([a], [b]) => a.localeCompare(b)).map(([label, careers]) => ({ label, careers }));
}

function DeadlineCard({ item, onUnstar }) {
  const wc = DEADLINE_WORLD_COLORS[item.world] || T.accent;

  function handleClick() {
    if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: 16, padding: "14px",
        cursor: item.url ? "pointer" : "default",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => { if (item.url) e.currentTarget.style.borderColor = `${T.accent}88`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, flex: 1, lineHeight: 1.35 }}>{item.n}</div>
        <button
          onClick={e => { e.stopPropagation(); onUnstar(); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 16, lineHeight: 1, padding: "0 0 0 2px", flexShrink: 0,
            color: "#F59E0B",
          }}
        >★</button>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        {item.timing && (
          <span style={{
            fontSize: 10, fontWeight: 600, color: T.textMid, background: T.bgDeep,
            border: `1px solid ${T.border}`, borderRadius: 20, padding: "2px 8px",
          }}>{item.timing}</span>
        )}
        <span style={{
          fontSize: 10, fontWeight: 600, color: wc, background: `${wc}18`,
          border: `1px solid ${wc}40`, borderRadius: 20, padding: "2px 8px",
        }}>{item.world}</span>
      </div>
      <div style={{ fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{item.one}</div>
    </div>
  );
}

function OpportunityCard({ item, onUnstar }) {
  const wc = DEADLINE_WORLD_COLORS[item.industry] || T.accent;
  const showCost = !!item.cost_note && item.cost_note.includes("$");

  function handleClick() {
    if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: 16, padding: "14px",
        cursor: item.url ? "pointer" : "default",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => { if (item.url) e.currentTarget.style.borderColor = `${T.accent}88`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, flex: 1, lineHeight: 1.35 }}>{item.name}</div>
        {showCost && (
          <span title={item.cost_note} style={{
            fontSize: 10, fontWeight: 700, color: T.textMid,
            background: T.bgDeep, border: `1px solid ${T.border}`,
            borderRadius: 20, width: 18, height: 18, flexShrink: 0,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>$</span>
        )}
        <button
          onClick={e => { e.stopPropagation(); onUnstar(); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 16, lineHeight: 1, padding: "0 0 0 2px", flexShrink: 0,
            color: "#F59E0B",
          }}
        >★</button>
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 600, color: wc, background: `${wc}18`,
          border: `1px solid ${wc}40`, borderRadius: 20, padding: "2px 8px",
        }}>{item.industry}</span>
        {item.age_range && (
          <span style={{
            fontSize: 10, fontWeight: 600, color: T.textMid, background: T.bgDeep,
            border: `1px solid ${T.border}`, borderRadius: 20, padding: "2px 8px",
          }}>{item.age_range}</span>
        )}
        {item.status && (
          <span style={{
            fontSize: 10, fontWeight: 600, color: T.textMid, background: T.bgDeep,
            border: `1px solid ${T.border}`, borderRadius: 20, padding: "2px 8px",
          }}>Status: {item.status}</span>
        )}
      </div>
      <div style={{ fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{item.wow_line}</div>
    </div>
  );
}

function ShortlistScreen({ allCareers, starredIds, onViewCareer, onToggleStar, onGoToExplore, starredWhenItems, onToggleWhenStar, onGoToWhenToApply, starredOpportunities, onToggleOpportunityStar, onGoToHiddenGems, onReplayTour }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [workStyleActive, setWorkStyleActive] = useState(new Set());
  const [pathActive, setPathActive] = useState(null);
  const [vibeActive, setVibeActive] = useState(new Set());
  const [groupBy, setGroupBy] = useState("");
  const [activeTab, setActiveTab] = useState("careers");

  function toggleSet(setter, id) {
    setter(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const starred  = allCareers.filter(c => starredIds.has(c.id));
  const loading  = allCareers.length === 0 && starredIds.size > 0;
  const q        = searchQuery.trim().toLowerCase();
  const hasFilters = q || workStyleActive.size > 0 || pathActive || vibeActive.size > 0;

  const filtered = starred
    .filter(c => !q || (c.name || "").toLowerCase().includes(q) || (c.description || c.desc || "").toLowerCase().includes(q))
    .filter(c => matchesWorkStyle(c.work_style, workStyleActive))
    .filter(c => !pathActive || (c.degree_required || "").toLowerCase() === pathActive.toLowerCase())
    .filter(c => matchesVibe(c, vibeActive));

  const groups = buildGroups(filtered, groupBy);
  const starredDeadlines = Array.from((starredWhenItems || new Map()).values());
  const starredOpps = Array.from((starredOpportunities || new Map()).values());

  function CardGrid({ careers }) {
    return (
      <div className="career-card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {careers.map(c => (
          <CareerCard
            key={c.id}
            career={c}
            onClick={() => onViewCareer(c, getConfig(c.primary_industry).color)}
            isStarred={true}
            onToggleStar={onToggleStar}
          />
        ))}
      </div>
    );
  }

  const TABS = [
    { id: "careers",       label: "Careers" },
    { id: "deadlines",     label: "Deadlines" },
    { id: "opportunities", label: "Opportunities" },
    { id: "scholarships",  label: "Scholarships" },
  ];

  return (
    <div className="sparq-screen" style={{ padding: "72px 1.25rem 90px", fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Your Shortlist</div>
          {activeTab === "careers" && !loading && starred.length > 0 && (
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 3 }}>
              {starred.length} starred career{starred.length !== 1 ? "s" : ""}
            </div>
          )}
          {activeTab === "deadlines" && starredDeadlines.length > 0 && (
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 3 }}>
              {starredDeadlines.length} saved deadline{starredDeadlines.length !== 1 ? "s" : ""}
            </div>
          )}
          {activeTab === "opportunities" && starredOpps.length > 0 && (
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 3 }}>
              {starredOpps.length} saved opportunit{starredOpps.length !== 1 ? "ies" : "y"}
            </div>
          )}
        </div>
        <button
          onClick={onReplayTour}
          title="Replay the quick tour"
          aria-label="Replay the quick tour"
          style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMid,
            fontSize: 14, fontWeight: 700, cursor: "pointer", lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >?</button>
        {activeTab === "careers" && starred.length > 0 && (
          <div data-tour="shortlist-groupby" style={{ position: "relative", flexShrink: 0 }}>
            <select
              value={groupBy}
              onChange={e => setGroupBy(e.target.value)}
              style={{
                background: T.bgCard, border: `1px solid ${groupBy ? T.accent : T.border}`,
                borderRadius: 10, color: groupBy ? T.accent : T.textMid,
                fontSize: 12, fontWeight: 600, padding: "7px 28px 7px 10px",
                cursor: "pointer", fontFamily: "inherit", outline: "none",
                appearance: "none", WebkitAppearance: "none",
              }}
            >
              <option value="">Group by…</option>
              {GROUP_BY_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke={groupBy ? T.accent : T.textMid} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div data-tour="shortlist-tabs" style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 14px", fontSize: 12, fontWeight: 700,
                background: "transparent", border: "none", cursor: "pointer",
                color: active ? T.accent : T.textMid,
                borderBottom: `2px solid ${active ? T.accent : "transparent"}`,
                marginBottom: -1, fontFamily: "inherit",
                transition: "color 0.15s", whiteSpace: "nowrap",
              }}
            >{tab.label}</button>
          );
        })}
      </div>

      {/* ── Careers tab ── */}
      {activeTab === "careers" && (
        <>
          {loading && (
            <div style={{ textAlign: "center", padding: "48px 20px", color: T.textMid, fontSize: 14 }}>Loading…</div>
          )}
          {!loading && starred.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 44, marginBottom: 14, color: T.textDim }}>☆</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>
                No careers starred yet — explore to find ones you love
              </div>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 24 }}>
                Tap <strong style={{ color: "#F59E0B" }}>☆</strong> on any career card or roadmap to save it here.
              </div>
              <button onClick={onGoToExplore} style={{
                padding: "11px 28px",
                background: "linear-gradient(135deg, #7F77DD, #38BDF8)",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>Explore Careers →</button>
            </div>
          )}
          {!loading && starred.length > 0 && (
            <>
              <div data-tour="shortlist-filters">
              <div style={{ position: "relative", marginBottom: 18 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={T.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                >
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search your shortlist..."
                  style={{
                    width: "100%", padding: "10px 36px 10px 36px",
                    background: T.bgCard, border: `1px solid ${T.border}`,
                    borderRadius: 12, color: T.text, fontSize: 13,
                    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => { e.target.style.borderColor = T.accent; }}
                  onBlur={e => { e.target.style.borderColor = T.border; }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: T.textDim, fontSize: 16, lineHeight: 1, padding: "2px 4px",
                  }}>×</button>
                )}
              </div>
              <FilterGroup label="Work Style" chips={WORK_STYLE_FILTERS}
                isActive={id => workStyleActive.has(id)}
                onToggle={id => toggleSet(setWorkStyleActive, id)} color="#38BDF8" />
              <FilterGroup label="Path" chips={PATH_FILTERS}
                isActive={id => pathActive === id}
                onToggle={id => setPathActive(p => p === id ? null : id)} color="#22C55E" />
              <FilterGroup label="Vibe" chips={VIBE_FILTERS}
                isActive={id => vibeActive.has(id)}
                onToggle={id => toggleSet(setVibeActive, id)} color="#A78BFA" />
              </div>
              <div style={{ fontSize: 11, color: T.textDim, marginBottom: 14, marginTop: 4 }}>
                {filtered.length} career{filtered.length !== 1 ? "s" : ""}{hasFilters ? " match" : ""}
                {groupBy && filtered.length > 0 && (
                  <span> · grouped by {GROUP_BY_OPTIONS.find(o => o.value === groupBy)?.label}</span>
                )}
              </div>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px 20px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>No matches</div>
                  <div style={{ fontSize: 13, color: T.textMid }}>Try removing a filter.</div>
                </div>
              )}
              {filtered.length > 0 && !groups && <CardGrid careers={filtered} />}
              {filtered.length > 0 && groups && groups.map(({ label, careers: grpCareers }) => (
                <div key={label} style={{ marginBottom: 26 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: T.textDim,
                    textTransform: "uppercase", letterSpacing: "0.11em",
                    marginBottom: 10, display: "flex", alignItems: "center", gap: 7,
                  }}>
                    {label}
                    <span style={{
                      background: T.bgCard, border: `1px solid ${T.border}`,
                      borderRadius: 20, padding: "1px 7px",
                      fontSize: 10, fontWeight: 600, color: T.textMid,
                      textTransform: "none", letterSpacing: 0,
                    }}>{grpCareers.length}</span>
                  </div>
                  <CardGrid careers={grpCareers} />
                </div>
              ))}
            </>
          )}
        </>
      )}

      {/* ── Deadlines tab ── */}
      {activeTab === "deadlines" && (
        starredDeadlines.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 44, marginBottom: 14, color: T.textDim }}>📅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>
              No deadlines saved yet
            </div>
            <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 24 }}>
              Star the ones you're tracking on the When to Apply page and they'll show up here.
            </div>
            <button onClick={onGoToWhenToApply} style={{
              padding: "11px 28px",
              background: "linear-gradient(135deg, #7F77DD, #38BDF8)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>When to Apply →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {starredDeadlines.map(item => (
              <DeadlineCard
                key={item.n}
                item={item}
                onUnstar={() => onToggleWhenStar(item)}
              />
            ))}
          </div>
        )
      )}

      {/* ── Opportunities tab ── */}
      {activeTab === "opportunities" && (
        starredOpps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 44, marginBottom: 14, color: T.textDim }}>◆</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>
              No opportunities saved yet
            </div>
            <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>
              Star the hidden gems you're interested in on the Hidden Gems page and they'll show up here.
            </div>
            <button onClick={onGoToHiddenGems} style={{
              padding: "11px 28px",
              background: "linear-gradient(135deg, #7F77DD, #38BDF8)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>Hidden Gems →</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {starredOpps.map(item => (
              <OpportunityCard
                key={item.name}
                item={item}
                onUnstar={() => onToggleOpportunityStar(item)}
              />
            ))}
          </div>
        )
      )}

      {/* ── Scholarships tab ── */}
      {activeTab === "scholarships" && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 44, marginBottom: 14, color: T.textDim }}>🎓</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>
            Scholarships coming soon
          </div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, maxWidth: 320, margin: "0 auto" }}>
            Find scholarships matched to your interests, plus wildcard ones open to everyone.
          </div>
        </div>
      )}
    </div>
  );
}

function BottomNav({ screen, onNavigate }) {
  const tabs = [
    { id: "home",         label: "Explore",   icon: "◈" },
    { id: "shortlist",    label: "Shortlist", icon: "★" },
    { id: "guide",        label: "Guide",     icon: "📖" },
    { id: "when-to-apply", label: "Apply",    icon: "📅" },
    { id: "hidden-gems",  label: "Gems",      icon: "◆" },
  ];
  return (
    <div className="sparq-bottom-nav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(26,29,46,0.97)", backdropFilter: "blur(12px)",
      borderTop: `1px solid ${T.border}`,
      display: "flex",
      fontFamily: "'Inter',system-ui,sans-serif",
    }}>
      {tabs.map(tab => {
        const active = screen === tab.id;
        const inner = (
          <>
            <span style={{ fontSize: 18, color: active ? T.accent : T.textDim }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: active ? T.accent : T.textDim, letterSpacing: "0.04em" }}>
              {tab.label}
            </span>
          </>
        );
        const sharedStyle = {
          flex: 1, padding: "10px 8px 14px",
          background: "transparent", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
        };
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)} style={sharedStyle}>{inner}</button>
        );
      })}
    </div>
  );
}

// ─── State helpers ─────────────────────────────────────────────────────────────

const RESTORABLE = new Set(["home", "shortlist", "guide", "when-to-apply", "hidden-gems"]);
function ls(key, fallback) { try { const v = localStorage.getItem(key); return v != null ? JSON.parse(v) : fallback; } catch { return fallback; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ─── Sparq Mode ────────────────────────────────────────────────────────────────
// Swipeable, one-card-at-a-time discovery deck. All persistence uses the same
// localStorage-JSON pattern as the starred/saved items above.
const SPARQ_KEYS = {
  skipped: "sparq_skipped_careers",       // number[] — swiped-left ids, excluded forever
  recent:  "sparq_recently_shown",        // { [id]: "YYYY-MM-DD" } — excluded for 30 days
  clicks:  "sparq_industry_clicks",       // { [industryName]: count } — sidebar-select tally
  daily:   "sparq_daily_set",             // { date: "YYYY-MM-DD", ids: number[] }
  searches: "sparq_search_terms",         // string[] — recent career-search terms (newest first)
};
const SPARQ_DECK_SIZE = 6;
const SPARQ_PROFILE_CARDS = 3;            // from the user's own worlds
const SPARQ_RECENT_DAYS = 30;
const SPARQ_BATCH = 20;                   // cards per "load more" batch after the initial deck

// Local calendar date as YYYY-MM-DD (used for daily-set + recently-shown stamps).
function sparqToday() {
  const d = new Date();
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function toTagList(v) {
  if (Array.isArray(v)) return v.map(x => String(x).trim().toLowerCase()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
  return [];
}
function toSecondaryList(v) {
  if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map(x => x.trim()).filter(Boolean);
  return [];
}

// Was this career shown in Sparq Mode within the last SPARQ_RECENT_DAYS?
function shownRecently(id, recentMap, todayStr) {
  const day = recentMap[id];
  if (!day) return false;
  const then = Date.parse(day + "T00:00:00");
  const now = Date.parse(todayStr + "T00:00:00");
  if (isNaN(then) || isNaN(now)) return false;
  return (now - then) / 86400000 < SPARQ_RECENT_DAYS;
}

// Weighted-without-replacement pick of `n` industries, biased by click counts
// (weight = clicks + 1 so unclicked worlds still rotate in).
function pickIndustriesWeighted(industries, clicks, n) {
  const pool = [...industries];
  const chosen = [];
  while (chosen.length < n && pool.length) {
    const weights = pool.map(ind => (clicks[ind] || 0) + 1);
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    let i = 0;
    for (; i < weights.length; i++) { r -= weights[i]; if (r <= 0) break; }
    if (i >= pool.length) i = pool.length - 1;
    chosen.push(pool.splice(i, 1)[0]);
  }
  return chosen;
}

function pickRandom(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

// Build today's deck of up to 6 careers. Returns an array of career ids.
// - 3 "profile" cards: primary industry ∈ the user's worlds, industries chosen
//   weighted by how often they've been clicked into.
// - 3 "wildcard" cards: primary industry OUTSIDE their worlds but adjacent —
//   either tagged with one of their worlds as a secondary industry, or sharing a
//   niche/skill tag with careers they've shortlisted. Never zero-overlap.
// Excludes the permanent skip list and anything shown in the last 30 days.
function buildSparqDeck(allCareers, { profileIndustries, industryClicks, skipped, recentMap, nicheTags, todayStr }) {
  const skipSet = new Set(skipped);
  const profSet = new Set(profileIndustries);
  const eligible = allCareers.filter(c =>
    c.id != null && !skipSet.has(c.id) && !shownRecently(c.id, recentMap, todayStr)
  );

  const profilePool = eligible.filter(c => profSet.has(c.primary_industry));
  const wildcardPool = eligible.filter(c => {
    if (profSet.has(c.primary_industry)) return false;
    const secMatch = toSecondaryList(c.secondary_industries).some(s => profSet.has(s));
    if (secMatch) return true;
    if (nicheTags.size === 0) return false;
    const tags = [...toTagList(c.keywords), ...toTagList(c.traits)];
    return tags.some(t => nicheTags.has(t));
  });

  const used = new Set();
  const take = c => { used.add(c.id); return c; };

  // Profile cards — one per weighted-chosen industry, then backfill from the pool.
  const byIndustry = new Map();
  profilePool.forEach(c => {
    if (!byIndustry.has(c.primary_industry)) byIndustry.set(c.primary_industry, []);
    byIndustry.get(c.primary_industry).push(c);
  });
  const profileCards = [];
  const industries = pickIndustriesWeighted([...byIndustry.keys()], industryClicks, SPARQ_PROFILE_CARDS);
  industries.forEach(ind => {
    const pick = pickRandom(byIndustry.get(ind).filter(c => !used.has(c.id)), 1)[0];
    if (pick) profileCards.push(take(pick));
  });
  // If fewer distinct industries than needed, top up from anywhere in the pool.
  pickRandom(profilePool.filter(c => !used.has(c.id)), SPARQ_PROFILE_CARDS - profileCards.length)
    .forEach(c => profileCards.push(take(c)));

  // Wildcards fill the rest of the deck.
  const wildCards = pickRandom(wildcardPool.filter(c => !used.has(c.id)), SPARQ_DECK_SIZE - profileCards.length)
    .map(take);

  // Last-resort backfill so a thin profile/wildcard pool still yields a full deck.
  const deck = [...profileCards, ...wildCards];
  if (deck.length < SPARQ_DECK_SIZE) {
    pickRandom([...profilePool, ...wildcardPool].filter(c => !used.has(c.id)), SPARQ_DECK_SIZE - deck.length)
      .forEach(c => deck.push(take(c)));
  }
  return deck.map(c => c.id);
}

// Relevance-rank eligible careers for Sparq Mode's continuation batches (cards
// beyond the initial deck). Same signals as buildSparqDeck — the user's profile
// worlds, industry adjacency, and niche/skill overlap with their shortlist —
// PLUS the industries of what they've saved and their recent career searches.
// Returns career objects, most-relevant first. Careers with no relevance signal
// are dropped: continuation never falls back to random/unfiltered filler.
function rankSparqCareers(allCareers, {
  profileIndustries, industryClicks, shortlistIndustries, nicheTags, searchTerms,
  skipped, recentMap, todayStr, excludeIds,
}) {
  const skipSet = new Set(skipped);
  const excludeSet = new Set(excludeIds);
  const profSet = new Set(profileIndustries);
  const shortSet = new Set(shortlistIndustries);
  const clicks = industryClicks || {};
  const terms = (searchTerms || [])
    .map(t => String(t).trim().toLowerCase())
    .filter(t => t.length >= 3);

  const scored = [];
  for (const c of allCareers) {
    if (c.id == null || skipSet.has(c.id) || excludeSet.has(c.id)) continue;
    const primary = c.primary_industry;
    const secs = toSecondaryList(c.secondary_industries);
    let score = 0;

    // 1) Profile worlds — strongest signal, boosted by how often they're opened.
    if (profSet.has(primary)) score += 100 + (clicks[primary] || 0) * 5;
    else if (secs.some(s => profSet.has(s))) score += 45;

    // 2) Shortlist adjacency — same or related industry to something they saved.
    if (!profSet.has(primary)) {
      if (shortSet.has(primary)) score += 55;
      else if (secs.some(s => shortSet.has(s))) score += 30;
    }

    // 3) Niche/skill overlap with shortlisted careers.
    const tags = [...toTagList(c.keywords), ...toTagList(c.traits)];
    let nicheHits = 0;
    for (const t of tags) if (nicheTags.has(t)) nicheHits++;
    score += Math.min(nicheHits, 4) * 12;

    // 4) Search history — careers matching what they've searched for.
    if (terms.length) {
      const hay = `${c.name || ""} ${tags.join(" ")}`.toLowerCase();
      let searchHits = 0;
      for (const term of terms) if (hay.includes(term)) searchHits++;
      score += Math.min(searchHits, 4) * 20;
    }

    if (score <= 0) continue; // relevance-only — no random filler

    if (shownRecently(c.id, recentMap, todayStr)) score -= 25; // prefer fresh
    score += Math.random() * 5; // jitter so equal-score cards vary in order

    scored.push({ c, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.c);
}

// One swipeable card. Drag past threshold, or an external `command` (X/star
// buttons, arrow keys), flies the card off with a tilt and then fires onExit;
// a click that isn't a drag fires onOpen (→ the career's roadmap page).
function SparqCard({ career, onExit, onOpen, isTop, command }) {
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef(null);
  const moved = useRef(false);
  const exiting = useRef(false); // guards against double-firing the exit
  const cfg = getConfig(career.primary_industry);
  const secondary = toSecondaryList(career.secondary_industries).filter(s => s !== career.primary_industry);
  const allInd = [career.primary_industry, ...secondary].filter(Boolean);
  const desc = career.description || career.desc || "";
  const THRESHOLD = 90;
  const EXIT_MS = 260; // snappy Tinder-style slide-off (200–300ms range)
  const OFFSCREEN = (typeof window !== "undefined" && window.innerWidth) || 800;

  // A command (X/star button or arrow key) from the overlay: the offscreen
  // transform is derived during render below; here we only schedule the advance
  // after the CSS transition finishes (timeout + ref — no setState in effect).
  const commandedDir = isTop && command ? (command === "right" ? 1 : -1) : 0;
  useEffect(() => {
    if (!commandedDir) return;
    exiting.current = true;
    const t = setTimeout(() => onExit(commandedDir > 0 ? "right" : "left"), EXIT_MS);
    return () => clearTimeout(t);
  }, [commandedDir]); // eslint-disable-line react-hooks/exhaustive-deps

  function down(e) {
    if (!isTop || exiting.current || commandedDir) return;
    start.current = e.clientX;
    moved.current = false;
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function move(e) {
    if (start.current == null) return;
    const dx = e.clientX - start.current;
    if (Math.abs(dx) > 6) moved.current = true;
    setDrag(dx);
  }
  function up() {
    if (start.current == null) return;
    start.current = null;
    setDragging(false);
    if (Math.abs(drag) >= THRESHOLD) {
      // Past threshold → fling off, then advance after the animation.
      exiting.current = true;
      const dir = drag > 0 ? 1 : -1;
      setDrag(dir * OFFSCREEN);
      setTimeout(() => onExit(dir > 0 ? "right" : "left"), EXIT_MS);
    } else {
      if (!moved.current) onOpen(); // a tap (no real drag) opens the roadmap
      setDrag(0); // otherwise snap back to center
    }
  }

  // translateX comes from the finger while dragging, or the commanded fly-out.
  const tx = commandedDir ? commandedDir * OFFSCREEN : drag;
  const rot = Math.max(-18, Math.min(18, tx / 18)); // capped tilt, even mid-fly
  const rightHint = Math.max(0, Math.min(1, tx / THRESHOLD));
  const leftHint = Math.max(0, Math.min(1, -tx / THRESHOLD));

  return (
    <div
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      style={{
        position: "absolute", inset: 0,
        transform: `translateX(${tx}px) rotate(${rot}deg) scale(${isTop ? 1 : 0.95})`,
        transition: dragging ? "none" : `transform ${EXIT_MS / 1000}s ease-out`,
        touchAction: "pan-y", cursor: isTop ? "grab" : "default", userSelect: "none",
      }}
    >
      <div style={{
        position: "relative", height: "100%", boxSizing: "border-box",
        // Match the Explore Careers card: neutral border + inset left accent in
        // the primary-industry color; keep the elevated drop shadow for depth.
        background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 20,
        boxShadow: `inset 4px 0 0 ${cfg.color}, 0 12px 40px rgba(0,0,0,0.45)`,
        padding: "22px 20px 22px 24px", display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Save / Skip drag hints */}
        <div style={{
          position: "absolute", top: 18, left: 18, opacity: rightHint,
          border: "2px solid #22C55E", color: "#22C55E", borderRadius: 10,
          padding: "3px 10px", fontSize: 13, fontWeight: 800, transform: "rotate(-12deg)",
        }}>SAVE</div>
        <div style={{
          position: "absolute", top: 18, right: 18, opacity: leftHint,
          border: "2px solid #EF4444", color: "#EF4444", borderRadius: 10,
          padding: "3px 10px", fontSize: 13, fontWeight: 800, transform: "rotate(12deg)",
        }}>SKIP</div>

        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, lineHeight: 1.25, marginBottom: 12, marginTop: 8 }}>
          {career.name || career.title}
        </div>
        {allInd.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
            {allInd.map(ind => {
              const ic = getConfig(ind);
              return (
                <span key={ind} style={{
                  fontSize: 11, fontWeight: 600, color: ic.color,
                  background: `${ic.color}18`, border: `1px solid ${ic.color}40`,
                  borderRadius: 20, padding: "3px 10px",
                }}>{ind}</span>
              );
            })}
          </div>
        )}
        {career.salary_range || career.salary ? (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textMid }}>
              💰 {career.salary_range || career.salary}
            </div>
            <SalaryNote style={{ marginTop: 3 }} />
          </div>
        ) : null}
        {desc && (
          <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.6, flex: 1, overflow: "hidden" }}>
            {desc.length > 260 ? desc.slice(0, 260) + "…" : desc}
          </div>
        )}
        <div style={{ fontSize: 11, color: T.textDim, marginTop: 14, textAlign: "center" }}>
          Tap card for the full roadmap
        </div>
      </div>
    </div>
  );
}

function SparqModeOverlay({ cards, loading = false, initialIndex = 0, canLoadMore = false, onLoadMore, onClose, onSwipe, onOpenCareer, onOpenProfile }) {
  const [index, setIndex] = useState(initialIndex);
  const [command, setCommand] = useState(null); // { dir, forIndex } — drives the exit animation
  const [tourOpen, setTourOpen] = useState(false);
  const remaining = cards.slice(index);

  // Buttons / keyboard don't advance directly; they ask the top card to fly out.
  function requestSwipe(dir) {
    if (index >= cards.length) return;
    setCommand(prev => (prev && prev.forIndex === index) ? prev : { dir, forIndex: index });
  }

  // Called by the card once its slide-off animation completes.
  function handleExit(dir) {
    const card = cards[index];
    if (card) onSwipe(dir, card);
    setCommand(null);
    setIndex(i => i + 1);
  }

  useEffect(() => {
    function onKey(e) {
      if (tourOpen) return; // the walkthrough owns the keyboard while it's open
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") requestSwipe("right");
      else if (e.key === "ArrowLeft") requestSwipe("left");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // re-bind each render so `index` stays current

  const empty = cards.length === 0;
  const done = index >= cards.length;

  // First-time swipe-deck walkthrough: auto-open once real cards are on screen.
  useEffect(() => {
    if (loading || done || cards.length === 0) return;
    if (localStorage.getItem(SPARQ_TOUR_KEY)) return;
    const t = setTimeout(() => {
      if (!document.querySelector('[data-tour="sparq-card"]')) return;
      setTourOpen(true);
      try { localStorage.setItem(SPARQ_TOUR_KEY, "1"); } catch { /* ignore */ }
    }, 500);
    return () => clearTimeout(t);
  }, [loading, done, cards.length]);
  const showCount = !loading && cards.length > 0;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000, background: "rgba(10,11,20,0.92)",
      backdropFilter: "blur(6px)", display: "flex", flexDirection: "column",
      alignItems: "center", padding: "20px 16px", boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ width: "100%", maxWidth: 460, display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: T.text, flex: 1 }}>⚡ Sparq Mode</div>
        <div style={{ fontSize: 12, color: T.textMid }}>
          {showCount ? (done ? `${cards.length} of ${cards.length}` : `${index + 1} of ${cards.length}`) : ""}
        </div>
        {!loading && !done && (
          <button
            onClick={() => setTourOpen(true)}
            title="Replay the quick tour"
            aria-label="Replay the quick tour"
            style={{
              width: 32, height: 32, borderRadius: 10,
              background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMid,
              fontSize: 14, fontWeight: 700, lineHeight: 1, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >?</button>
        )}
        <button
          onClick={onClose}
          style={{
            background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10,
            color: T.textMid, fontSize: 16, lineHeight: 1, padding: "6px 11px", cursor: "pointer",
          }}
        >×</button>
      </div>

      {/* Card stack */}
      <div style={{ position: "relative", width: "100%", maxWidth: 460, flex: 1, maxHeight: 560, marginBottom: 18 }}>
        {loading ? (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24,
          }}>
            <div className="sparq-spinner" style={{
              width: 34, height: 34, borderRadius: "50%", marginBottom: 16,
              border: `3px solid ${T.border}`, borderTopColor: T.accent,
            }} />
            <div style={{ fontSize: 14, color: T.textMid }}>Building your set…</div>
          </div>
        ) : done ? (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24,
          }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{empty ? "🧭" : "✨"}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 6 }}>
              {empty ? "Set up your industries first" : canLoadMore ? "Want to keep going?" : "You've seen them all"}
            </div>
            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 20, maxWidth: 300 }}>
              {empty
                ? "Sparq Mode builds your set from the industries saved in your profile. Add a few in your profile settings to get started."
                : canLoadMore
                  ? "Here's a fresh batch of careers picked for you — keep swiping, or call it for now."
                  : "That's every career we can match to you right now. Saved ones are in your Shortlist."}
            </div>
            {empty && onOpenProfile ? (
              <button
                onClick={onOpenProfile}
                style={{
                  background: T.accent, border: "none", borderRadius: 12, color: "#fff",
                  fontSize: 14, fontWeight: 700, padding: "10px 22px", cursor: "pointer",
                }}
              >Open profile settings</button>
            ) : canLoadMore ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={onLoadMore}
                  style={{
                    background: T.accent, border: "none", borderRadius: 12, color: "#fff",
                    fontSize: 14, fontWeight: 700, padding: "10px 22px", cursor: "pointer",
                  }}
                >See more cards</button>
                <button
                  onClick={onClose}
                  style={{
                    background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12,
                    color: T.textMid, fontSize: 14, fontWeight: 700, padding: "10px 22px", cursor: "pointer",
                  }}
                >Close</button>
              </div>
            ) : (
              <button
                onClick={onClose}
                style={{
                  background: T.accent, border: "none", borderRadius: 12, color: "#fff",
                  fontSize: 14, fontWeight: 700, padding: "10px 22px", cursor: "pointer",
                }}
              >Close</button>
            )}
          </div>
        ) : (
          // Render a couple beneath the top card for depth, top card last (on top).
          remaining.slice(0, 3).map((card, i) => {
            const isTop = i === 0;
            return (
              <div key={card.id} data-tour={isTop ? "sparq-card" : undefined} style={{ position: "absolute", inset: 0, zIndex: 10 - i, pointerEvents: isTop ? "auto" : "none" }}>
                <SparqCard
                  career={card}
                  isTop={isTop}
                  command={isTop && command && command.forIndex === index ? command.dir : null}
                  onExit={handleExit}
                  onOpen={() => onOpenCareer(card, index)}
                />
              </div>
            );
          }).reverse()
        )}
      </div>

      {/* First-card affordance — faint, only on card 1, fades out once they engage */}
      {!loading && !done && index === 0 && (
        <div style={{
          fontSize: 12, color: T.textMid, opacity: 0.6, marginBottom: 12,
          textAlign: "center", letterSpacing: "0.02em",
        }}>
          ‹ Swipe the card, or tap ✕ / ★ ›
        </div>
      )}

      {/* Controls */}
      {!loading && !done && (
        <div data-tour="sparq-controls" style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <button
            onClick={() => requestSwipe("left")}
            title="Skip (never show again)"
            style={{
              width: 58, height: 58, borderRadius: "50%", cursor: "pointer",
              background: T.bgCard, border: `2px solid #EF4444`, color: "#EF4444",
              fontSize: 24, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
          <button
            onClick={() => requestSwipe("right")}
            title="Save to Shortlist"
            style={{
              width: 58, height: 58, borderRadius: "50%", cursor: "pointer",
              background: T.bgCard, border: `2px solid #22C55E`, color: "#22C55E",
              fontSize: 24, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >★</button>
        </div>
      )}

      {tourOpen && (
        <Tour steps={SPARQ_TOUR_STEPS} onClose={() => setTourOpen(false)} />
      )}
    </div>
  );
}

// ─── AppContent ────────────────────────────────────────────────────────────────

function AppContent({ signOut }) {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  // The screen id whose walkthrough is currently open (or null). Routed-screen
  // tours only; the Sparq overlay manages its own.
  const [activeTour, setActiveTour] = useState(null);
  // Whether the initial profile fetch has resolved. The onboarding/quiz decision
  // is made async from that fetch, so the tour must wait for it before it can
  // safely conclude the user is really on a page (and not about to onboard).
  const [profileChecked, setProfileChecked] = useState(false);

  // First-run world selection now happens via the quiz (which saves worlds) and
  // then inline through the sidebar on Explore — there's no standalone picker
  // screen anymore, so new users land on "home" (Explore).
  const [screen, setScreen] = useState(() => {
    const s = ls("ce_screen", "home");
    return RESTORABLE.has(s) ? s : "home";
  });
  const [selectedIndustries, setSelected] = useState(() => {
    const saved = ls("ce_industries", []);
    const validNames = new Set(INDUSTRY_CONFIG.map(c => c.name));
    return saved.filter(i => validNames.has(i));
  });
  const [activeCareer, setActiveCareer] = useState(null);
  const [activeCareerColor, setCareerColor] = useState(null);
  const [prevScreen, setPrevScreen] = useState(null);
  const [allCareers, setAllCareers] = useState([]);
  const [careersLoading, setCareersLoading] = useState(true);

  // Sparq Mode — swipeable discovery deck (see buildSparqDeck / SparqModeOverlay)
  const [sparqOpen, setSparqOpen] = useState(false);
  const [sparqLoading, setSparqLoading] = useState(false); // deck being built (waits on careers fetch)
  const [sparqCards, setSparqCards] = useState([]);
  const [sparqPool, setSparqPool] = useState([]); // relevance-ranked careers queued for "See more" batches
  const [sparqStartIndex, setSparqStartIndex] = useState(0); // card to (re)open on
  const [careerFromSparq, setCareerFromSparq] = useState(false); // did we open the career page from Sparq Mode?
  // The user's saved "Your Worlds" (profiles.industries). Distinct from the
  // sidebar's selectedIndustries filter — Sparq Mode reads THIS, so it reflects
  // the profile the user set up in onboarding/quiz, not the page-level filter.
  const [profileIndustries, setProfileIndustries] = useState(() => normalizeIndustries(ls("ce_profile_industries", [])));

  const [starredIds, setStarredIds] = useState(new Set());

  const [starredWhenItems, setStarredWhenItems] = useState(() => {
    try {
      const s = localStorage.getItem("sparq_when_starred");
      if (!s) return new Map();
      const parsed = JSON.parse(s);
      const map = new Map();
      parsed.forEach(item => {
        if (item && typeof item === "object" && item.n) map.set(item.n, item);
      });
      return map;
    } catch { return new Map(); }
  });

  function toggleWhenStar(item) {
    setStarredWhenItems(prev => {
      const next = new Map(prev);
      if (next.has(item.n)) {
        next.delete(item.n);
      } else {
        next.set(item.n, { type: "deadline", n: item.n, world: item.world, timing: item.timing, one: item.one, url: item.url || "" });
      }
      try { localStorage.setItem("sparq_when_starred", JSON.stringify([...next.values()])); } catch {}
      return next;
    });
  }

  // Hidden Gems data
  const [hiddenGems, setHiddenGems] = useState([]);
  const [hiddenGemsLoading, setHiddenGemsLoading] = useState(true);

  useEffect(() => {
    setHiddenGemsLoading(true);
    fetchHiddenGems()
      .then(gems => { setHiddenGems(gems); setHiddenGemsLoading(false); })
      .catch(err => { console.error("fetchHiddenGems failed:", err); setHiddenGemsLoading(false); });
  }, []);

  // Starred opportunities (Hidden Gems) — same mechanic as deadlines, tagged type "opportunity"
  const [starredOpportunities, setStarredOpportunities] = useState(() => {
    try {
      const s = localStorage.getItem("sparq_opportunities_starred");
      if (!s) return new Map();
      const parsed = JSON.parse(s);
      const map = new Map();
      parsed.forEach(item => {
        if (item && typeof item === "object" && item.name) map.set(item.name, item);
      });
      return map;
    } catch { return new Map(); }
  });

  function toggleOpportunityStar(gem) {
    setStarredOpportunities(prev => {
      const next = new Map(prev);
      if (next.has(gem.name)) {
        next.delete(gem.name);
      } else {
        next.set(gem.name, {
          type: "opportunity",
          name: gem.name,
          industry: gem.industry,
          age_range: gem.age_range,
          wow_line: gem.wow_line,
          status: gem.status,
          url: gem.url || "",
          cost_note: gem.cost_note || "",
        });
      }
      try { localStorage.setItem("sparq_opportunities_starred", JSON.stringify([...next.values()])); } catch {}
      return next;
    });
  }

  // Load starred career IDs once on sign-in
  useEffect(() => {
    if (!user) return;
    supabase.from("saved_careers").select("career_id").eq("user_id", user.id)
      .then(({ data }) => { if (data) setStarredIds(new Set(data.map(r => r.career_id))); });
  }, [user?.id]);

  async function toggleStar(careerId) {
    if (!user || !careerId) return;
    if (starredIds.has(careerId)) {
      await supabase.from("saved_careers").delete().eq("user_id", user.id).eq("career_id", careerId);
      setStarredIds(prev => { const n = new Set(prev); n.delete(careerId); return n; });
    } else {
      await supabase.from("saved_careers").insert({ user_id: user.id, career_id: careerId });
      setStarredIds(prev => new Set([...prev, careerId]));
    }
  }

  // Persisted across career navigation so Back restores exact state
  const savedScrollY = useRef(0);
  const [workStyleActive, setWorkStyleActive] = useState(new Set());
  const [pathActive, setPathActive] = useState(null);
  const [vibeActive, setVibeActive] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Load saved profile preferences
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("industries").eq("id", user.id).maybeSingle().then(({ data, error }) => {
      // Onboarding is gated on whether the user has saved industries — the quiz
      // saves those, so completing it counts as onboarded. (Gating on `name`
      // re-prompted users who finished the quiz but never saved the Profile.)
      if (error || !data || !data.industries?.length) {
        setShowOnboarding(true);
      } else {
        // Returning user with saved industries — seed the Explore filter and
        // Sparq Mode's source. Only accept names that match the current config;
        // normalize because the profile stores slugs, not full names.
        const validNames = new Set(INDUSTRY_CONFIG.map(c => c.name));
        const valid = data.industries.filter(i => validNames.has(i));
        setSelected(valid);
        lsSet("ce_industries", valid);
        const worlds = normalizeIndustries(data.industries);
        setProfileIndustries(worlds);
        lsSet("ce_profile_industries", worlds);
        localStorage.setItem("ce_landing_seen", "1");
      }
      // The onboarding decision (if any) is now made — the tour may consider firing.
      setProfileChecked(true);
    });
  }, [user?.id]);

  // First-time walkthrough per routed screen: auto-open once the user is really
  // on that page with no modal/overlay covering it (so it never appears over the
  // profile modal, onboarding, quiz, or Sparq Mode). Marked seen as soon as it
  // opens so it only auto-shows once; each page's "?" button replays it anytime.
  useEffect(() => {
    if (!profileChecked) return; // wait for the onboarding decision before firing
    if (showProfile || showOnboarding || showQuiz || sparqOpen) return;
    const tour = SCREEN_TOURS[screen];
    if (!tour) return;
    if (localStorage.getItem(tour.key)) return;
    // Shortlist only makes sense once something's been saved.
    if (screen === "shortlist" && starredIds.size === 0) return;
    const t = setTimeout(() => {
      if (showProfile || showOnboarding || showQuiz || sparqOpen) return;
      // The page's real UI must be rendered (first anchor present) before firing.
      if (!document.querySelector(tour.steps[0].selector)) return;
      setActiveTour(screen);
      try { localStorage.setItem(tour.key, "1"); } catch { /* ignore */ }
    }, 450); // let the page lay out first
    return () => clearTimeout(t);
  }, [profileChecked, screen, showProfile, showOnboarding, showQuiz, sparqOpen, starredIds]);

  // Fetch all careers from Supabase
  useEffect(() => {
    setCareersLoading(true);
    fetchCareers()
      .then(careers => {
        if (import.meta.env.DEV) {
          const dist = {};
          careers.forEach(c => { const v = c.degree_required || "(empty)"; dist[v] = (dist[v] || 0) + 1; });
          console.log("[sparq] degree_required values:", dist);
        }
        setAllCareers(careers.map(c => ({
          id: c.id,
          name: c.name,
          title: c.name,
          salary: c.salary_range,
          salary_range: c.salary_range,
          desc: c.description,
          description: c.description,
          primary_industry: c.primary_industry,
          secondary_industries: c.secondary_industries,
          work_style: c.work_style || "",
          degree_required: c.degree_required ? c.degree_required.trim() : "",
          traits: Array.isArray(c.traits) ? c.traits : (c.traits || "").split(",").map(t => t.trim()).filter(Boolean),
          keywords: Array.isArray(c.keywords) ? c.keywords : (c.keywords || "").split(",").map(k => k.trim()).filter(Boolean),
        })));
        setCareersLoading(false);
      })
      .catch(err => { console.error("fetchCareers failed:", err); setCareersLoading(false); });
  }, []);

  useEffect(() => { if (RESTORABLE.has(screen)) lsSet("ce_screen", screen); }, [screen]);
  useEffect(() => { lsSet("ce_industries", selectedIndustries); }, [selectedIndustries]);

  function goTo(s) { setPrevScreen(screen); setScreen(s); }

  function handleViewCareer(career, color) {
    // Default origin is the normal grid; handleSparqOpenCareer re-sets this to
    // true after calling in, so Sparq's Back behavior only applies from Sparq.
    setCareerFromSparq(false);
    if (screen !== "career") savedScrollY.current = window.scrollY;
    window.scrollTo(0, 0);
    const normalized = (career.title && !career.name) ? career : {
      id: career.id,
      title: career.name || career.title,
      salary: career.salary_range || career.salary,
      desc: career.description || career.desc,
      school: "",
      day: "",
      growth: [],
      primary_industry: career.primary_industry,
      secondary_industries: career.secondary_industries,
      keywords: Array.isArray(career.keywords) ? career.keywords
        : (career.keywords || "").split(",").map(k => k.trim()).filter(Boolean),
    };
    setActiveCareer(normalized);
    setCareerColor(color || getConfig(normalized.primary_industry).color);
    goTo("career");
  }

  const showNav = screen === "home" || screen === "shortlist" || screen === "guide" || screen === "when-to-apply" || screen === "hidden-gems";
  const showSidebar = true; // the standalone picker screen is gone; the sidebar is always available

  // The sidebar is an EXPLORATION-ONLY filter: toggling only changes which
  // careers are visible on Explore (and the local click tally that lightly
  // weights Sparq Mode). It never writes to the profile — the Profile page's
  // worlds editor is the single place that saves permanent world selections.
  function handleToggleIndustry(name) {
    setSelected(prev => {
      const wasSelected = prev.includes(name);
      const next = wasSelected ? prev.filter(n => n !== name) : [...prev, name];
      lsSet("ce_industries", next);
      // Tally selections (not deselections) to weight Sparq Mode's profile picks.
      if (!wasSelected) {
        const clicks = ls(SPARQ_KEYS.clicks, {});
        clicks[name] = (clicks[name] || 0) + 1;
        lsSet(SPARQ_KEYS.clicks, clicks);
      }
      return next;
    });
    // Toggling an industry only updates filter state — it never changes the
    // current screen. The active screen re-renders with the new filter applied.
  }

  // Open Sparq Mode. We only flip the overlay into a loading state here; the
  // actual deck is built by the effect below once the careers fetch has resolved
  // (opening immediately after first load would otherwise race an empty
  // allCareers and wrongly show the "Set up Your Worlds" empty state).
  function openSparqMode() {
    setSparqStartIndex(0); // fresh open always starts at the first card
    setSparqCards([]);
    setSparqPool([]);
    setSparqLoading(true);
    setSparqOpen(true);
  }

  // "See more cards" — append the next relevance-ranked batch and keep swiping.
  function loadMoreSparq() {
    const next = sparqPool.slice(0, SPARQ_BATCH);
    if (!next.length) return;
    setSparqCards(cards => [...cards, ...next]);
    setSparqPool(sparqPool.slice(SPARQ_BATCH));
  }

  // Build today's deck. Reads the user's worlds DIRECTLY from profiles.industries
  // (the exact source the profile modal writes), so it can't go stale relative to
  // a cached React state. Reuses today's deck only if it's a non-empty set; a
  // previously-cached EMPTY deck is regenerated. Returns the resolved card list.
  async function computeSparqDeck() {
    const today = sparqToday();
    const byId = new Map(allCareers.map(c => [c.id, c]));
    const skipped = ls(SPARQ_KEYS.skipped, []);
    const skipSet = new Set(skipped);

    let rawIndustries = null;
    let worlds = profileIndustries;
    if (user) {
      const { data, error } = await supabase.from("profiles").select("industries").eq("id", user.id).maybeSingle();
      rawIndustries = data?.industries ?? null;
      if (!error && data) {
        worlds = normalizeIndustries(data.industries);
        setProfileIndustries(worlds);
        lsSet("ce_profile_industries", worlds);
      }
    }

    // Relevance signals shared by the initial deck AND every continuation batch:
    // niche/skill tags and industries drawn from the user's shortlist.
    const nicheTags = new Set();
    const shortlistIndustries = new Set();
    starredIds.forEach(id => {
      const c = byId.get(id);
      if (!c) return;
      if (c.primary_industry) shortlistIndustries.add(c.primary_industry);
      toTagList(c.keywords).forEach(t => nicheTags.add(t));
      toTagList(c.traits).forEach(t => nicheTags.add(t));
    });
    const recentMap = ls(SPARQ_KEYS.recent, {});
    const industryClicks = ls(SPARQ_KEYS.clicks, {});
    const searchTerms = ls(SPARQ_KEYS.searches, []);

    // ── Initial deck (today's 6, cached) ──
    const daily = ls(SPARQ_KEYS.daily, null);
    let ids = null;
    if (daily && daily.date === today && Array.isArray(daily.ids) && daily.ids.length) {
      ids = daily.ids.filter(id => byId.has(id) && !skipSet.has(id));
    }
    if (!ids || ids.length === 0) {
      ids = buildSparqDeck(allCareers, {
        profileIndustries: worlds,
        industryClicks,
        skipped,
        recentMap,
        nicheTags,
        todayStr: today,
      });
      // Only persist / stamp a real (non-empty) deck, so an empty result doesn't
      // lock the user out for the rest of the day.
      if (ids.length) {
        lsSet(SPARQ_KEYS.daily, { date: today, ids });
        ids.forEach(id => { recentMap[id] = today; });
        lsSet(SPARQ_KEYS.recent, recentMap);
      }
    }

    // ── Continuation pool (relevance-ranked, same signals + search history) ──
    // Everything eligible beyond the initial deck, ordered most-relevant first.
    const poolCards = rankSparqCareers(allCareers, {
      profileIndustries: worlds,
      industryClicks,
      shortlistIndustries: [...shortlistIndustries],
      nicheTags,
      searchTerms,
      skipped,
      recentMap,
      todayStr: today,
      excludeIds: ids,
    });

    if (import.meta.env.DEV) {
      console.log("[sparq] raw profiles.industries (what the modal writes):", rawIndustries);
      console.log("[sparq] normalized worlds Sparq uses:", worlds);
      console.log("[sparq] initial deck ids:", ids, "continuation pool size:", poolCards.length);
    }

    return {
      initialCards: ids.map(id => byId.get(id)).filter(Boolean),
      poolCards,
    };
  }

  // Build the deck once the overlay is open AND the careers fetch has finished.
  // Runs only during a fresh open (sparqLoading); the Back-to-deck path reopens
  // with sparqLoading=false and reuses the existing cards at the resume index.
  useEffect(() => {
    if (!sparqOpen || !sparqLoading || careersLoading) return;
    let cancelled = false;
    computeSparqDeck().then(({ initialCards, poolCards }) => {
      if (cancelled) return;
      // Start with only the initial 6-card daily deck, so Sparq pauses and shows
      // the "See more cards / Close" prompt after card 6. All ranked continuation
      // careers stay in the pool and are pulled in SPARQ_BATCH-sized batches when
      // the user taps "See more cards".
      setSparqCards(initialCards);
      setSparqPool(poolCards);
      setSparqLoading(false);
    });
    return () => { cancelled = true; };
  }, [sparqOpen, sparqLoading, careersLoading, allCareers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Swipe right → save to Shortlist (never un-stars); swipe left → permanent skip.
  function handleSparqSwipe(dir, career) {
    if (!career) return;
    if (dir === "right") {
      if (!starredIds.has(career.id)) toggleStar(career.id);
    } else {
      const skipped = ls(SPARQ_KEYS.skipped, []);
      if (!skipped.includes(career.id)) {
        skipped.push(career.id);
        lsSet(SPARQ_KEYS.skipped, skipped);
      }
    }
  }

  function handleSparqOpenCareer(career, index) {
    setSparqStartIndex(index || 0); // resume here when Back is pressed
    setSparqOpen(false);
    handleViewCareer(career, getConfig(career.primary_industry).color);
    setCareerFromSparq(true); // after handleViewCareer, which resets it to false
  }

  // Back from a career page: if we arrived from Sparq Mode, reopen the deck at
  // the same card; otherwise fall back to Explore Careers as before.
  function handleCareerBack() {
    if (careerFromSparq) {
      setCareerFromSparq(false);
      setScreen("home");
      setSparqOpen(true); // remounts overlay at initialIndex={sparqStartIndex}
    } else {
      setScreen("home");
    }
  }

  // Re-pull saved "Your Worlds" from the profile (e.g. after the user edits it
  // in the Profile modal), keeping Sparq Mode's source of truth current without
  // a full reload. Does NOT touch the sidebar filter — that's exploration-only.
  function refreshProfileIndustries() {
    if (!user) return;
    supabase.from("profiles").select("industries").eq("id", user.id).maybeSingle().then(({ data, error }) => {
      // Don't clobber the cached worlds on a failed/empty read — only overwrite
      // when we actually got a row back.
      if (error || !data) return;
      const worlds = normalizeIndustries(data.industries);
      setProfileIndustries(worlds);
      lsSet("ce_profile_industries", worlds);
    });
  }

  return (
    <div className={showSidebar ? "app-shell" : ""} style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter',system-ui,sans-serif" }}>
      {/* Top-right buttons — only on non-pick screens */}
      {showSidebar && (
        <div style={{ position: "fixed", top: 14, right: 16, zIndex: 9999, display: "flex", gap: 8 }}>
          <button
            onClick={() => setShowProfile(true)}
            title="Profile"
            style={{ padding: "6px 10px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textMid, cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
          <button
            onClick={signOut}
            style={{ padding: "6px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 8, color: T.textMid, fontSize: 12, cursor: "pointer" }}
          >Sign out</button>
        </div>
      )}

      {showOnboarding && (
        <OnboardingScreen
          onComplete={() => setShowOnboarding(false)}
          onStartQuiz={() => { setShowOnboarding(false); setShowQuiz(true); }}
        />
      )}
      {showQuiz && (
        <OnboardingQuiz
          onComplete={async (industries) => {
            await supabase.from("profiles").upsert({ id: user.id, industries });
            setShowQuiz(false);
            setShowProfile(true);
          }}
        />
      )}
      {showProfile && (
        <ProfilePage
          onClose={() => { setShowProfile(false); refreshProfileIndustries(); }}
          onRetakeQuiz={() => { setShowProfile(false); setShowQuiz(true); }}
        />
      )}

      {sparqOpen && (
        <SparqModeOverlay
          cards={sparqCards}
          loading={sparqLoading}
          initialIndex={sparqStartIndex}
          canLoadMore={sparqPool.length > 0}
          onLoadMore={loadMoreSparq}
          onClose={() => setSparqOpen(false)}
          onSwipe={handleSparqSwipe}
          onOpenCareer={handleSparqOpenCareer}
          onOpenProfile={() => { setSparqOpen(false); setShowProfile(true); }}
        />
      )}

      {activeTour && screen === activeTour && SCREEN_TOURS[activeTour] && (
        <Tour steps={SCREEN_TOURS[activeTour].steps} onClose={() => setActiveTour(null)} />
      )}

      {/* Sidebar — hidden on the industry picker screen */}
      {showSidebar && (
        <DesktopSidebar
          screen={screen}
          selectedIndustries={selectedIndustries}
          onNavigate={setScreen}
          onToggleIndustry={handleToggleIndustry}
        />
      )}

      {/* Main content */}
      <div className={showSidebar ? "main-content" : ""}>
        {screen === "home" && (
          <CareerGridScreen
            selectedIndustries={selectedIndustries}
            onToggleIndustry={handleToggleIndustry}
            allCareers={allCareers}
            loading={careersLoading}
            onViewCareer={handleViewCareer}
            onSparqMode={openSparqMode}
            workStyleActive={workStyleActive}
            setWorkStyleActive={setWorkStyleActive}
            pathActive={pathActive}
            setPathActive={setPathActive}
            vibeActive={vibeActive}
            setVibeActive={setVibeActive}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            restoreScrollY={savedScrollY.current}
            starredIds={starredIds}
            onToggleStar={toggleStar}
            onReplayTour={() => setActiveTour("home")}
          />
        )}
        {screen === "career" && (
          <CareerTimeline
            career={activeCareer}
            industryColor={activeCareerColor}
            onBack={handleCareerBack}
            onViewCareer={handleViewCareer}
            onExploreIndustry={(industryName) => {
              if (industryName) setSelected([industryName]);
              setScreen("home");
            }}
            isStarred={starredIds.has(activeCareer?.id)}
            onToggleStar={toggleStar}
          />
        )}
        {screen === "shortlist" && (
          <ShortlistScreen
            allCareers={allCareers}
            starredIds={starredIds}
            onViewCareer={handleViewCareer}
            onToggleStar={toggleStar}
            onGoToExplore={() => setScreen("home")}
            starredWhenItems={starredWhenItems}
            onToggleWhenStar={toggleWhenStar}
            onGoToWhenToApply={() => setScreen("when-to-apply")}
            starredOpportunities={starredOpportunities}
            onToggleOpportunityStar={toggleOpportunityStar}
            onGoToHiddenGems={() => setScreen("hidden-gems")}
            onReplayTour={() => setActiveTour("shortlist")}
          />
        )}
        {screen === "guide" && <SparqGuide onReplayTour={() => setActiveTour("guide")} />}
        {screen === "when-to-apply" && (
          <WhenToApply starredItems={starredWhenItems} onToggleStar={toggleWhenStar} onReplayTour={() => setActiveTour("when-to-apply")} />
        )}
        {screen === "hidden-gems" && (
          <HiddenGems
            hiddenGems={hiddenGems}
            loading={hiddenGemsLoading}
            selectedIndustries={selectedIndustries}
            onToggleIndustry={handleToggleIndustry}
            starredItems={starredOpportunities}
            onToggleStar={toggleOpportunityStar}
            onReplayTour={() => setActiveTour("hidden-gems")}
          />
        )}
      </div>

      {/* Bottom nav — mobile only (hidden on desktop via CSS) */}
      {showNav && <BottomNav screen={screen} onNavigate={setScreen} />}
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();

  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <div style={{ color: T.textMid, fontSize: 15 }}>Loading…</div>
    </div>
  );

  if (!user) return <LoginScreen />;

  return <AppContent signOut={signOut} />;
}
