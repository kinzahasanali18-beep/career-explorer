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

const INDUSTRIES = [
  { id: 'tech', name: 'Tech & Engineering', color: '#7F77DD', tags: ['software', 'AI', 'robotics', 'hardware', 'data', 'networks', 'crypto'] },
  { id: 'design', name: 'Design & Creative', color: '#D4537E', tags: ['graphic design', 'UX/UI', 'branding', 'illustration', 'motion graphics', 'product design'] },
  { id: 'biz', name: 'Business & Finance', color: '#BA7517', tags: ['startups', 'investing', 'accounting', 'consulting', 'real estate', 'banking', 'crypto'] },
  { id: 'health', name: 'Healthcare & Medicine', color: '#1D9E75', tags: ['doctors', 'nursing', 'mental health', 'research', 'nutrition', 'public health'] },
  { id: 'arts', name: 'Arts & Performance', color: '#D4537E', tags: ['music', 'dance', 'theater', 'film', 'visual arts', 'production', 'photography'] },
  { id: 'edu', name: 'Education & Coaching', color: '#639922', tags: ['teaching', 'tutoring', 'curriculum', 'coaching', 'higher ed', 'special ed'] },
  { id: 'media', name: 'Media & Journalism', color: '#378ADD', tags: ['reporting', 'podcasting', 'social media', 'broadcasting', 'writing', 'publishing'] },
  { id: 'law', name: 'Law & Government', color: '#378ADD', tags: ['criminal law', 'policy', 'politics', 'human rights', 'corporate law', 'public service'] },
  { id: 'science', name: 'Science & Research', color: '#1D9E75', tags: ['biology', 'chemistry', 'physics', 'environmental', 'neuroscience', 'space', 'lab work'] },
  { id: 'hospitality', name: 'Hospitality & Events', color: '#534AB7', tags: ['hotels', 'events planning', 'travel', 'food & beverage', 'tourism', 'entertainment'] },
  { id: 'sports', name: 'Sports & Fitness', color: '#D85A30', tags: ['athletics', 'coaching', 'sports medicine', 'sports business', 'fitness', 'sports media'] },
  { id: 'fashion', name: 'Fashion & Beauty', color: '#D4537E', tags: ['styling', 'design', 'makeup', 'modeling', 'retail', 'beauty tech', 'sustainability'] },
  { id: 'entrepreneur', name: 'Entrepreneurship', color: '#BA7517', tags: ['startups', 'product', 'fundraising', 'side hustles', 'e-commerce', 'social enterprise'] },
  { id: 'environment', name: 'Environment & Sustainability', color: '#639922', tags: ['climate', 'conservation', 'renewable energy', 'policy', 'green tech', 'wildlife'] },
  { id: 'nonprofit', name: 'Social Impact & Nonprofit', color: '#1D9E75', tags: ['community organizing', 'advocacy', 'fundraising', 'international dev', 'public health'] },
  { id: 'marketing', name: 'Marketing & Communications', color: '#D85A30', tags: ['brand strategy', 'social media', 'PR', 'content', 'advertising', 'growth', 'influencer'] },
  { id: 'cyber', name: 'Cybersecurity', color: '#7F77DD', tags: ['ethical hacking', 'threat analysis', 'network security', 'forensics', 'compliance', 'encryption'] },
  { id: 'architecture', name: 'Architecture & Urban Planning', color: '#534AB7', tags: ['building design', 'urban planning', 'interior design', 'landscape', 'real estate dev'] },
  { id: 'gaming', name: 'Gaming & Esports', color: '#7F77DD', tags: ['game design', 'esports', 'streaming', 'game dev', 'community management', 'VR/AR'] },
  { id: 'supplychain', name: 'Supply Chain & Operations', color: '#BA7517', tags: ['logistics', 'manufacturing', 'procurement', 'warehousing', 'e-commerce ops', 'global trade'] },
  { id: 'food', name: 'Food & Culinary', color: '#D85A30', tags: ['cooking', 'restaurant business', 'nutrition', 'food science', 'catering', 'food media'] },
  { id: 'aviation', name: 'Aviation & Transportation', color: '#378ADD', tags: ['piloting', 'aerospace', 'logistics', 'air traffic control', 'urban mobility', 'drone tech'] },
];

const labelStyle = {
  display: 'block', color: T.textMid, fontSize: 11, fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
};

const inputStyle = {
  width: '100%', padding: '11px 14px', background: T.bgDeep,
  border: `1px solid ${T.border}`, borderRadius: 8, color: T.text,
  fontSize: 14, outline: 'none', boxSizing: 'border-box',
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function IndustryTile({ industry, selected, onToggle }) {
  return (
    <div
      onClick={() => onToggle(industry.id)}
      style={{
        padding: '12px 14px', borderRadius: 12,
        border: selected ? `2px solid ${industry.color}` : `1px solid ${T.border}`,
        background: selected ? `${industry.color}18` : T.bgDeep,
        cursor: 'pointer', transition: 'all 0.15s ease',
        boxShadow: selected ? `0 0 12px ${industry.color}30` : 'none',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: selected ? industry.color : T.text, marginBottom: 6, transition: 'color 0.15s' }}>
        {industry.name}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {industry.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 20,
            background: selected ? `${industry.color}22` : '#ffffff0a',
            color: selected ? industry.color : T.textMid,
            border: `1px solid ${selected ? industry.color + '44' : T.border}`,
            transition: 'all 0.15s',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage({ onClose, onRetakeQuiz }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', avatar: '🦁' });
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const userIdentifier = user?.email || user?.phone || '';

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setForm({ name: data.name || '', avatar: data.avatar || '🦁' });
          setSelectedIndustries(data.industries || []);
        }
        setLoading(false);
      });
  }, [user.id]);

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

  function toggleIndustry(id) {
    setSelectedIndustries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const { error: err } = await supabase.from('profiles')
      .upsert({ id: user.id, ...form, industries: selectedIndustries });
    setSaving(false);
    if (err) { setError(err.message); }
    else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.auth.signOut();
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(15, 17, 30, 0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, backdropFilter: 'blur(4px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 520, background: T.bgCard,
        borderRadius: 20, border: `1px solid ${T.border}`,
        maxHeight: '90vh', overflowY: 'auto', padding: '32px 32px 28px',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>Your Profile</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.textMid, fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}>✕</button>
        </div>

        {/* Account identifier */}
        {userIdentifier && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: T.bgDeep, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: '10px 14px', marginBottom: 24,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 10, color: T.textDim, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                Logged in as
              </div>
              <div style={{ fontSize: 13, color: T.textMid }}>{userIdentifier}</div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: T.textMid, padding: '40px 0' }}>Loading…</div>
        ) : (
          <form onSubmit={handleSave}>

            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: T.bgDeep,
                border: `2px solid ${T.accent1}`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 36, margin: '0 auto 16px',
              }}>
                {form.avatar}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {AVATARS.map(a => (
                  <button key={a} type="button" onClick={() => set('avatar', a)} style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: form.avatar === a ? T.bgDeep : 'transparent',
                    border: form.avatar === a ? `2px solid ${T.accent1}` : `1px solid ${T.border}`,
                    fontSize: 20, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.15s',
                  }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Display Name">
              <input
                type="text" placeholder="Your name" value={form.name}
                onChange={e => set('name', e.target.value)} style={inputStyle}
              />
            </Field>

            {/* Industry tiles */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>
                Your Worlds
                <span style={{ color: T.textDim, fontWeight: 400, marginLeft: 8, textTransform: 'none', letterSpacing: 0 }}>
                  — pick everything that pulls you in
                </span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {INDUSTRIES.map(industry => (
                  <IndustryTile
                    key={industry.id} industry={industry}
                    selected={selectedIndustries.includes(industry.id)}
                    onToggle={toggleIndustry}
                  />
                ))}
              </div>
              {selectedIndustries.length > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: T.textMid }}>{selectedIndustries.length} selected</div>
              )}
            </div>

            {error && <div style={{ color: '#F87171', fontSize: 13, marginBottom: 14 }}>{error}</div>}

            <button type="button" onClick={onRetakeQuiz} style={{
              width: '100%', padding: '13px', marginBottom: 10,
              background: 'transparent',
              border: `1px solid ${T.accentPurple}`, borderRadius: 10,
              color: T.accentPurple, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = `${T.accentPurple}18`; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; }}
            >
              Retake quiz
            </button>

            <button type="submit" disabled={saving} style={{
              width: '100%', padding: '13px',
              background: saved ? 'linear-gradient(135deg, #10B981, #059669)' : `linear-gradient(135deg, ${T.accent1}, ${T.accent2})`,
              border: 'none', borderRadius: 10, color: T.white, fontSize: 15,
              fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1, transition: 'background 0.3s', marginTop: 4,
            }}>
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Danger zone */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                width: '100%', padding: '11px', background: 'transparent',
                border: '1px solid #F8717144', borderRadius: 10,
                color: '#F87171', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = '#F8717111'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; }}
            >
              Delete my account
            </button>
          ) : (
            <div style={{ background: '#F8717110', border: '1px solid #F8717144', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F87171', marginBottom: 6 }}>Are you sure?</div>
              <div style={{ fontSize: 12, color: T.textMid, marginBottom: 16, lineHeight: 1.5 }}>
                This will permanently delete your account and all your data. This cannot be undone.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  style={{
                    flex: 1, padding: '10px', background: '#F87171',
                    border: 'none', borderRadius: 8, color: '#fff',
                    fontSize: 13, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.7 : 1,
                  }}
                >
                  {deleting ? 'Deleting…' : 'Yes, delete everything'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1, padding: '10px', background: 'transparent',
                    border: `1px solid ${T.border}`, borderRadius: 8,
                    color: T.textMid, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
