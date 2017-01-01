'use strict';

module.exports = (mongoose, plugins) => {
  const SCHEMA_NAME = 'Spot';
  const Schema = mongoose.Schema;

  const SpotSchema = new Schema({
    spotName: String,
    description: String,
    address: String,
    createdAt: {
      type: Date,
      default: Date.now()
    },
    isDisplay: {
      type: Boolean,
      default: true
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    },
    createdBy: {
      type: Number,
      ref: 'User',
      required: true
    },
    geo: { type: [Number], index: '2d' },
    likes: [{
      type: Number,
      ref: 'User',
      default: []
    }],
    removeRequestUsers: [{
      type: Number,
      ref: 'User',
      default: []
    }],
    files: [{
      type: Number,
      ref: 'SpotFile',
      default: []
    }]
  });

  SpotSchema.plugin(plugins.autoIncrement.plugin, SCHEMA_NAME);
  mongoose.model(SCHEMA_NAME, SpotSchema);
};
