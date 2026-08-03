import { useState } from "react";
import { WORLD_COLORS } from "./WhenToApply";

const T = {
  bg: "var(--bg)", bgCard: "var(--bgCard)", bgDeep: "var(--bgDeep)",
  border: "var(--border)", text: "var(--text)", textMid: "var(--textMid)", textDim: "var(--textDim)",
  accent: "#7F77DD",
};

function worldColor(w) { return WORLD_COLORS[w] || T.accent; }

// Map an age_range display string to a filter category.
function ageCategory(ageRange) {
  const s = (ageRange || "").toLowerCase().trim();
  if (s === "13+" || s === "22 and under") return "both";
  if (/^18|18-23|18\+|college/.test(s)) return "college";
  return "highschool";
}

// Display value for the status footer: drop a leading "Active — " (e.g. "Active —
// summer/fall window" → "Summer/fall window"); non-Active statuses ("Paused for
// 2026", "Verify current status") are shown unchanged.
function statusLabel(status) {
  const s = (status || "").trim();
  const m = s.match(/^active\s*[—-]\s*(.+)$/i);
  if (!m) return s;
  const rest = m[1];
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

const AGE_FILTERS = [
  { id: "all",        label: "All ages" },
  { id: "highschool", label: "High School" },
  { id: "college",    label: "College" },
  { id: "both",       label: "Both" },
];

function matchesAge(gem, ageFilter) {
  if (ageFilter === "all") return true;
  const cat = ageCategory(gem.age_range);
  if (ageFilter === "highschool") return cat === "highschool" || cat === "both";
  if (ageFilter === "college")    return cat === "college" || cat === "both";
  if (ageFilter === "both")       return cat === "both";
  return true;
}

export default function HiddenGems({ hiddenGems = [], loading, selectedIndustries = [], starredItems, onToggleStar, onReplayTour }) {
  const [expanded, setExpanded] = useState(null);
  const [ageFilter, setAgeFilter] = useState("all");

  // Industry filtering is driven by the sidebar's shared `selectedIndustries`
  // state (same source of truth as Explore Careers). An empty array = all.
  const filtered = hiddenGems
    .filter(g => selectedIndustries.length === 0 || selectedIndustries.includes(g.industry))
    .filter(g => matchesAge(g, ageFilter));

  return (
    <div className="sparq-screen" style={{ padding: "72px 1.25rem 90px", fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 22 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 6 }}>Hidden Gems</div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.55 }}>
            The wait-that's-real programs most students never hear about — curated, not crowdsourced.
          </div>
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
      </div>

      {/* Age group filter row — page-specific; industry filtering lives in the sidebar */}
      <div data-tour="gems-age" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {AGE_FILTERS.map(f => {
          const active = ageFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setAgeFilter(f.id)}
              style={{
                padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: `1px solid ${active ? T.text : T.border}`,
                background: active ? "color-mix(in srgb, var(--textMid) 13%, transparent)" : "transparent",
                color: active ? T.text : T.textMid,
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >{f.label}</button>
          );
        })}
      </div>

      {/* Count / loading */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: T.textMid, fontSize: 14 }}>Loading…</div>
      ) : (
        <div style={{ fontSize: 11, color: T.textDim, marginBottom: 14 }}>
          {filtered.length} program{filtered.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Cards — same responsive grid + card anatomy as Explore Careers */}
      {!loading && (
        <div className="career-card-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "start" }}>
          {filtered.map(gem => {
            const isOpen = expanded === gem.id;
            const wc = worldColor(gem.industry);
            const isStarred = starredItems?.has(gem.name);

            return (
              <div
                key={gem.id}
                onClick={() => setExpanded(isOpen ? null : gem.id)}
                style={{
                  background: T.bgCard, border: `1px solid ${isOpen ? wc : T.border}`, borderRadius: 16,
                  padding: "14px", cursor: "pointer", transition: "border-color 0.15s",
                }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.borderColor = wc; }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.borderColor = T.border; }}
              >
                {/* Title + star */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 7 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text, flex: 1, lineHeight: 1.35 }}>{gem.name}</div>
                  <button
                    onClick={e => { e.stopPropagation(); onToggleStar(gem); }}
                    title={isStarred ? "Remove from Shortlist" : "Save to Shortlist"}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 16, lineHeight: 1, padding: "0 0 0 2px", flexShrink: 0,
                      color: isStarred ? "#F59E0B" : T.textDim,
                    }}
                  >{isStarred ? "★" : "☆"}</button>
                </div>

                {/* Pill row: industry (colored) + age + cost */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: wc,
                    background: `${wc}18`, border: `1px solid ${wc}40`,
                    borderRadius: 20, padding: "2px 8px",
                  }}>{gem.industry}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: T.textMid,
                    background: T.bgDeep, border: `1px solid ${T.border}`,
                    borderRadius: 20, padding: "2px 8px",
                  }}>{gem.age_range}</span>
                  {gem.cost_note && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: T.textMid,
                      background: T.bgDeep, border: `1px solid ${T.border}`,
                      borderRadius: 20, padding: "2px 8px",
                    }}>{gem.cost_note}</span>
                  )}
                </div>

                {/* wow_line — card description */}
                <div style={{ fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>{gem.wow_line}</div>

                {/* status — small muted footer, neutral */}
                {gem.status && (
                  <div style={{ fontSize: 10, color: T.textDim, marginTop: 8, lineHeight: 1.4 }}>{statusLabel(gem.status)}</div>
                )}

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 11, color: T.textMid, lineHeight: 1.6, marginBottom: gem.cost_note ? 10 : 12 }}>
                      {gem.description}
                    </div>
                    {gem.cost_note && (
                      <div style={{ fontSize: 11, color: T.textMid, marginBottom: 12 }}>
                        <span style={{ fontWeight: 700, color: T.text }}>Cost: </span>{gem.cost_note}
                      </div>
                    )}
                    {gem.url && (
                      <a
                        href={gem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          display: "inline-block",
                          padding: "7px 16px",
                          background: T.bgDeep,
                          border: `1px solid ${T.border}`,
                          borderRadius: 10,
                          fontSize: 12, fontWeight: 600,
                          color: T.textMid,
                          textDecoration: "none",
                          transition: "border-color 0.15s, color 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}
                      >Official program page ↗</a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
