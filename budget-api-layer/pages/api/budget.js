import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, category, name, dollarAmount, frequency } = req.body;

    try {
      // Load credentials from environment variable
      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheetId = process.env.SPREADSHEET_ID;

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:E', // Update if needed
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
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
