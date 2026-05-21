import GlassCard from '../ui/GlassCard';
import GuestTable from './GuestTable';
import { useSheetData } from '../../hooks/useSheetData';

function countHeads(guests) {
  return guests.reduce((total, g) => {
    const self = 1;
    const family = g.family_members
      ? g.family_members.split(',').filter((m) => m.trim()).length
      : 0;
    return total + self + family;
  }, 0);
}

function exportCSV(guests) {
  const headers = ['Name', 'Phone', 'Family Members', 'Timestamp'];
  const rows = guests.map((g) => [
    `"${(g.name || '').replace(/"/g, '""')}"`,
    `"${(g.phone || '').replace(/"/g, '""')}"`,
    `"${(g.family_members || '').replace(/"/g, '""')}"`,
    `"${g.timestamp || ''}"`,
  ]);

  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `oluniyi-60th-guests-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const { guests, loading, error, refetch } = useSheetData();
  const totalHeads = countHeads(guests);

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{ background: 'radial-gradient(ellipse at top, #12122e 0%, #0a0a1a 70%)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <p
              className="text-xs tracking-[0.4em] uppercase mb-2"
              style={{ color: 'rgba(212,175,55,0.6)', fontFamily: 'Inter, sans-serif' }}
            >
              Guest Dashboard
            </p>
            <h1
              className="text-4xl sm:text-5xl"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, color: '#D4AF37' }}
            >
              Oluniyi 60th
            </h1>
            <p className="text-cream/40 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Saturday 13 June 2026 · 4:00 PM
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-xl text-sm text-gold/70 hover:text-gold transition-colors"
              style={{ border: '1px solid rgba(212,175,55,0.25)', fontFamily: 'Inter, sans-serif' }}
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => exportCSV(guests)}
              disabled={!guests.length}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: guests.length ? 'linear-gradient(135deg, #D4AF37, #F0D060)' : 'rgba(255,255,255,0.05)',
                color: guests.length ? '#0a0a1a' : 'rgba(255,255,255,0.2)',
                fontFamily: 'Inter, sans-serif',
                cursor: guests.length ? 'pointer' : 'not-allowed',
              }}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Guests', value: guests.length },
            { label: 'Total Headcount', value: totalHeads },
            { label: 'Event Date', value: '13 Jun 2026' },
          ].map(({ label, value }) => (
            <GlassCard key={label} className="p-5">
              <p className="text-xs tracking-widest uppercase text-gold/50 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                {label}
              </p>
              <p
                className="text-3xl font-light"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#D4AF37' }}
              >
                {value}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Table */}
        <GlassCard className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <div
                className="w-5 h-5 rounded-full border-2 border-gold/30 border-t-gold animate-spin"
              />
              <span className="text-cream/40 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Loading guest list...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12 px-6">
              <p className="text-rosegold mb-4 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                {error}
              </p>
              <button
                onClick={refetch}
                className="text-gold/60 hover:text-gold text-sm underline"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Try again
              </button>
            </div>
          ) : (
            <GuestTable guests={guests} />
          )}
        </GlassCard>
      </div>
    </div>
  );
}
