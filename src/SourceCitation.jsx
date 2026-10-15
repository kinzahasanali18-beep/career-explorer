// Shows students where a career's data comes from.
//
// source_url was populated on every row from the start but never rendered
// anywhere — it was fetched into the client and dropped. Meanwhile ~33% of the
// stored URLs are broken (fabricated O*NET codes, invented bls.gov paths), so
// simply displaying the stored value would have shown students dead links
// presented as authority.
//
// Three cases, driven by the career's source_type column (Phase 4c):
//   null/undefined — original behavior. Renders nothing unless the stored
//     source carries a SOC code that exists in the O*NET taxonomy, so broken
//     and fabricated citations stay hidden rather than being shown as fact.
//   'related'      — the citation is a plausible but not exact match. Shown
//     as "Related to: <occupation>", never presented as this career's exact
//     government source.
//   'emerging'     — no citation at all. A short plain-language note instead
//     of a link: this is a real, newer, or more specialized role that simply
//     has no official occupation listing yet.
//
// The link points at CareerOneStop (U.S. Department of Labor), whose occupation
// profile is far more useful to a student than O*NET's: wages, outlook, a video,
// and local data. O*NET stays the validation authority behind the scenes and is
// the fallback for the 76 "All Other" categories CareerOneStop has no page for.
//
// Styling matches the existing external-link pattern used by HiddenGems
// ("Official program page ↗") and WhenToApply ("Apply / Learn more ↗").
//
// Accessibility: every label here is real text (not conveyed by color alone),
// and every color pairing below is verified at >= 4.5:1 against its background
// in BOTH themes (WCAG 2.2 AA, 1.4.3) -- see the contrast note on focusOn/Off.
// The citation link is a native <a href>, so it is keyboard-reachable and
// exposed to screen readers via its own visible text, with no aria overrides
// needed. The "Emerging role" note is static text with no interactive control,
// so it carries no tabindex/role -- adding one would be a false affordance.

import { resolveCitation } from "./occupations";

const PILL_BASE = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "6px 12px",
  background: "var(--bgDeep)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 11, fontWeight: 600,
  color: "var(--textMid)",
  textDecoration: "none",
  transition: "border-color 0.15s, color 0.15s",
};

// Shared hover/focus affordance for every citation-link variant below. Uses
// var(--text) rather than a hardcoded accent hex: the previous hover color
// (#A89FEE) measures ~7:1 against the dark-theme pill background but only
// ~2:1 in light mode, well under the 4.5:1 AA minimum. var(--text) resolves
// per-theme and is >=11:1 against var(--bgDeep) in both themes.
function focusOn(e) {
  e.currentTarget.style.borderColor = "var(--text)";
  e.currentTarget.style.color = "var(--text)";
}
function focusOff(e) {
  e.currentTarget.style.borderColor = "var(--border)";
  e.currentTarget.style.color = "var(--textMid)";
}

function CitationLink({ href, title, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      title={title}
      style={PILL_BASE}
      onMouseEnter={focusOn}
      onMouseLeave={focusOff}
      onFocus={focusOn}
      onBlur={focusOff}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function EmergingNote() {
  return (
    <div
      style={{
        display: "inline-flex", flexDirection: "column", gap: 4,
        padding: "8px 12px",
        background: "var(--bgDeep)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        maxWidth: 360,
      }}
    >
      <span style={{
        fontSize: 11, fontWeight: 700, color: "var(--text)",
        textTransform: "uppercase", letterSpacing: "0.04em",
      }}>
        Emerging role
      </span>
      <span style={{ fontSize: 12, color: "var(--textMid)", lineHeight: 1.5 }}>
        This is a newer or specialized role without an official government occupation listing yet.
      </span>
    </div>
  );
}

export default function SourceCitation({ sourceUrl, sourceType, style }) {
  if (sourceType === "emerging") {
    return (
      <div style={{ marginTop: 8, ...style }}>
        <EmergingNote />
      </div>
    );
  }

  const cite = resolveCitation(sourceUrl);
  if (!cite) return null;

  const label = cite.title || cite.code;

  if (sourceType === "related") {
    return (
      <div style={{ marginTop: 8, ...style }}>
        <CitationLink href={cite.href} title={`${cite.provider} occupation profile: ${label}`}>
          <span style={{ opacity: 0.75, fontWeight: 500 }}>Related to:</span>
          <span>{label}</span>
        </CitationLink>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 8, ...style }}>
      <CitationLink href={cite.href} title={`${cite.provider} occupation profile: ${label}`}>
        <span style={{ opacity: 0.75, fontWeight: 500 }}>Source</span>
        <span>
          {cite.title
            ? `${cite.provider} · ${cite.title}`
            : `${cite.provider} · ${cite.code}`}
        </span>
      </CitationLink>
    </div>
  );
}
