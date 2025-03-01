const router = require('express').Router();
const { createFile, updateFile, deleteFile, listFiles, getFileContent } = require('../config/fileStorage');

// Get all companies
router.route('/').get(async (req, res) => {
  try {
    const companies = await listFiles('company');
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new company
router.route('/').post(async (req, res) => {
  try {
    const company = await createFile(req.body, 'company');
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific company
router.route('/:id').get(async (req, res) => {
  try {
    const company = await getFileContent(req.params.id);
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update company
router.route('/:id').put(async (req, res) => {
  try {
    const company = await updateFile(req.params.id, req.body);
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete company
router.route('/:id').delete(async (req, res) => {
  try {
    await deleteFile(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
