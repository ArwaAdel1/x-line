const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  nameAr: { type: String, required: true },
  nameEn: { type: String, required: true },
  roleAr: { type: String, default: '' },
  roleEn: { type: String, default: '' },
  textAr: { type: String, default: '' },
  textEn: { type: String, default: '' },
  stars:  { type: Number, default: 5, min: 1, max: 5 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
