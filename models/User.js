const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer', enum: ['customer', 'admin'] }
});

module.exports = mongoose.model('User', userSchema);