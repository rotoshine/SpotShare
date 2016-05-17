'use strict';
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (passport, config) => {
  passport.use(new FacebookStrategy({
    clientID: config.auth.facebook.appId,
    clientSecret: config.auth.facebook.appSecret,
    callbackURL: config.auth.facebook.callbackURL
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({
      'facebook.id': profile.id
    }, (err, user) => {
      if(err){
        return done(err, null);
      }else{
        if(!user){
          user = new User({
            name: profile.displayName,
            username: profile.username,
            role: 'user',
            provider: 'facebook',
            facebook: profile._json
          });
          user.save((err) => {
            if(err){
              return done(err, null);
            }else{
              return done(null, user);
            }
          });
        }else{
          user.name = profile.displayName;
          user.facebook = profile._json;

          user.save((err) => {
            return done(err, user);
          });
        }
      }
    })
  }));  
};
