'use strict';

module.exports = (mongoose) => {
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
  mongoose.model('User', UserSchema);
};
