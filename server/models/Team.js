// models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamNameLower: { type: String, required: true, unique: true },
  members: [String],
  topic: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
