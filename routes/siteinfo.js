const router   = require('express').Router();
const protect  = require('../middleware/auth');
const SiteInfo = require('../models/SiteInfo');

// GET — public
router.get('/', async (req, res) => {
  let doc = await SiteInfo.findOne();
  if (!doc) doc = await SiteInfo.create({});
  res.json({ success: true, data: doc });
});

// PUT — admin
router.put('/', protect, async (req, res) => {
  let doc = await SiteInfo.findOne();
  if (!doc) {
    doc = await SiteInfo.create(req.body);
  } else {
    Object.assign(doc, req.body);
    await doc.save();
  }
  res.json({ success: true, data: doc, message: 'تم الحفظ' });
});

module.exports = router;
