const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function createUploader(folder, transformation = []) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `line-dev/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
      resource_type: 'image',
      ...(transformation.length ? { transformation } : {}),
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('يُسمح بملفات الصور فقط'));
      }
      cb(null, true);
    },
  });
}

const uploadLogo = createUploader('logos', [{ width: 500, crop: 'limit' }]);
const uploadTeamPhoto = createUploader('team', [
  { width: 600, height: 600, crop: 'fill', gravity: 'face' },
]);

function handleUploadError(err, req, res, next) {
  if (!err) return next();
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'حجم الصورة أكبر من 5 ميجابايت' });
  }
  return res.status(400).json({ success: false, message: err.message || 'فشل رفع الصورة' });
}

module.exports = { uploadLogo, uploadTeamPhoto, handleUploadError };
