import { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import WaxSealButton from '../ui/WaxSealButton';

const ADMIN_PASSWORD = 'Passworrd1!';

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at center, #12122e 0%, #0a0a1a 70%)' }}
    >
      <div className="w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-8">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: 'rgba(212,175,55,0.6)', fontFamily: 'Inter, sans-serif' }}
          >
            Admin Access
          </p>
          <h1
            className="text-4xl"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 400,
              color: '#D4AF37',
            }}
          >
            Guest Dashboard
          </h1>
          <p className="text-cream/40 text-sm mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Oluniyi 60th Birthday · 13 June 2026
          </p>
        </div>

        <GlassCard className="p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs tracking-widest uppercase text-gold/60 mb-1.5"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  className="luxury-input pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold/70 transition-colors"
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-rosegold text-sm text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                {error}
              </p>
            )}

            <div className="pt-1">
              <WaxSealButton onClick={() => {}}>
                Enter Dashboard
              </WaxSealButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
