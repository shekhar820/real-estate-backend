const router = require('express').Router();
const { createFile, updateFile, deleteFile, listFiles, getFileContent } = require('../config/fileStorage');

// Get all channel partners
router.route('/').get(async (req, res) => {
  try {
    const channelPartners = await listFiles('channelPartner');
    res.json(channelPartners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new channel partner
router.route('/').post(async (req, res) => {
  try {
    const channelPartner = await createFile(req.body, 'channelPartner');
    res.json(channelPartner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific channel partner
router.route('/:id').get(async (req, res) => {
  try {
    const channelPartner = await getFileContent(req.params.id);
    res.json(channelPartner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update channel partner
router.route('/:id').put(async (req, res) => {
  try {
    const channelPartner = await updateFile(req.params.id, req.body);
    res.json(channelPartner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete channel partner
router.route('/:id').delete(async (req, res) => {
  try {
    await deleteFile(req.params.id);
    res.json({ message: 'Channel Partner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
