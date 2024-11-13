import { google } from 'googleapis';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
      console.error('Error details:', error); // Log detailed error to console
      res
        .status(500)
        .json({ message: 'Error adding entry', error: error.message || error });
    }
  } else if (req.method === 'GET') {
    try {
      // Initialize Google Sheets API
      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheetId = process.env.SPREADSHEET_ID;

      // Fetch data from Google Sheets
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:E', // Adjust this range if necessary
      });

      // Get rows from response
      const rows = response.data.values || [];
      res.status(200).json(rows); // Return rows as an array in the response
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      res.status(500).json({ message: 'Error retrieving data', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
