const { google } = require('googleapis');
const path = require('path');

// Initialize Google Drive API client
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '..', 'service-account.json'),
  scopes: ['https://www.googleapis.com/auth/drive.file']
});

const drive = google.drive({ version: 'v3', auth });

// Folder IDs for different types (you'll need to create these folders and share them with the service account)
const FOLDER_IDS = {
  companies: process.env.GOOGLE_DRIVE_COMPANIES_FOLDER_ID,
  channelPartners: process.env.GOOGLE_DRIVE_CHANNEL_PARTNERS_FOLDER_ID,
  leads: process.env.GOOGLE_DRIVE_LEADS_FOLDER_ID
};

module.exports = {
  drive,
  FOLDER_IDS
};
