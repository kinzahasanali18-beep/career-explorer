// First-time welcome screen (shown once, right after signup). Styled to match
// the rest of the app — same design tokens, card, and button styles used on the
// Login and Profile screens — rather than a standalone cosmic look.

const T = {
  bg: 'var(--bg)', bgCard: 'var(--bgCard)', bgDeep: 'var(--bgDeep)',
  border: 'var(--border)',
  text: 'var(--text)', textMid: 'var(--textMid)', textDim: 'var(--textDim)',
  accent1: '#06B6D4', accent2: '#3B82F6', accentPurple: '#7F77DD', white: '#FFFFFF',
};

export default function OnboardingScreen({ onComplete, onStartQuiz }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20000,
      background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 420,
        background: T.bgCard,
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        padding: '40px 36px',
        textAlign: 'center',
        animation: 'fadeSlideUp 0.5s ease forwards',
      }}>
        {/* Brand wordmark */}
        <div style={{
          fontSize: 34, fontWeight: 900, letterSpacing: -1,
          color: T.text, marginBottom: 22,
        }}>
          sparq
        </div>

        {/* Headline */}
        <div style={{ fontSize: 24, fontWeight: 800, color: T.text, lineHeight: 1.25, letterSpacing: '-0.3px', marginBottom: 12 }}>
          Find your thing. (You'll know it when you see it.)
        </div>

        {/* Subhead */}
        <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.6, marginBottom: 14 }}>
          Tap into what you're into, and we'll show you jobs you didn't even know existed.
        </div>

        {/* Reassurance */}
        <div style={{ fontSize: 12, color: T.textDim, marginBottom: 28 }}>
          5 quick questions · takes under a minute
        </div>

        {/* Primary CTA — starts the quiz */}
        <button
          onClick={onStartQuiz}
          style={{
            width: '100%', padding: '13px',
            background: `linear-gradient(135deg, ${T.accent1}, ${T.accent2})`,
            border: 'none', borderRadius: 10,
            color: T.white, fontSize: 15, fontWeight: 700,
            cursor: 'pointer', letterSpacing: 0.3,
          }}
        >
          Get started →
        </button>

        {/* Skip — bypasses the quiz for now */}
        <button
          onClick={onComplete}
          style={{
            width: '100%', padding: '13px', marginTop: 10,
            background: 'transparent',
            border: `1px solid ${T.border}`, borderRadius: 10,
            color: T.textMid, fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.textMid; e.currentTarget.style.color = T.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
