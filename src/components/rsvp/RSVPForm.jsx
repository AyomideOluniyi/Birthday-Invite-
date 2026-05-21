import { useState } from 'react';
import WaxSealButton from '../ui/WaxSealButton';
import FamilyMemberInput from './FamilyMemberInput';
import SuccessScreen from './SuccessScreen';
import { submitRSVP, fetchGuests } from '../../lib/sheets';

const MAX_FAMILY = 6;

/* ── input filters ──────────────────────────────────────────── */
// Letters (including accented/unicode), spaces, hyphens, apostrophes, dots only
const filterName = (v) => v.replace(/[^a-zA-ZÀ-ÿ\s''\-\.]/g, '');

// Digits, +, spaces, hyphens, parentheses, dots only. One leading + permitted.
const filterPhone = (v) => {
  const hasPlus = v.startsWith('+');
  const cleaned = v.replace(/[^0-9+\s\-(). ]/g, '').replace(/\+/g, '');
  return hasPlus ? '+' + cleaned : cleaned;
};

/* ── label ──────────────────────────────────────────────────── */
const label = (text) => (
  <label style={{
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.6rem',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'rgba(212,175,55,0.58)',
    marginBottom: '0.5rem',
  }}>
    {text}
  </label>
);

/* ── field error ────────────────────────────────────────────── */
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.72rem',
      color: '#B76E79',
      marginTop: '0.35rem',
      paddingLeft: '2px',
    }}>
      {msg}
    </p>
  );
}

export default function RSVPForm({ embedded = false }) {
  const [name, setName]             = useState('');
  const [phone, setPhone]           = useState('');
  const [bringingFamily, setFamily] = useState(null);
  const [familyMembers, setMembers] = useState(['']);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  /* ── helpers ── */
  const setFieldError = (field, msg) =>
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
  const clearFieldError = (field) =>
    setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  const addMember    = () => familyMembers.length < MAX_FAMILY && setMembers([...familyMembers, '']);
  const updateMember = (i, v) => {
    const a = [...familyMembers];
    a[i] = filterName(v);
    setMembers(a);
  };
  const removeMember = (i) => {
    const a = familyMembers.filter((_, j) => j !== i);
    setMembers(a.length ? a : ['']);
  };

  /* ── blur-time validation ── */
  const validateName = () => {
    const t = name.trim();
    if (!t) { setFieldError('name', 'Full name is required.'); return; }
    if (t.split(/\s+/).filter(Boolean).length < 2)
      { setFieldError('name', 'Please enter both first and last name.'); return; }
    clearFieldError('name');
  };

  const validatePhone = () => {
    const t = phone.trim();
    if (!t) { clearFieldError('phone'); return; }
    const digits = t.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15)
      setFieldError('phone', 'Enter a valid phone number (7–15 digits).');
    else clearFieldError('phone');
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      errors.name = 'Full name is required.';
    } else if (trimmedName.split(/\s+/).filter(Boolean).length < 2) {
      errors.name = 'Please enter both first and last name.';
    }

    const trimmedPhone = phone.trim();
    if (trimmedPhone) {
      const digits = trimmedPhone.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15)
        errors.phone = 'Enter a valid phone number (7–15 digits).';
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitError('');
    setLoading(true);
    const members = bringingFamily
      ? familyMembers.filter((m) => m.trim()).join(', ')
      : '';
    try {
      const existing = await fetchGuests().catch(() => []);
      const normalise = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ');
      const alreadyRegistered = existing.some(
        (g) => normalise(g.name || '') === normalise(trimmedName)
      );
      if (alreadyRegistered) {
        setFieldErrors({ name: 'This name has already been registered.' });
        setLoading(false);
        return;
      }
      await submitRSVP({ name: trimmedName, phone: trimmedPhone, family_members: members });
      setSuccess(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return <SuccessScreen name={name} />;

  const inputGap = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* Name */}
      <div style={inputGap}>
        {label('Full Name *')}
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(filterName(e.target.value)); clearFieldError('name'); }}
          onBlur={validateName}
          placeholder="Your full name"
          className="luxury-input"
          required
          maxLength={100}
          autoComplete="name"
          inputMode="text"
        />
        <FieldError msg={fieldErrors.name} />
      </div>

      {/* Phone */}
      <div style={inputGap}>
        {label('Phone Number')}
        <input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(filterPhone(e.target.value)); clearFieldError('phone'); }}
          onBlur={validatePhone}
          placeholder="+44 7700 000000"
          className="luxury-input"
          maxLength={20}
          autoComplete="tel"
          inputMode="tel"
        />
        <FieldError msg={fieldErrors.phone} />
      </div>

      {/* Family toggle */}
      <div style={inputGap}>
        {label('Bringing family members?')}
        <div style={{ display: 'flex', gap: '0.55rem' }}>
          {[{ l: 'Yes', v: true }, { l: 'No', v: false }].map(({ l, v }) => (
            <button
              key={l} type="button"
              onClick={() => { setFamily(v); if (!v) setMembers(['']); }}
              style={{
                flex: 1, padding: '11px 8px',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8rem', fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: bringingFamily === v
                  ? 'linear-gradient(135deg, #C9A227, #F0D060)'
                  : 'rgba(255,255,255,0.04)',
                color: bringingFamily === v ? '#070712' : 'rgba(255,248,231,0.42)',
                border: bringingFamily === v
                  ? '1px solid rgba(212,175,55,0.7)'
                  : '1px solid rgba(255,255,255,0.09)',
                boxShadow: bringingFamily === v ? '0 4px 16px rgba(212,175,55,0.28)' : 'none',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Family member inputs */}
      {bringingFamily === true && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {label(`Family Members (up to ${MAX_FAMILY})`)}
          {familyMembers.map((val, i) => (
            <FamilyMemberInput
              key={i} index={i} value={val}
              onChange={updateMember}
              onRemove={removeMember}
            />
          ))}
          {familyMembers.length < MAX_FAMILY && (
            <button
              type="button" onClick={addMember}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontFamily: 'Inter, sans-serif', fontSize: '0.78rem',
                color: 'rgba(212,175,55,0.6)', cursor: 'pointer',
                background: 'none', border: 'none', padding: '2px 0',
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                border: '1px solid rgba(212,175,55,0.32)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </span>
              Add family member
            </button>
          )}
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
          color: '#B76E79', textAlign: 'center',
          padding: '8px 14px',
          background: 'rgba(183,110,121,0.08)',
          border: '1px solid rgba(183,110,121,0.22)',
          borderRadius: '8px',
        }}>
          {submitError}
        </p>
      )}

      {/* Submit */}
      <div style={{ paddingTop: '0.3rem' }}>
        <WaxSealButton loading={loading}>Confirm Attendance</WaxSealButton>
      </div>
    </form>
  );
}
