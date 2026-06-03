const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const MAX_SIZE_MB = Number(process.env.UPLOAD_MAX_SIZE_MB || 30);
const MAX_SIZE = Math.max(1, MAX_SIZE_MB) * 1024 * 1024;

// كل الصور تتخزن محليًا داخل مجلد uploads/ في جذر المشروع
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads');

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

  // webp يعطي أفضل نسبة حجم/جودة لمعظم الحالات
  const buffer = await pipeline.webp({ quality }).toBuffer();
  return { buffer, format: 'webp' };
}

async function saveBufferLocally(buffer, { subFolder, ext }) {
  const destDir = path.join(UPLOAD_ROOT, subFolder);
  await fs.promises.mkdir(destDir, { recursive: true });
  const id = crypto.randomUUID?.() || crypto.randomBytes(16).toString('hex');
  const fileName = `${id}.${ext}`;
  const destPath = path.join(destDir, fileName);
  await fs.promises.writeFile(destPath, buffer);
  // مسار عام نسبي يُخدَم عبر express.static('/uploads')
  return `/uploads/${subFolder}/${fileName}`;
}

function createOptimizedUploadMiddleware(subFolder, optimizeOptions) {
  return function optimizedUpload(req, res, next) {
    uploadInMemory(req, res, async (err) => {
      if (err) return next(err);
      if (!req.file) return next();
      try {
        const { buffer, format } = await optimizeImageBuffer(req.file, optimizeOptions);
        const ext = format === 'svg' ? 'svg' : 'webp';
        const publicPath = await saveBufferLocally(buffer, { subFolder, ext });

        // نحافظ على نفس الشكل المستخدم في routes/upload.js
        req.file.path = publicPath;       // الرابط العام للصورة
        req.file.filename = publicPath;   // نفس المسار يُستخدم للحذف لاحقًا
        req.file.mimetype = ext === 'svg' ? 'image/svg+xml' : 'image/webp';
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

const uploadProjectPhoto = createOptimizedUploadMiddleware('projects', {
  maxWidth: 1200,
  maxHeight: 720,
  fit: 'cover',
  quality: 80,
});

const uploadBlogPhoto = createOptimizedUploadMiddleware('blogs', {
  maxWidth: 1200,
  maxHeight: 720,
  fit: 'cover',
  quality: 80,
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

module.exports = { uploadLogo, uploadTeamPhoto, uploadProjectPhoto, uploadBlogPhoto, handleUploadError, UPLOAD_ROOT };
