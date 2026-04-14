const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  categoryId: { type: Number, required: true },
  title: { type: String, required: true },
  youtubeId: { type: String, required: true },
  url: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
