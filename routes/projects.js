const router  = require('express').Router();
const protect = require('../middleware/auth');
const Project = require('../models/Project');

router.get('/', async (req, res) => {
  const docs = await Project.find({ active: true }).sort({ order: 1 });
  res.json({ success: true, data: docs });
});

router.get('/all', protect, async (req, res) => {
  const docs = await Project.find().sort({ order: 1 });
  res.json({ success: true, data: docs });
});

router.post('/', protect, async (req, res) => {
  const doc = await Project.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

router.put('/:id', protect, async (req, res) => {
  const doc = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) return res.status(404).json({ success: false, message: 'غير موجود' });
  res.json({ success: true, data: doc });
});

router.delete('/:id', protect, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'تم الحذف' });
});

module.exports = router;
