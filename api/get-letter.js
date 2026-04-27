// api/get-letter.js
// Fetches metadata for a single ConvertKit broadcast (subject, dates, etc.)
// Called by letter.html as: /api/get-letter?id=<broadcast_id>
//
// ConvertKit endpoint used:
//   GET https://api.convertkit.com/v3/broadcasts/:id?api_secret=...
// Returns: { broadcast: { id, subject, published_at, created_at, ... } }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'Missing id parameter' });
  }

  const apiSecret = process.env.CONVERTKIT_API_SECRET;
  if (!apiSecret) {
    return res.status(500).json({ error: 'CONVERTKIT_API_SECRET not set.' });
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/broadcasts/${id}?api_secret=${apiSecret}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}