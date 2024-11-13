export default function handler(req, res) {
  if (req.method === 'GET') {
    // Example response for GET requests
    res.status(200).json({ message: 'GET request successful' });
  } else if (req.method === 'POST') {
    const { type, category, name, dollarAmount, frequency } = req.body;
    res.status(200).json({
      message: 'POST request successful',
      data: { type, category, name, dollarAmount, frequency },
    });
  } else {
    // Respond with 405 if method is not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
