'use strict';
const mongoose = require('mongoose');
const {Schema} = mongoose;

const SpotSchema = new Schema({
  spotName: String,
  description: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  geo: { type: [Number], index: '2d' }
});

mongoose.model('Spot', SpotSchema);
