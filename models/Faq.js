const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  questionAr: { type: String, required: true },
  questionEn: { type: String, required: true },
  answerAr:   { type: String, default: '' },
  answerEn:   { type: String, default: '' },
  active:     { type: Boolean, default: true },
  order:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Faq', FaqSchema);
