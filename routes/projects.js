const router  = require('express').Router();
const protect = require('../middleware/auth');
const Project = require('../models/Project');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const { deleteLocalImage } = require('../utils/localFiles');

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
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'غير موجود' });

    const oldPhotos = [...(existing.photos || []), existing.photo].filter(Boolean);
    const newPhotos = req.body.photos || [];
    const doc = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    for (const url of oldPhotos) {
      if (!newPhotos.includes(url)) {
        if (url.startsWith('/uploads/')) await deleteLocalImage(url);
        else if (url.includes('cloudinary.com')) await deleteFromCloudinary(url);
      }
    }

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Project.findById(req.params.id);
    const urls = [...(doc?.photos || []), doc?.photo].filter(Boolean);
    for (const url of urls) {
      if (url.startsWith('/uploads/')) await deleteLocalImage(url);
      else if (url.includes('cloudinary.com')) await deleteFromCloudinary(url);
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
