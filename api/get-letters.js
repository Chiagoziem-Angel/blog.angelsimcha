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
      `https://api.convertkit.com/v3/broadcasts?api_secret=${apiSecret}`
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`ConvertKit API error: ${response.status} - ${text}`);
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
