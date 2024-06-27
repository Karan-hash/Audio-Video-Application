// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  fileType: String,
  duration: Number,
});

module.exports = mongoose.model('File', fileSchema);
