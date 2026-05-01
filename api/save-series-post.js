/**
 * /api/save-series-post.js
 * Creates or updates a series post.
 * Protected by ADMIN_PASSWORD env var.
 *
 * POST body: { series_id, edition, day, title, content, date_label, status }
 * Headers:   { 'x-admin-password': 'your password' }
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  // Password check
  const password = req.headers['x-admin-password'];
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Supabase service env vars not set.' });
  }

  const { series_id, edition, day, title, content, date_label, status } = req.body;

  if (!series_id || edition === undefined || day === undefined || !title || !content) {
    return res.status(400).json({ error: 'Missing required fields: series_id, edition, day, title, content.' });
  }

  const payload = {
    series_id,
    edition: Number(edition),
    day: Number(day),
    title,
    content,
    date_label: date_label || '',
    status: status || 'live',
    updated_at: new Date().toISOString(),
  };

  try {
    // Upsert — the on_conflict param tells Supabase to UPDATE if the
    // (series_id, edition, day) combo already exists, instead of erroring.
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/series_posts?on_conflict=series_id,edition,day`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) return res.status(500).json({ error: data });

    return res.status(200).json({ success: true, post: data[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}