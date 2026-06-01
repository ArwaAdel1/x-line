const router   = require('express').Router();
const protect  = require('../middleware/auth');
const SiteInfo = require('../models/SiteInfo');
const { deleteFromCloudinary } = require('../utils/cloudinary');

// GET — public
router.get('/', async (req, res) => {
  let doc = await SiteInfo.findOne();
  if (!doc) doc = await SiteInfo.create({});
  res.json({ success: true, data: doc });
});

// PUT — admin
router.put('/', protect, async (req, res) => {
  try {
    let doc = await SiteInfo.findOne();
    const oldLogo = doc?.logo;

    if (!doc) {
      doc = await SiteInfo.create(req.body);
    } else {
      Object.assign(doc, req.body);
      await doc.save();
    }

    if (oldLogo && req.body.logo !== oldLogo && oldLogo.includes('cloudinary.com')) {
      await deleteFromCloudinary(oldLogo);
    }

    res.json({ success: true, data: doc, message: 'تم الحفظ' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
