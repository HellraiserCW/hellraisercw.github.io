const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  created_date: {
    type: String,
    default: new Date().toISOString(),
  },
});

const User = mongoose.model('users', userSchema);

module.exports = {
  User,
};
