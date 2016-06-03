'use strict';

module.exports = (mongoose) => {
  const Schema = mongoose.Schema;

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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    geo: { type: [Number], index: '2d' },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }]
  });
  mongoose.model('Spot', SpotSchema);
};
