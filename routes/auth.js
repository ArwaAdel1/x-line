const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const protect = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: 'أدخل اسم المستخدم وكلمة المرور' });

  const u = process.env.ADMIN_USERNAME;
  const p = process.env.ADMIN_PASSWORD;

  if (username.toLowerCase() !== u.toLowerCase())
    return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });

  let match = password === p;
  if (!match) {
    try { match = await bcrypt.compare(password, p); } catch {}
  }

  if (!match)
    return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });

  const token = jwt.sign({ username: u }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, token, admin: { username: u } });
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

module.exports = router;
