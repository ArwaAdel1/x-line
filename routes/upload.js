const router = require('express').Router();
const protect = require('../middleware/auth');
const { uploadLogo, uploadTeamPhoto, uploadProjectPhoto, uploadBlogPhoto, handleUploadError } = require('../middleware/upload');
const { deleteLocalImage } = require('../utils/localFiles');
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

router.post('/project', protect, (req, res, next) => {
  uploadProjectPhoto(req, res, (err) => {
    if (err) return handleUploadError(err, req, res, next);
    sendUploadResult(req, res);
  });
});

router.post('/blog', protect, (req, res, next) => {
  uploadBlogPhoto(req, res, (err) => {
    if (err) return handleUploadError(err, req, res, next);
    sendUploadResult(req, res);
  });
});

router.delete('/image', protect, async (req, res) => {
  try {
    const { url, publicId } = req.body;
    const target = url || publicId;
    // الصور الجديدة مخزّنة محليًا
    const deletedLocal = await deleteLocalImage(target);
    // توافق رجعي: لو الرابط قديم من Cloudinary نحذفه من هناك
    if (!deletedLocal) {
      await deleteFromCloudinary(publicId || url);
    }
    res.json({ success: true, message: 'تم حذف الصورة' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
