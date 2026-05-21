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
  const res = await fetch(`${SHEET_URL}?action=read`, {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch guest list');
  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}
