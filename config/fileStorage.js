const { drive, FOLDER_IDS } = require('./googleDrive');

// Helper function to get folder ID for a type
const getFolderId = (type) => {
  const typeMap = {
    company: 'companies',
    channelPartner: 'channelPartners',
    lead: 'leads'
  };
  const mappedType = typeMap[type] || type;
  const folderId = FOLDER_IDS[mappedType];
  
  if (!folderId) {
    console.error(`No folder ID found for type: ${type} (mapped to ${mappedType})`);
    console.error('Available folder IDs:', FOLDER_IDS);
  }
  return folderId;
};

// Create a file
async function createFile(data, type) {
  try {
    const folderId = getFolderId(type);
    if (!folderId) {
      throw new Error(`No folder ID found for type: ${type}`);
    }

    const fileName = `${type}_${Date.now()}.json`;
    
    const fileData = {
      ...data,
      id: data.id || fileName,
      _id: data._id || fileName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
      mimeType: 'application/json'
    };

    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(fileData, null, 2)
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });

    console.log(`Created file ${fileName} in folder ${folderId}`);
    return { ...fileData, driveId: response.data.id };
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

// List files of a specific type
async function listFiles(type) {
  try {
    const folderId = getFolderId(type);
    if (!folderId) {
      throw new Error(`No folder ID found for type: ${type}`);
    }

    console.log(`Listing files for type ${type} in folder ${folderId}`);
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/json'`,
      fields: 'files(id, name)',
      orderBy: 'createdTime desc'
    });

    const files = [];
    for (const file of response.data.files) {
      try {
        const content = await getFileContent(file.name);
        files.push(content);
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }

    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Get file content
async function getFileContent(fileId) {
  try {
    const response = await drive.files.list({
      q: `name='${fileId}'`,
      fields: 'files(id, name)',
    });

    if (!response.data.files.length) {
      throw new Error('File not found');
    }

    const driveFileId = response.data.files[0].id;
    const fileResponse = await drive.files.get({
      fileId: driveFileId,
      alt: 'media'
    });

    return fileResponse.data;
  } catch (error) {
    console.error('Error getting file content:', error);
    throw error;
  }
}

// Update a file
async function updateFile(fileId, data) {
  try {
    const [type] = fileId.split('_');
    
    const fileData = {
      ...data,
      id: data.id || fileId,
      _id: data._id || fileId,
      updatedAt: new Date().toISOString()
    };

    const searchResponse = await drive.files.list({
      q: `name='${fileId}'`,
      fields: 'files(id)'
    });

    if (!searchResponse.data.files.length) {
      throw new Error('File not found');
    }

    const driveFileId = searchResponse.data.files[0].id;

    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(fileData, null, 2)
    };

    await drive.files.update({
      fileId: driveFileId,
      media: media
    });

    console.log(`Updated file ${fileId}`);
    return fileData;
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  }
}

// Delete a file
async function deleteFile(fileId) {
  try {
    const searchResponse = await drive.files.list({
      q: `name='${fileId}'`,
      fields: 'files(id)'
    });

    if (!searchResponse.data.files.length) {
      throw new Error('File not found');
    }

    const driveFileId = searchResponse.data.files[0].id;
    await drive.files.delete({ fileId: driveFileId });
    console.log(`Deleted file ${fileId}`);
  } catch (error) {
    console.error('Error deleting file:', error);
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
