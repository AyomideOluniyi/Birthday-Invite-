export default async function handler(req, res) {
  const sheetUrl = process.env.VITE_SHEET_URL;
  if (!sheetUrl) return res.status(500).json({ error: 'Sheet URL not configured' });

  try {
    const response = await fetch(`${sheetUrl}?action=read`);
    if (!response.ok) throw new Error(`Sheet error: ${response.status}`);
    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
