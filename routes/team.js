const router  = require('express').Router();
const protect = require('../middleware/auth');
const Team    = require('../models/Team');
const { deleteFromCloudinary } = require('../utils/cloudinary');

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
  try {
    const existing = await Team.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'غير موجود' });

    const oldPhoto = existing.photo;
    const doc = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (oldPhoto && req.body.photo !== oldPhoto && oldPhoto.includes('cloudinary.com')) {
      await deleteFromCloudinary(oldPhoto);
    }

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Team.findById(req.params.id);
    if (doc?.photo?.includes('cloudinary.com')) {
      await deleteFromCloudinary(doc.photo);
    }
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
