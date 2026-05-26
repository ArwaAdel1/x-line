const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  emoji:  { type: String, default: '👨‍💼' },
  photo:  { type: String, default: '' },
  nameAr: { type: String, required: true },
  nameEn: { type: String, required: true },
  roleAr: { type: String, default: '' },
  roleEn: { type: String, default: '' },
  bioAr:  { type: String, default: '' },
  bioEn:  { type: String, default: '' },
  active: { type: Boolean, default: true },
  order:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
