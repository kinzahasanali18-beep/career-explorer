import { useState, useEffect } from 'react';

const T = {
  bg: '#0f1020',
  bgCard: '#1a1d35',
  border: '#3D3F55',
  text: '#E0E8FF',
  textMid: '#8B8FA8',
  accent1: '#06B6D4',
  accent2: '#3B82F6',
  accentPurple: '#7F77DD',
  white: '#FFFFFF',
};

const STEPS = [
  {
    eyebrow: 'Welcome to Sparq',
    headline: ['Most apps show you', 'what everyone picked.', 'We show you what', 'you didn\'t know existed.'],
    highlightLine: 2,
    sub: 'Careers at the edges. Connections nobody talks about. Built for you, not everyone.',
    btn: "Let's go →",
  },
  {
    eyebrow: 'How it works',
    headline: ['Tell us what', 'pulls you in.'],
    highlightLine: 1,
    sub: 'Pick your worlds. We\'ll map the careers that live at the intersections — even the ones that don\'t have a name yet.',
    btn: 'Got it →',
  },
  {
    eyebrow: 'Almost there',
    headline: ['Answer 5 quick', 'questions. We\'ll build', 'your personal career map.'],
    highlightLine: 2,
    sub: 'No wrong answers. Takes under a minute. Your map updates as you explore.',
    btn: 'Build my map ✦',
    ghost: 'Skip for now',
  },
];

function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.7,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'white',
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  function next() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      setAnimKey(k => k + 1);
    } else {
      onComplete();
    }
  }

  function skip() {
    onComplete();
  }

  const current = STEPS[step];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20000,
      background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatBolt {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: '#7F77DD', opacity: 0.12, filter: 'blur(80px)', top: -100, left: -80, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: '#D4537E', opacity: 0.1, filter: 'blur(80px)', bottom: -80, right: -60, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: '#06B6D4', opacity: 0.09, filter: 'blur(60px)', top: '40%', left: '55%', pointerEvents: 'none' }} />

      <StarField />

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 28px', maxWidth: 420, width: '100%',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: '#1a1d35',
            border: `1.5px solid ${T.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            animation: 'floatBolt 3.5s ease-in-out infinite',
          }}>
            <div style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: `1.5px solid ${T.accentPurple}`,
              animation: 'pulseRing 2.5s ease-out infinite',
            }} />
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="16,2 7,15 13,15 10,26 21,12 15,12 18,2" fill="#ff7a50" opacity="0.5"/>
              <polygon points="14,2 5,15 11,15 8,26 19,12 13,12 16,2" fill="#7F77DD"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'sans-serif', fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.3px' }}>
            Sparq
          </span>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              height: 5, borderRadius: 3,
              background: i === step ? T.accentPurple : T.border,
              width: i === step ? 22 : 5,
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>

        {/* Content */}
        <div key={animKey} style={{ animation: 'fadeUp 0.5s ease forwards' }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: T.accentPurple,
            marginBottom: 16,
          }}>
            {current.eyebrow}
          </div>

          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.22, marginBottom: 16, letterSpacing: '-0.4px' }}>
            {current.headline.map((line, i) => (
              <div key={i} style={{ color: i === current.highlightLine ? T.accentPurple : T.text }}>
                {line}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.65, maxWidth: 310, margin: '0 auto 28px' }}>
            {current.sub}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <button
              onClick={next}
              style={{
                background: `linear-gradient(135deg, ${T.accentPurple}, ${T.accent2})`,
                border: 'none', borderRadius: 50,
                padding: '14px 48px',
                color: T.white, fontSize: 15, fontWeight: 700,
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 8px 28px #7F77DD44'; }}
              onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = 'none'; }}
            >
              {current.btn}
            </button>

            {current.ghost && (
              <button
                onClick={skip}
                style={{
                  background: 'none', border: `1px solid ${T.border}`,
                  borderRadius: 50, padding: '11px 30px',
                  color: T.textMid, fontSize: 13,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = T.accentPurple; e.target.style.color = T.text; }}
                onMouseLeave={e => { e.target.style.borderColor = T.border; e.target.style.color = T.textMid; }}
              >
                {current.ghost}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
