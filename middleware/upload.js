const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');
const crypto = require('crypto');

const MAX_SIZE_MB = Number(process.env.UPLOAD_MAX_SIZE_MB || 30);
const MAX_SIZE = Math.max(1, MAX_SIZE_MB) * 1024 * 1024;

const uploadInMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype?.startsWith('image/')) {
      return cb(new Error('يُسمح بملفات الصور فقط'));
    }
    cb(null, true);
  },
}).single('image');

function uploadBufferToCloudinary(buffer, { folder, publicId }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function optimizeImageBuffer(file, options) {
  const isSvg = file.mimetype === 'image/svg+xml' || file.originalname?.toLowerCase().endsWith('.svg');
  if (isSvg) {
    return { buffer: file.buffer, format: 'svg' };
  }

  const {
    maxWidth = 1600,
    maxHeight,
    fit = 'inside', // inside | cover
    quality = 78,
  } = options || {};

  let pipeline = sharp(file.buffer, { failOn: 'none' }).rotate();

  if (maxWidth || maxHeight) {
    pipeline = pipeline.resize({
      width: maxWidth || undefined,
      height: maxHeight || undefined,
      fit,
      withoutEnlargement: true,
    });
  }

  // webp gives best size/quality for most cases
  const buffer = await pipeline.webp({ quality }).toBuffer();
  return { buffer, format: 'webp' };
}

function createOptimizedUploadMiddleware(subFolder, optimizeOptions) {
  const folder = `line-dev/${subFolder}`;
  return function optimizedUpload(req, res, next) {
    uploadInMemory(req, res, async (err) => {
      if (err) return next(err);
      if (!req.file) return next();
      try {
        const { buffer, format } = await optimizeImageBuffer(req.file, optimizeOptions);
        const publicId = crypto.randomUUID?.() || crypto.randomBytes(16).toString('hex');
        const result = await uploadBufferToCloudinary(buffer, { folder, publicId });

        // Keep the same shape used by routes/upload.js
        req.file.path = result.secure_url || result.url;
        req.file.filename = result.public_id;
        req.file.mimetype = format === 'svg' ? 'image/svg+xml' : 'image/webp';
        next();
      } catch (e) {
        next(e);
      }
    });
  };
}

const uploadLogo = createOptimizedUploadMiddleware('logos', {
  maxWidth: 800,
  fit: 'inside',
  quality: 80,
});

const uploadTeamPhoto = createOptimizedUploadMiddleware('team', {
  maxWidth: 800,
  maxHeight: 800,
  fit: 'cover',
  quality: 78,
});

function handleUploadError(err, req, res, next) {
  if (!err) return next();
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: `حجم الصورة أكبر من ${MAX_SIZE_MB} ميجابايت`,
    });
  }
  return res.status(400).json({ success: false, message: err.message || 'فشل رفع الصورة' });
}

module.exports = { uploadLogo, uploadTeamPhoto, handleUploadError };
