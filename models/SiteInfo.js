const mongoose = require('mongoose');

const SiteInfoSchema = new mongoose.Schema({
  nameAr:  { type: String, default: 'البناء الراسخ' },
  nameEn:  { type: String, default: 'Solid Build Co.' },
  address: { type: String, default: '' },
  phone:   { type: String, default: '' },
  email:   { type: String, default: '' },
  logo:    { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SiteInfo', SiteInfoSchema);
