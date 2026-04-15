import { useState } from 'react';
import { useAuth } from './AuthContext';

const T = {
  bg: "#1E2030", bgCard: "#272B40", bgDeep: "#1A1D2E",
  border: "#3D3F55",
  text: "#E0E8FF", textMid: "#8B8FA8", textDim: "#4A4D66",
  accent1: "#06B6D4", accent2: "#3B82F6", accentPurple: "#7F77DD", white: "#FFFFFF",
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: T.bgDeep,
  border: `1px solid ${T.border}`,
  borderRadius: 10,
  color: T.text,
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
};

function PrimaryBtn({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        width: '100%',
        padding: '13px',
        background: `linear-gradient(135deg, ${T.accent1}, ${T.accent2})`,
        border: 'none',
        borderRadius: 10,
        color: T.white,
        fontSize: 15,
        fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        letterSpacing: 0.3,
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        width: '100%',
        padding: '13px',
        background: 'transparent',
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        color: T.textMid,
        fontSize: 14,
        cursor: 'pointer',
        marginTop: 10,
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

export default function LoginScreen() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'sent'
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmail(email);
      setStep('sent');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: T.bgCard,
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        padding: '40px 36px',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: -1,
            background: `linear-gradient(135deg, ${T.accent1}, ${T.accentPurple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}>
            sparq
          </div>
          <div style={{ color: T.textMid, fontSize: 14 }}>
            Sign in to explore your career path
          </div>
        </div>

        {/* ── Email input step ── */}
        {step === 'input' && (
          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', marginBottom: 8, color: T.textMid, fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Email address
            </label>
            <input
              type="email"
              required
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ ...inputStyle, marginBottom: 20 }}
            />
            {error && <div style={{ color: '#F87171', fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <PrimaryBtn type="submit" loading={submitting}>
              {submitting ? 'Sending…' : 'Send Magic Link'}
            </PrimaryBtn>
          </form>
        )}

        {/* ── Sent confirmation step ── */}
        {step === 'sent' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
              <div style={{ color: T.text, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                Check your inbox
              </div>
              <div style={{ color: T.textMid, fontSize: 14, lineHeight: 1.6 }}>
                We sent a magic link to{' '}
                <span style={{ color: T.accent1, fontWeight: 600 }}>{email}</span>.
                Click it to sign in.
              </div>
            </div>
            <GhostBtn type="button" onClick={() => { setStep('input'); setError(''); }}>
              Use a different email
            </GhostBtn>
          </div>
        )}
      </div>
    </div>
  );
}
