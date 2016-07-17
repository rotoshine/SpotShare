'use strict';

module.exports = (mongoose, plugins) => {
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    name: String,
    email: { type: String, lowercase: true },
    role: {
      type: String,
      default: 'user'
    },
    provider: String,
    facebook: {}
  });

  UserSchema.plugin(plugins.autoIncrement.plugin, 'User');
  mongoose.model('User', UserSchema);
};
