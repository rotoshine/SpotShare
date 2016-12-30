'use strict';

module.exports = (mongoose) => {
  const SCHEMA_NAME = 'SpotHistory';
  const Schema = mongoose.Schema;

  const SpotHistorySchema = new Schema({
    spot: {
      type: Number,
      ref: 'Spot',
      required: true
    },
    originData: {
      type: String
    },
    updateData: {
      type: String
    },
    historyType: {
      type: String,
      enum: ['NEW', 'MODIFY']
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

  mongoose.model(SCHEMA_NAME, SpotHistorySchema);
};
