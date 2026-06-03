const router  = require('express').Router();
const protect = require('../middleware/auth');
const Blog    = require('../models/Blog');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const { deleteLocalImage } = require('../utils/localFiles');

async function removePhoto(url) {
  if (!url) return;
  if (url.startsWith('/uploads/')) await deleteLocalImage(url);
  else if (url.includes('cloudinary.com')) await deleteFromCloudinary(url);
}

router.get('/', async (req, res) => {
  const docs = await Blog.find({ active: true }).sort({ date: -1 });
  res.json({ success: true, data: docs });
});

router.get('/all', protect, async (req, res) => {
  const docs = await Blog.find().sort({ date: -1 });
  res.json({ success: true, data: docs });
});

router.post('/', protect, async (req, res) => {
  const doc = await Blog.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

router.put('/:id', protect, async (req, res) => {
  try {
    const existing = await Blog.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'غير موجود' });

    const oldPhotos = [...(existing.photos || []), existing.photo].filter(Boolean);
    const newPhotos = req.body.photos || [];
    const doc = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    for (const url of oldPhotos) {
      if (!newPhotos.includes(url)) await removePhoto(url);
    }

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Blog.findById(req.params.id);
    const urls = [...(doc?.photos || []), doc?.photo].filter(Boolean);
    for (const url of urls) await removePhoto(url);
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
