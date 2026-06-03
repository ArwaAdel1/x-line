require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Routes ───────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/services',     require('./routes/services'));
app.use('/api/team',         require('./routes/team'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/messages',     require('./routes/messages'));
app.use('/api/blogs',        require('./routes/blogs'));
app.use('/api/faqs',         require('./routes/faqs'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/siteinfo',     require('./routes/siteinfo'));
app.use('/api/upload',       require('./routes/upload'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🚀 Server running with MongoDB + Mongoose' });
});

// ─── Serve Frontend ───────────────────────────────────────────────────
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// الصور المرفوعة محليًا (تُحفظ عبر multer + sharp)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '7d' }));
app.use(express.static(path.join(__dirname, 'client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// ─── Connect & Start ──────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB متصل');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`);
      console.log(`🔐 Admin: ${process.env.ADMIN_USERNAME}`);
    });
  })
  .catch(err => {
    console.error('❌ فشل الاتصال بـ MongoDB:', err.message);
    process.exit(1);
  });
