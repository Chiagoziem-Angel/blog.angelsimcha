/**
 * /api/get-series-post.js
 * Returns a single post with full content.
 *
 * Usage: /api/get-series-post?series=apad&edition=3&day=1
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Supabase env vars not set.' });
  }

  const { series, edition, day } = req.query;

  if (!series || !edition || day === undefined) {
    return res.status(400).json({ error: 'Missing series, edition, or day param.' });
  }

  const url = `${SUPABASE_URL}/rest/v1/series_posts?series_id=eq.${series}&edition=eq.${edition}&day=eq.${day}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) return res.status(500).json({ error: data });
    if (!data || data.length === 0) return res.status(404).json({ error: 'Post not found.' });

    return res.status(200).json({ post: data[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}