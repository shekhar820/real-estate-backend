const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Load service account credentials
const credentialsPath = path.join(__dirname, 'credentials', 'service-account.json');
let credentials;

async function loadCredentials() {
  try {
    const content = await fs.readFile(credentialsPath);
    credentials = JSON.parse(content);
  } catch (error) {
    console.error('Error loading credentials:', error);
    throw error;
  }
}

// Initialize the Drive API client with service account
async function initializeDrive() {
  await loadCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });
  return google.drive({ version: 'v3', auth });
}

// Parent folder ID where all data will be stored
const PARENT_FOLDER_ID = '1g5OD_DwfuO_YCcyeAndwpn5udfdcp';

let drive;

// Initialize drive client
(async () => {
  try {
    drive = await initializeDrive();
  } catch (error) {
    console.error('Error initializing drive client:', error);
  }
})();

// Create a file in Drive
// Remove the PARENT_FOLDER_ID constant and add this instead
const folderIds = {
  companies: process.env.GOOGLE_DRIVE_COMPANIES_FOLDER_ID,
  channelPartners: process.env.GOOGLE_DRIVE_CHANNEL_PARTNERS_FOLDER_ID,
  leads: process.env.GOOGLE_DRIVE_LEADS_FOLDER_ID
};

async function createFile(data, type) {
  if (!drive) {
    drive = await initializeDrive();
  }

  try {
    const folderId = folderIds[type];
    if (!folderId) {
      throw new Error(`No folder ID found for type: ${type}`);
    }

    // Create the file directly in the specific folder
    const fileMetadata = {
      name: `${type}_${Date.now()}.json`,
      parents: [folderId],
      mimeType: 'application/json'
    };

    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(data, null, 2)
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, modifiedTime'
    });

    return { 
      ...data, 
      id: response.data.id,
      name: response.data.name,
      modifiedTime: response.data.modifiedTime
    };
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

// Update a file in Drive
async function updateFile(fileId, data) {
  if (!drive) {
    drive = await initializeDrive();
  }

  try {
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(data, null, 2)
    };

    const response = await drive.files.update({
      fileId: fileId,
      media: media,
      fields: 'id, name, modifiedTime'
    });

    return { 
      ...data, 
      id: response.data.id,
      name: response.data.name,
      modifiedTime: response.data.modifiedTime
    };
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  }
}

// Delete a file from Drive
async function deleteFile(fileId) {
  if (!drive) {
    drive = await initializeDrive();
  }

  try {
    await drive.files.delete({ fileId });
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// List files of a specific type
async function listFiles(type) {
  if (!drive) {
    drive = await initializeDrive();
  }

  try {
    // Get the folder ID for the type
    const folderResponse = await drive.files.list({
      q: `name = '${type}' and '${PARENT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
      fields: 'files(id)'
    });

    if (folderResponse.data.files.length === 0) {
      return [];
    }

    const folderId = folderResponse.data.files[0].id;

    // List files in the folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType = 'application/json'`,
      fields: 'files(id, name, modifiedTime)',
      orderBy: 'modifiedTime desc',
      spaces: 'drive'
    });

    const files = await Promise.all(response.data.files.map(async (file) => {
      const content = await getFileContent(file.id);
      return { 
        ...content, 
        id: file.id,
        name: file.name,
        modifiedTime: file.modifiedTime
      };
    }));

    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Get file content
async function getFileContent(fileId) {
  if (!drive) {
    drive = await initializeDrive();
  }

  try {
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
    return response.data;
  } catch (error) {
    console.error('Error getting file content:', error);
    throw error;
  }
}

module.exports = {
  createFile,
  updateFile,
  deleteFile,
  listFiles,
  getFileContent
};
