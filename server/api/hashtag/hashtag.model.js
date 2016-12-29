'use strict';

module.exports = (mongoose, plugins) => {
  const Schema = mongoose.Schema;

  const HashtagSchema = new Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    spots: {
      type: Number,
      ref: 'Spot',
      required: true
    },
    spotCount: {
      type: Number,
      default: 0
    }
  });
  HashtagSchema.plugin(plugins.autoIncrement.plugin, 'Hashtag');
  mongoose.model('Hashtag', HashtagSchema);
};
