'use strict';

module.exports = (mongoose, plugins) => {
  const SCHEMA_NAME = 'SpotFile';
  const Schema = mongoose.Schema;

  const ModelSchema = new Schema({
    spot: {
      type: Number,
      ref: 'Spot',
      required: true
    },
    originalFileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    createdBy: {
      type: Number,
      ref: 'User',
      required: true
    }
  });

  ModelSchema.plugin(plugins.autoIncrement.plugin, SCHEMA_NAME);
  mongoose.model(SCHEMA_NAME, ModelSchema);
};
