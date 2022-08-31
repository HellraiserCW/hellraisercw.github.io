const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    required: true,
  },
  payload: {
    type: Number,
  },
  dimensions: {
    width: {
      type: Number,
    },
    length: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
  status: {
    type: String,
    required: true,
    default: 'IS',
  },
  created_date: {
    type: String,
    default: new Date().toISOString(),
  },
});

const Truck = mongoose.model('truck', truckSchema);

module.exports = {
  Truck,
};
