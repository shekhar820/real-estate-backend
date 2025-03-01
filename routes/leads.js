const router = require('express').Router();
const { createFile, updateFile, deleteFile, listFiles, getFileContent } = require('../config/fileStorage');

// Get all leads
router.route('/').get(async (req, res) => {
  try {
    const leads = await listFiles('lead');
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new lead
router.route('/').post(async (req, res) => {
  try {
    const lead = await createFile(req.body, 'lead');
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific lead
router.route('/:id').get(async (req, res) => {
  try {
    const lead = await getFileContent(req.params.id);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update lead
router.route('/:id').put(async (req, res) => {
  try {
    const lead = await updateFile(req.params.id, req.body);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete lead
router.route('/:id').delete(async (req, res) => {
  try {
    await deleteFile(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
