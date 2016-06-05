'use strict';

module.exports = (mongoose) => {
  const Schema = mongoose.Schema;

  const CommentSchema = new Schema({
    spot: {
      type: Schema.Types.ObjectId,
      ref: 'Spot',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });
  mongoose.model('Comment', CommentSchema);
};
