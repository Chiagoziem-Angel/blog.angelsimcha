export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiSecret = process.env.CONVERTKIT_API_SECRET;

  if (!apiSecret) {
    return res.status(500).json({ error: 'CONVERTKIT_API_SECRET is not set in environment variables.' });
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/broadcasts?api_secret=${apiSecret}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: 'ConvertKit rejected the request',
        ck_status: response.status,
        ck_detail: data,
      });
    }

    const published = (data.broadcasts || [])
      .filter(b => b.published_at || b.send_at)
      .sort((a, b) => new Date(b.published_at || b.send_at) - new Date(a.published_at || a.send_at));

    return res.status(200).json({ broadcasts: published });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}