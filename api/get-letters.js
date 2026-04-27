export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiSecret = process.env.CONVERTKIT_API_SECRET;

  if (!apiSecret) {
    return res.status(500).json({ error: 'CONVERTKIT_API_SECRET not set.' });
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/broadcasts?api_secret=${apiSecret}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data });
    }

    // No filter — return all broadcasts, sort newest first
    const broadcasts = (data.broadcasts || []).sort((a, b) => {
      const dateA = new Date(a.published_at || a.send_at || a.created_at || 0);
      const dateB = new Date(b.published_at || b.send_at || b.created_at || 0);
      return dateB - dateA;
    });

    return res.status(200).json({ broadcasts });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}