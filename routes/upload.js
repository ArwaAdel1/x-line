const router = require('express').Router();
const protect = require('../middleware/auth');
const { uploadLogo, uploadTeamPhoto, handleUploadError } = require('../middleware/upload');
const { deleteFromCloudinary } = require('../utils/cloudinary');

function sendUploadResult(req, res) {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'لم يتم اختيار صورة' });
  }
  res.json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.filename,
    },
    message: 'تم رفع الصورة بنجاح',
  });
}

router.post('/logo', protect, (req, res, next) => {
  uploadLogo(req, res, (err) => {
    if (err) return handleUploadError(err, req, res, next);
    sendUploadResult(req, res);
  });
});

router.post('/team', protect, (req, res, next) => {
  uploadTeamPhoto(req, res, (err) => {
    if (err) return handleUploadError(err, req, res, next);
    sendUploadResult(req, res);
  });
});

router.delete('/image', protect, async (req, res) => {
  try {
    const { url, publicId } = req.body;
    await deleteFromCloudinary(publicId || url);
    res.json({ success: true, message: 'تم حذف الصورة' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
