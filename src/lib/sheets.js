const SHEET_URL = import.meta.env.VITE_SHEET_URL;

export async function submitRSVP({ name, phone, family_members }) {
  const params = new URLSearchParams({
    name,
    phone: phone || '',
    family_members: family_members || '',
  });

  const res = await fetch(`${SHEET_URL}?${params.toString()}`, {
    method: 'POST',
    mode: 'no-cors',
  });

  // no-cors returns opaque response — treat as success if no throw
  return { ok: true };
}

export async function fetchGuests() {
  const res = await fetch('/api/guests');
  if (!res.ok) throw new Error('Failed to fetch guest list');
  const data = await res.json();

  const rows = Array.isArray(data) ? data : data.data || [];
  if (!rows.length) return [];

  // Sheet returns array-of-arrays: first row is headers, rest is data
  if (Array.isArray(rows[0])) {
    const headers = rows[0].map(h => String(h).trim().toLowerCase());
    return rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
  }

  return rows;
}
