const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: String,
    default: new Date().toISOString(),
  },
});

const Note = mongoose.model('notes', noteSchema);

module.exports = {
  Note,
};
