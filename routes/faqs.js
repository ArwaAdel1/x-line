const router  = require('express').Router();
const protect = require('../middleware/auth');
const Faq     = require('../models/Faq');

router.get('/', async (req, res) => {
  const docs = await Faq.find({ active: true }).sort({ order: 1 });
  res.json({ success: true, data: docs });
});

router.get('/all', protect, async (req, res) => {
  const docs = await Faq.find().sort({ order: 1 });
  res.json({ success: true, data: docs });
});

router.post('/', protect, async (req, res) => {
  const doc = await Faq.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

router.put('/:id', protect, async (req, res) => {
  const doc = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) return res.status(404).json({ success: false, message: 'غير موجود' });
  res.json({ success: true, data: doc });
});

router.delete('/:id', protect, async (req, res) => {
  await Faq.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'تم الحذف' });
});

module.exports = router;
