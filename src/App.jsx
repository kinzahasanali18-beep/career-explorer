import { useState, useEffect, useRef, useLayoutEffect } from "react";
import CareerTimeline from "./CareerTimeline";
import { fetchCareers } from "./supabase";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import LoginScreen from "./LoginScreen";
import ProfilePage from "./ProfilePage";
import OnboardingScreen from "./OnboardingScreen";
import OnboardingQuiz from "./OnboardingQuiz";

const T = {
  bg: "#1E2030", bgCard: "#272B40", bgDeep: "#1A1D2E",
  border: "#3D3F55", text: "#E0E8FF", textMid: "#8B8FA8", textDim: "#4A4D66",
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

function DesktopSidebar({ screen, selectedIndustries, onNavigate, onToggleIndustry }) {
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

      <div className="sidebar-divider" />

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

      <button className="sidebar-start-over" onClick={() => onNavigate("pick")}>
        ↩ Change worlds
      </button>
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

function IndustryPickerScreen({ initialSelected, onDone }) {
  const [selected, setSelected] = useState(new Set(initialSelected || []));

  function toggle(name) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter',system-ui,sans-serif" }}>
      <div className="pick-screen-inner">
        <div style={{ fontSize: 28, fontWeight: 800, color: T.text, marginBottom: 6, lineHeight: 1.2 }}>
          What world pulls you in?
        </div>
        <div style={{ fontSize: 14, color: T.textMid, marginBottom: 28, lineHeight: 1.5 }}>
          Pick as many as you like — the more you choose, the more personalized your results.
        </div>

        <div className="industry-pick-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {INDUSTRY_CONFIG.map(ind => {
            const sel = selected.has(ind.name);
            return (
              <div
                key={ind.name}
                onClick={() => toggle(ind.name)}
                style={{
                  background: sel ? ind.bg : T.bgCard,
                  border: `${sel ? 2 : 1}px solid ${sel ? ind.color : T.border}`,
                  borderRadius: 14, padding: "14px 14px 12px",
                  cursor: "pointer", transition: "all 0.12s", position: "relative",
                }}
              >
                {sel && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    width: 20, height: 20, borderRadius: "50%",
                    background: ind.color, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>
                  </div>
                )}
                <div style={{ fontSize: 22, marginBottom: 6 }}>{ind.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{ind.name}</div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onDone(selected.size > 0 ? Array.from(selected) : [])}
          style={{
            width: "100%", padding: "1rem",
            background: "linear-gradient(135deg, #7F77DD, #38BDF8)",
            color: "#fff", border: "none", borderRadius: 14,
            fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12,
          }}
        >Find my careers →</button>
        <button
          onClick={() => onDone([])}
          style={{
            width: "100%", padding: "0.85rem",
            background: "transparent", color: T.textMid,
            border: `1px solid ${T.border}`, borderRadius: 14,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          Skip — explore everything
        </button>
      </div>
    </div>
  );
}

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

function CareerGridScreen({
  selectedIndustries, allCareers, loading, onViewCareer, onChangeIndustries,
  workStyleActive, setWorkStyleActive, pathActive, setPathActive,
  vibeActive, setVibeActive, searchQuery, setSearchQuery, restoreScrollY,
  starredIds, onToggleStar,
}) {
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

  const q = searchQuery.trim().toLowerCase();

  const displayed = allCareers
    .filter(c => selectedIndustries.length === 0 || selectedIndustries.includes(c.primary_industry))
    .filter(c => matchesWorkStyle(c.work_style, workStyleActive))
    .filter(c => !pathActive || (c.degree_required || "").toLowerCase() === pathActive.toLowerCase())
    .filter(c => matchesVibe(c, vibeActive))
    .filter(c => !q ||
      (c.name || "").toLowerCase().includes(q) ||
      (c.description || c.desc || "").toLowerCase().includes(q)
    );

  return (
    <div className="sparq-screen" style={{ padding: "72px 1.25rem 90px", fontFamily: "'Inter',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, flex: 1 }}>Explore Careers</div>
        <button
          onClick={onChangeIndustries}
          style={{
            background: "transparent", border: `1px solid ${T.border}`,
            borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600,
            color: T.textMid, cursor: "pointer", flexShrink: 0,
          }}
        >Change worlds</button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 18 }}>
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
          onFocus={e => { e.target.style.borderColor = T.accent; }}
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

      {/* Count */}
      <div style={{ fontSize: 11, color: T.textDim, marginBottom: 14, marginTop: 4 }}>
        {loading ? "Finding careers…" : `${displayed.length} career${displayed.length !== 1 ? "s" : ""}`}
      </div>

      {/* Grid */}
      {loading ? (
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
          {displayed.map(c => (
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

      {!loading && displayed.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>◎</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>No careers match</div>
          <div style={{ fontSize: 13, color: T.textMid }}>Try removing a filter or selecting different worlds.</div>
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

function ShortlistScreen({ allCareers, starredIds, onViewCareer, onToggleStar, onGoToExplore }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [workStyleActive, setWorkStyleActive] = useState(new Set());
  const [pathActive, setPathActive] = useState(null);
  const [vibeActive, setVibeActive] = useState(new Set());
  const [groupBy, setGroupBy] = useState("");

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

  return (
    <div className="sparq-screen" style={{ padding: "72px 1.25rem 90px", fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Your Shortlist</div>
          {!loading && starred.length > 0 && (
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 3 }}>
              {starred.length} starred career{starred.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {starred.length > 0 && (
          <div style={{ position: "relative", flexShrink: 0 }}>
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

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "48px 20px", color: T.textMid, fontSize: 14 }}>Loading…</div>
      )}

      {/* Empty state — nothing starred */}
      {!loading && starred.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 44, marginBottom: 14, color: T.textDim }}>☆</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>
            No careers starred yet — explore to find ones you love
          </div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 24 }}>
            Tap <strong style={{ color: "#F59E0B" }}>☆</strong> on any career card or roadmap to save it here.
          </div>
          <button
            onClick={onGoToExplore}
            style={{
              padding: "11px 28px",
              background: "linear-gradient(135deg, #7F77DD, #38BDF8)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >Explore Careers →</button>
        </div>
      )}

      {/* Search + filters + grid — only when there are starred careers */}
      {!loading && starred.length > 0 && (
        <>
          {/* Search bar */}
          <div style={{ position: "relative", marginBottom: 18 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={T.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
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

          {/* Result count */}
          <div style={{ fontSize: 11, color: T.textDim, marginBottom: 14, marginTop: 4 }}>
            {filtered.length} career{filtered.length !== 1 ? "s" : ""}{hasFilters ? " match" : ""}
            {groupBy && filtered.length > 0 && (
              <span> · grouped by {GROUP_BY_OPTIONS.find(o => o.value === groupBy)?.label}</span>
            )}
          </div>

          {/* No filter matches */}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 20px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>No matches</div>
              <div style={{ fontSize: 13, color: T.textMid }}>Try removing a filter.</div>
            </div>
          )}

          {/* Flat grid */}
          {filtered.length > 0 && !groups && <CardGrid careers={filtered} />}

          {/* Grouped */}
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
    </div>
  );
}

function BottomNav({ screen, onNavigate }) {
  const tabs = [
    { id: "home",      label: "Explore",   icon: "◈" },
    { id: "shortlist", label: "Shortlist", icon: "★" },
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
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              flex: 1, padding: "10px 8px 14px",
              background: "transparent", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            }}
          >
            <span style={{ fontSize: 18, color: active ? T.accent : T.textDim }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: active ? T.accent : T.textDim, letterSpacing: "0.04em" }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── State helpers ─────────────────────────────────────────────────────────────

const RESTORABLE = new Set(["pick", "home", "shortlist"]);
function ls(key, fallback) { try { const v = localStorage.getItem(key); return v != null ? JSON.parse(v) : fallback; } catch { return fallback; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ─── AppContent ────────────────────────────────────────────────────────────────

function AppContent({ signOut }) {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const [screen, setScreen] = useState(() => {
    const seen = localStorage.getItem("ce_landing_seen") !== null;
    if (!seen) return "pick";
    const s = ls("ce_screen", "pick");
    return RESTORABLE.has(s) ? s : "pick";
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

  const [starredIds, setStarredIds] = useState(new Set());

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
    supabase.from("profiles").select("name, industries").eq("id", user.id).single().then(({ data, error }) => {
      if (error || !data || !data.name) {
        setShowOnboarding(true);
      } else if (data.industries?.length) {
        // Only accept industries that match current full-name config; discard old slugs
        const validNames = new Set(INDUSTRY_CONFIG.map(c => c.name));
        const valid = data.industries.filter(i => validNames.has(i));
        setSelected(valid);
        lsSet("ce_industries", valid);
        localStorage.setItem("ce_landing_seen", "1");
        setScreen(prev => prev === "pick" ? "home" : prev);
      }
    });
  }, [user?.id]);

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

  const showNav = screen === "home" || screen === "shortlist";
  const showSidebar = screen !== "pick";

  function handleToggleIndustry(name) {
    setSelected(prev => {
      const next = prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name];
      lsSet("ce_industries", next);
      return next;
    });
    // If user is on a non-home screen, navigate to home to see filtered results
    if (screen !== "home") setScreen("home");
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
          onClose={() => setShowProfile(false)}
          onRetakeQuiz={() => { setShowProfile(false); setShowQuiz(true); }}
        />
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
        {screen === "pick" && (
          <IndustryPickerScreen
            initialSelected={selectedIndustries}
            onDone={ids => {
              setSelected(ids);
              localStorage.setItem("ce_landing_seen", "1");
              setScreen("home");
            }}
          />
        )}
        {screen === "home" && (
          <CareerGridScreen
            selectedIndustries={selectedIndustries}
            allCareers={allCareers}
            loading={careersLoading}
            onViewCareer={handleViewCareer}
            onChangeIndustries={() => setScreen("pick")}
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
          />
        )}
        {screen === "career" && (
          <CareerTimeline
            career={activeCareer}
            industryColor={activeCareerColor}
            onBack={() => setScreen("home")}
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
