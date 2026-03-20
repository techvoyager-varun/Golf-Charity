const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Charity name is required'], trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  website: { type: String },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  totalReceived: { type: Number, default: 0 },
  upcomingEvents: [{
    name: { type: String },
    date: { type: Date },
    description: { type: String },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);
