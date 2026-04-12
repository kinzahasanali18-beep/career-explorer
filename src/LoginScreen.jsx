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
  const { signInWithEmail, verifyEmailOtp, signInWithPhone, verifyOtp } = useAuth();
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'sent' | 'otp'
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function switchTab(t) {
    setTab(t);
    setStep('input');
    setError('');
    setEmail('');
    setPhone('');
    setOtp('');
  }

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmail(email);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailOtpSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await verifyEmailOtp(email, otp);
      // onAuthStateChange in AuthContext will update user → App re-renders automatically
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signInWithPhone(phone);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await verifyOtp(phone, otp);
      // onAuthStateChange in AuthContext will update user → App re-renders automatically
    } catch (err) {
      setError(err.message);
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

        {/* Tab toggle */}
        <div style={{
          display: 'flex',
          background: T.bgDeep,
          borderRadius: 10,
          padding: 4,
          marginBottom: 28,
        }}>
          {['email', 'phone'].map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              style={{
                flex: 1,
                padding: '9px 0',
                border: 'none',
                borderRadius: 8,
                background: tab === t ? T.bgCard : 'transparent',
                color: tab === t ? T.text : T.textMid,
                fontWeight: tab === t ? 700 : 400,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {t === 'email' ? 'Email' : 'Phone'}
            </button>
          ))}
        </div>

        {/* ── Email flow ── */}
        {tab === 'email' && step === 'input' && (
          <form onSubmit={handleEmailSubmit}>
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
              {submitting ? 'Sending…' : 'Send Code'}
            </PrimaryBtn>
          </form>
        )}

        {tab === 'email' && step === 'otp' && (
          <form onSubmit={handleEmailOtpSubmit}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
              <div style={{ color: T.textMid, fontSize: 14, lineHeight: 1.6 }}>
                Enter the 6-digit code sent to{' '}
                <span style={{ color: T.accent1, fontWeight: 600 }}>{email}</span>
              </div>
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              autoFocus
              placeholder="000000"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{ ...inputStyle, textAlign: 'center', fontSize: 28, letterSpacing: 12, marginBottom: 20 }}
            />
            {error && <div style={{ color: '#F87171', fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <PrimaryBtn type="submit" loading={submitting}>
              {submitting ? 'Verifying…' : 'Verify Code'}
            </PrimaryBtn>
            <GhostBtn type="button" onClick={() => { setStep('input'); setOtp(''); setError(''); }}>
              Use a different email
            </GhostBtn>
          </form>
        )}

        {/* ── Phone flow ── */}
        {tab === 'phone' && step === 'input' && (
          <form onSubmit={handlePhoneSubmit}>
            <label style={{ display: 'block', marginBottom: 8, color: T.textMid, fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Phone number
            </label>
            <input
              type="tel"
              required
              autoFocus
              placeholder="+1 555 000 0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ ...inputStyle, marginBottom: 6 }}
            />
            <div style={{ color: T.textDim, fontSize: 12, marginBottom: 20 }}>
              Include country code, e.g. +1 for US/Canada
            </div>
            {error && <div style={{ color: '#F87171', fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <PrimaryBtn type="submit" loading={submitting}>
              {submitting ? 'Sending…' : 'Send Code'}
            </PrimaryBtn>
          </form>
        )}

        {tab === 'phone' && step === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📲</div>
              <div style={{ color: T.textMid, fontSize: 14, lineHeight: 1.6 }}>
                Enter the 6-digit code sent to{' '}
                <span style={{ color: T.accent1, fontWeight: 600 }}>{phone}</span>
              </div>
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              autoFocus
              placeholder="000000"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{ ...inputStyle, textAlign: 'center', fontSize: 28, letterSpacing: 12, marginBottom: 20 }}
            />
            {error && <div style={{ color: '#F87171', fontSize: 13, marginBottom: 14 }}>{error}</div>}
            <PrimaryBtn type="submit" loading={submitting}>
              {submitting ? 'Verifying…' : 'Verify Code'}
            </PrimaryBtn>
            <GhostBtn type="button" onClick={() => { setStep('input'); setOtp(''); setError(''); }}>
              Back
            </GhostBtn>
          </form>
        )}
      </div>
    </div>
  );
}
