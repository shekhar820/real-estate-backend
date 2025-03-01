const { getDriveService } = require('../config/drive');

class DriveService {
  constructor() {
    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  }

  async createFile(data, type) {
    const drive = await getDriveService();
    const fileMetadata = {
      name: `${type}_${Date.now()}.json`,
      parents: [this.folderId],
      mimeType: 'application/json'
    };

    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(data)
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });

    return { ...data, id: file.data.id };
  }

  async updateFile(fileId, data) {
    const drive = await getDriveService();
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(data)
    };

    await drive.files.update({
      fileId: fileId,
      media: media
    });

    return { ...data, id: fileId };
  }

  async deleteFile(fileId) {
    const drive = await getDriveService();
    await drive.files.delete({ fileId });
  }

  async listFiles(type) {
    const drive = await getDriveService();
    const response = await drive.files.list({
      q: `'${this.folderId}' in parents and name contains '${type}_'`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    const files = await Promise.all(response.data.files.map(async (file) => {
      const content = await this.getFileContent(file.id);
      return { ...content, id: file.id };
    }));

    return files;
  }

  async getFileContent(fileId) {
    const drive = await getDriveService();
    const response = await drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
    return response.data;
  }
}

module.exports = new DriveService();
