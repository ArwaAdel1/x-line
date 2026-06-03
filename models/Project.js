const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  nameAr:   { type: String, required: true },
  nameEn:   { type: String, required: true },
  photo:    { type: String, default: '' },
  photos:   { type: [String], default: [] },
  statusAr: { type: String, default: 'مخطط' },
  statusEn: { type: String, default: 'Planned', enum: ['Completed', 'In Progress', 'Planned'] },
  year:     { type: Number, default: () => new Date().getFullYear() },
  active:   { type: Boolean, default: true },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
