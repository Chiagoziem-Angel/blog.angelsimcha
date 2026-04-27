// api/get-letter-content.js
// Fetches the full HTML body of a ConvertKit broadcast.
// Tries /broadcasts/:id/content first, falls back to /broadcasts/:id directly.

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
    // First try the /content endpoint (works for sent broadcasts)
    const contentRes = await fetch(
      `https://api.convertkit.com/v3/broadcasts/${id}/content?api_secret=${apiSecret}`
    );
    const contentData = await contentRes.json();

    if (contentRes.ok && contentData.content) {
      return res.status(200).json({ content: contentData.content });
    }

    // Fallback: fetch the broadcast itself and use its body/description
    const broadcastRes = await fetch(
      `https://api.convertkit.com/v3/broadcasts/${id}?api_secret=${apiSecret}`
    );
    const broadcastData = await broadcastRes.json();

    if (!broadcastRes.ok) {
      return res.status(broadcastRes.status).json({ error: broadcastData });
    }

    const broadcast = broadcastData.broadcast || broadcastData;
    const content = broadcast.content || broadcast.body || broadcast.description || '';

    return res.status(200).json({
      content,
      subject: broadcast.subject,
      published_at: broadcast.published_at,
      created_at: broadcast.created_at,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}