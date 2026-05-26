const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'غير مصرح' });
  try {
    req.admin = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'الجلسة منتهية' });
  }
}

module.exports = protect;
