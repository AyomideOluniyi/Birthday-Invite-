export default function GuestTable({ guests }) {
  if (!guests.length) {
    return (
      <div className="text-center py-16 text-cream/30" style={{ fontFamily: 'Inter, sans-serif' }}>
        No RSVPs yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
            {['#', 'Guest Name', 'Phone', 'Family Members', 'Time Registered'].map((h) => (
              <th
                key={h}
                className="text-left py-3 px-4 text-xs tracking-widest uppercase"
                style={{ color: 'rgba(212,175,55,0.7)', fontWeight: 500 }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {guests.map((g, i) => (
            <tr
              key={i}
              className="transition-colors duration-150"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <td className="py-3.5 px-4 text-white/30 text-sm">{i + 1}</td>
              <td className="py-3.5 px-4 text-cream font-medium text-sm">{g.name || '—'}</td>
              <td className="py-3.5 px-4 text-cream/60 text-sm">{g.phone || '—'}</td>
              <td className="py-3.5 px-4 text-sm">
                {g.family_members ? (
                  <div className="flex flex-wrap gap-1">
                    {g.family_members.split(',').map((m, j) => (
                      <span
                        key={j}
                        className="inline-block px-2 py-0.5 rounded-full text-xs"
                        style={{
                          background: 'rgba(212,175,55,0.1)',
                          border: '1px solid rgba(212,175,55,0.2)',
                          color: 'rgba(212,175,55,0.9)',
                        }}
                      >
                        {m.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-white/20">—</span>
                )}
              </td>
              <td className="py-3.5 px-4 text-cream/40 text-sm whitespace-nowrap">
                {g.timestamp
                  ? new Date(g.timestamp).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
