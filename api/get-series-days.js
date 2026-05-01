/**
 * /api/get-series-days.js
 * Returns all live posts (metadata only) for the series page.
 * No full content — just enough to render the day pills.
 *
 * Usage: /api/get-series-days?series=apad&edition=3
 *        /api/get-series-days  (returns all)
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Supabase env vars not set.' });
  }

  const { series, edition } = req.query;

  let url = `${SUPABASE_URL}/rest/v1/series_posts?select=id,series_id,edition,day,title,date_label,status&order=day.asc`;
  if (series) url += `&series_id=eq.${series}`;
  if (edition) url += `&edition=eq.${edition}`;

  try {
    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) return res.status(500).json({ error: data });

    return res.status(200).json({ posts: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}