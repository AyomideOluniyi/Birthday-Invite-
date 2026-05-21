import { useState } from 'react';

export default function WaxSealButton({ loading = false, children, disabled = false }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: 'block',
        width: '100%',
        padding: '15px 32px',
        borderRadius: '999px',
        border: '1px solid rgba(212,175,55,0.5)',
        background: pressed
          ? 'linear-gradient(135deg, #B8962E, #D4AF37)'
          : 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
        boxShadow: pressed
          ? '0 2px 8px rgba(212,175,55,0.2)'
          : '0 6px 28px rgba(212,175,55,0.38), 0 0 0 0 rgba(212,175,55,0)',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sheen */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)',
          borderRadius: '999px 999px 0 0',
          pointerEvents: 'none',
        }}
      />

      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            style={{ animation: 'spin 0.8s linear infinite' }}
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="6" stroke="#0a0a1a" strokeWidth="2" fill="none" strokeDasharray="28" strokeDashoffset="8" />
          </svg>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0a0a1a' }}>
            Sending…
          </span>
        </span>
      ) : (
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0a0a1a', position: 'relative' }}>
          {children}
        </span>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
