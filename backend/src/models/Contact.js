const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, minlength: 10, maxlength: 20 },
  email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
