/**
 * Vercel Serverless Function: get-letters
 * File path: /api/get-letters.js
 * Endpoint:  /api/get-letters
 *
 * ─── Setup ───────────────────────────────────────────────────
 * In Vercel dashboard → Project → Settings → Environment Variables, add:
 *   CONVERTKIT_API_SECRET = your_api_secret_here
 *
 * API Secret: ConvertKit → Settings → Advanced → API Secret
 * ─────────────────────────────────────────────────────────────
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiSecret = process.env.CONVERTKIT_API_SECRET;

  if (!apiSecret) {
    return res.status(500).json({ error: 'CONVERTKIT_API_SECRET not configured.' });
  }

  try {
    const response = await fetch(
      `https://angelsimcha.kit.com/v3/broadcasts?api_secret=${apiSecret}`
    );

    if (!response.ok) {
      throw new Error(`ConvertKit API returned ${response.status}`);
    }

    const data = await response.json();

    const published = (data.broadcasts || [])
      .filter(b => b.published_at || b.send_at)
      .sort((a, b) => new Date(b.published_at || b.send_at) - new Date(a.published_at || a.send_at));

    return res.status(200).json({ broadcasts: published });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
