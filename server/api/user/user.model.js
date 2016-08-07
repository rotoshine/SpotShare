'use strict';

module.exports = (mongoose, plugins) => {
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    name: String,
    username: String,
    email: { type: String, lowercase: true },
    role: {
      type: String,
      default: 'user'
    },
    provider: String,
    providerId: Number,
    originData: {}
  });

  UserSchema.plugin(plugins.autoIncrement.plugin, 'User');
  mongoose.model('User', UserSchema);
};
