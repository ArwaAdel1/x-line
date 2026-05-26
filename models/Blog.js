const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  emoji:     { type: String, default: '📰' },
  titleAr:   { type: String, required: true },
  titleEn:   { type: String, required: true },
  excerptAr: { type: String, default: '' },
  excerptEn: { type: String, default: '' },
  tagAr:     { type: String, default: '' },
  tagEn:     { type: String, default: '' },
  date:      { type: String, default: () => new Date().toISOString().split('T')[0] },
  active:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);
