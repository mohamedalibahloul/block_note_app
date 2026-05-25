const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true, trim: true },
  content: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.Note || mongoose.model('Note', noteSchema);
