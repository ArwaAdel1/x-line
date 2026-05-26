const router  = require('express').Router();
const protect = require('../middleware/auth');
const Message = require('../models/Message');

// POST — public
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: 'يرجى ملء الحقول المطلوبة' });
  const doc = await Message.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: 'تم الإرسال بنجاح! سنتواصل معك قريباً.', data: doc });
});

// GET all — admin
router.get('/', protect, async (req, res) => {
  const docs = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, data: docs });
});

// PUT mark read — admin
router.put('/:id/read', protect, async (req, res) => {
  const doc = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!doc) return res.status(404).json({ success: false, message: 'غير موجود' });
  res.json({ success: true, data: doc });
});

// DELETE — admin
router.delete('/:id', protect, async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'تم الحذف' });
});

module.exports = router;
