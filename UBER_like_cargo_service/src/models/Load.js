const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    required: true,
    default: 'NEW',
  },
  state: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  payload: {
    type: Number,
    required: true,
  },
  pickup_address: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  logs: [{
    message: {
      type: String,
    },
    time: {
      type: String,
      default: new Date().toISOString(),
    },
  }],
  created_date: {
    type: String,
    default: new Date().toISOString(),
  },
});

const Load = mongoose.model('load', loadSchema);

module.exports = {
  Load,
};
