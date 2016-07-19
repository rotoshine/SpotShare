'use strict';

module.exports = (mongoose, plugins) => {
  const Schema = mongoose.Schema;

  const CommentSchema = new Schema({
    spot: {
      type: Number,
      ref: 'Spot',
      required: true
    },
    content: {
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
  CommentSchema.plugin(plugins.autoIncrement.plugin, 'Comment');
  mongoose.model('Comment', CommentSchema);
};
