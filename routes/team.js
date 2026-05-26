const router  = require('express').Router();
const protect = require('../middleware/auth');
const Team    = require('../models/Team');

router.get('/', async (req, res) => {
  const docs = await Team.find({ active: true }).sort({ order: 1 });
  res.json({ success: true, data: docs });
});

router.get('/all', protect, async (req, res) => {
  const docs = await Team.find().sort({ order: 1 });
  res.json({ success: true, data: docs });
});

router.post('/', protect, async (req, res) => {
  const doc = await Team.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

router.put('/:id', protect, async (req, res) => {
  const doc = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) return res.status(404).json({ success: false, message: 'غير موجود' });
  res.json({ success: true, data: doc });
});

router.delete('/:id', protect, async (req, res) => {
  await Team.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'تم الحذف' });
});

module.exports = router;
