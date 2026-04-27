// api/get-letter-content.js
// Fetches the full HTML body of a ConvertKit broadcast.
// Called by letter.html as: /api/get-letter-content?id=<broadcast_id>
//
// ConvertKit endpoint used:
//   GET https://api.convertkit.com/v3/broadcasts/:id/content?api_secret=...
// Returns: { content: "...full HTML email body..." }

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
    // NOTE: This is the correct endpoint for full HTML content.
    // /v3/broadcasts/:id alone only returns metadata (no content field).
    const response = await fetch(
      `https://api.convertkit.com/v3/broadcasts/${id}/content?api_secret=${apiSecret}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    // Return the full response — it contains { content: "...html..." }
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}