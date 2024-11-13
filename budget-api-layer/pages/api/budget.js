export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify your React app's origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Existing code for POST and GET requests
  if (req.method === 'POST') {
    const { type, category, name, dollarAmount, frequency } = req.body;

    try {
      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheetId = process.env.SPREADSHEET_ID;

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:E',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[type, category, name, dollarAmount, frequency]],
        },
      });

      res.status(200).json({ message: 'Entry added to Google Sheets' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding entry', error });
    }
  } else if (req.method === 'GET') {
    res.status(200).json({ message: 'GET request successful' });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
