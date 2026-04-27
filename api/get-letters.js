/**
 * /api/get-letter.js
 * Fetches a single ConvertKit broadcast by ID (includes full HTML content)
 * Usage: /api/get-letter?id=1234567
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing broadcast id' });
  }

  const apiSecret = process.env.CONVERTKIT_API_SECRET;
  if (!apiSecret) {
    return res.status(500).json({ error: 'CONVERTKIT_API_SECRET not configured.' });
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/broadcasts/${id}?api_secret=${apiSecret}`
    );

    if (!response.ok) {
      throw new Error(`ConvertKit returned ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}