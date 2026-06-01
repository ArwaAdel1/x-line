const cloudinary = require('../config/cloudinary');

function getPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  const withoutQuery = url.split('?')[0];
  const match = withoutQuery.match(/\/upload\/(?:[^/]+\/)*(.+)$/);
  if (!match) return null;
  return match[1].replace(/\.\w+$/, '');
}

async function deleteFromCloudinary(urlOrPublicId) {
  const publicId = urlOrPublicId?.includes('cloudinary.com')
    ? getPublicIdFromUrl(urlOrPublicId)
    : urlOrPublicId;
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (err) {
    console.warn('Cloudinary delete skipped:', err.message);
  }
}

function optimizeImageUrl(url, options = {}) {
  if (!url || !url.includes('cloudinary.com')) return url;
  const { width, height, crop = 'limit', quality = 'auto', format = 'auto' } = options;
  const parts = [`f_${format}`, `q_${quality}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`, `c_${crop}`);
  const transform = parts.join(',');
  return url.replace('/upload/', `/upload/${transform}/`);
}

module.exports = { getPublicIdFromUrl, deleteFromCloudinary, optimizeImageUrl };
