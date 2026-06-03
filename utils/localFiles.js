const fs = require('fs');
const path = require('path');
const { UPLOAD_ROOT } = require('../middleware/upload');

// يحذف صورة مخزّنة محليًا انطلاقًا من رابطها العام (/uploads/...) أو مسارها
async function deleteLocalImage(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== 'string') return false;

  // نستخرج الـ pathname لو كان رابطًا كاملًا
  let rel = urlOrPath;
  try {
    rel = new URL(urlOrPath).pathname;
  } catch (_) {
    /* مسار نسبي بالفعل */
  }

  if (!rel.includes('/uploads/')) return false;

  // نأخذ الجزء بعد /uploads/ ونمنع الخروج خارج مجلد الرفع
  const after = rel.slice(rel.indexOf('/uploads/') + '/uploads/'.length);
  const safe = path.normalize(after).replace(/^(\.\.[\\/])+/, '');
  const full = path.join(UPLOAD_ROOT, safe);

  if (!full.startsWith(UPLOAD_ROOT)) return false;

  try {
    await fs.promises.unlink(full);
    return true;
  } catch (err) {
    if (err.code !== 'ENOENT') console.warn('Local image delete skipped:', err.message);
    return false;
  }
}

module.exports = { deleteLocalImage };
