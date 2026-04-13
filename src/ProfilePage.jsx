import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const T = {
  bg: '#1E2030', bgCard: '#272B40', bgDeep: '#1A1D2E',
  border: '#3D3F55',
  text: '#E0E8FF', textMid: '#8B8FA8', textDim: '#4A4D66',
  accent1: '#06B6D4', accent2: '#3B82F6', accentPurple: '#7F77DD', white: '#FFFFFF',
};

const AVATARS = ['🦁', '🐺', '🦊', '🐉', '🦅', '🌊', '⚡', '🔥', '🎯', '🚀'];

const WORLD_OPTIONS = [
  'Tech & Engineering', 'Healthcare & Medicine', 'Business & Finance',
  'Design & Creative', 'Law & Government', 'Sports & Fitness',
  'Education & Coaching', 'Hospitality & Events',
];

const DISCIPLINE_OPTIONS = [
  'Building & Engineering', 'Research & Analysis', 'Strategy & Leadership',
  'Design & Creativity', 'People & Culture', 'Operations & Systems',
];

const WORK_STYLE_OPTIONS = [
  'Remote', 'Hybrid', 'In-Person', 'Solo Deep Work', 'Collaborative', 'Always Moving',
];

const labelStyle = {
  display: 'block',
  color: T.textMid,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  background: T.bgDeep,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  color: T.text,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function ProfilePage({ onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '', sparq_title: '', avatar: '🦁',
    world: '', discipline: '', work_style: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            name: data.name || '',
            sparq_title: data.sparq_title || '',
            avatar: data.avatar || '🦁',
            world: data.world || '',
            discipline: data.discipline || '',
            work_style: data.work_style || '',
          });
        }
        setLoading(false);
      });
  }, [user.id]);

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { error: err } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...form });
    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(15, 17, 30, 0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(4px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 460,
        background: T.bgCard,
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px 32px 28px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>Your Profile</div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: T.textMid, fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: T.textMid, padding: '40px 0' }}>Loading…</div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Avatar display */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: T.bgDeep,
                border: `2px solid ${T.accent1}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, margin: '0 auto 16px',
              }}>
                {form.avatar}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {AVATARS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => set('avatar', a)}
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: form.avatar === a ? T.bgDeep : 'transparent',
                      border: form.avatar === a
                        ? `2px solid ${T.accent1}`
                        : `1px solid ${T.border}`,
                      fontSize: 20, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Display Name">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                style={inputStyle}
              />
            </Field>

            <Field label="Sparq Title">
              <input
                type="text"
                placeholder="e.g. The Architect, The Maker…"
                value={form.sparq_title}
                onChange={e => set('sparq_title', e.target.value)}
                style={inputStyle}
              />
            </Field>

            <Field label="World">
              <select
                value={form.world}
                onChange={e => set('world', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select a world…</option>
                {WORLD_OPTIONS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </Field>

            <Field label="Discipline">
              <select
                value={form.discipline}
                onChange={e => set('discipline', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select a discipline…</option>
                {DISCIPLINE_OPTIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </Field>

            <Field label="Work Style">
              <select
                value={form.work_style}
                onChange={e => set('work_style', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select a work style…</option>
                {WORK_STYLE_OPTIONS.map(ws => (
                  <option key={ws} value={ws}>{ws}</option>
                ))}
              </select>
            </Field>

            {error && (
              <div style={{ color: '#F87171', fontSize: 13, marginBottom: 14 }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                padding: '13px',
                background: saved
                  ? 'linear-gradient(135deg, #10B981, #059669)'
                  : `linear-gradient(135deg, ${T.accent1}, ${T.accent2})`,
                border: 'none',
                borderRadius: 10,
                color: T.white,
                fontSize: 15,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                transition: 'background 0.3s',
                marginTop: 4,
              }}
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
