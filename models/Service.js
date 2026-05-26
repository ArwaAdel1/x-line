const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  icon:    { type: String, default: '🏗️' },
  ar:      { type: String, required: true },
  en:      { type: String, required: true },
  descAr:  { type: String, default: '' },
  descEn:  { type: String, default: '' },
  features: {
    ar: { type: [String], default: [] },
    en: { type: [String], default: [] },
  },
  active:  { type: Boolean, default: true },
  order:   { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
