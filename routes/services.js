const router  = require('express').Router();
const protect = require('../middleware/auth');
const Service = require('../models/Service');

// GET /api/services  — public (active only)
router.get('/', async (req, res) => {
  const docs = await Service.find({ active: true }).sort({ order: 1 });
  res.json({ success: true, data: docs });
});

// GET /api/services/all  — admin
router.get('/all', protect, async (req, res) => {
  const docs = await Service.find().sort({ order: 1 });
  res.json({ success: true, data: docs });
});

// POST /api/services  — admin
router.post('/', protect, async (req, res) => {
  const doc = await Service.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

// PUT /api/services/:id  — admin
router.put('/:id', protect, async (req, res) => {
  const doc = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) return res.status(404).json({ success: false, message: 'غير موجود' });
  res.json({ success: true, data: doc });
});

// DELETE /api/services/:id  — admin
router.delete('/:id', protect, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'تم الحذف' });
});

module.exports = router;
