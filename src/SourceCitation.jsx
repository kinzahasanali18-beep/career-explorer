// Shows students where a career's data comes from.
//
// source_url was populated on every row from the start but never rendered
// anywhere — it was fetched into the client and dropped. Meanwhile ~33% of the
// stored URLs are broken (fabricated O*NET codes, invented bls.gov paths), so
// simply displaying the stored value would have shown students dead links
// presented as authority.
//
// This renders a citation ONLY when the stored source carries a SOC code that
// exists in the O*NET taxonomy. Everything else — every bls.gov citation and
// every fabricated code — renders nothing. No citation is better than a broken
// one.
//
// The link points at CareerOneStop (U.S. Department of Labor), whose occupation
// profile is far more useful to a student than O*NET's: wages, outlook, a video,
// and local data. O*NET stays the validation authority behind the scenes and is
// the fallback for the 76 "All Other" categories CareerOneStop has no page for.
//
// Styling matches the existing external-link pattern used by HiddenGems
// ("Official program page ↗") and WhenToApply ("Apply / Learn more ↗").

import { resolveCitation } from "./occupations";

export default function SourceCitation({ sourceUrl, style }) {
  const cite = resolveCitation(sourceUrl);
  if (!cite) return null;

  return (
    <div style={{ marginTop: 8, ...style }}>
      <a
        href={cite.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        title={`${cite.provider} occupation profile: ${cite.title || cite.code}`}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px",
          background: "var(--bgDeep)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          fontSize: 11, fontWeight: 600,
          color: "var(--textMid)",
          textDecoration: "none",
          transition: "border-color 0.15s, color 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#7F77DD"; e.currentTarget.style.color = "#A89FEE"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--textMid)"; }}
      >
        <span style={{ opacity: 0.75, fontWeight: 500 }}>Source</span>
        <span>
          {cite.title
            ? `${cite.provider} · ${cite.title}`
            : `${cite.provider} · ${cite.code}`}
        </span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
