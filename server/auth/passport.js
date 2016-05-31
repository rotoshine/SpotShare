'use strict';
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (app, passport, config) => {

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

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    return User.findById(id, (err, user) => {
      return done(err, user);
    });
  });
  app.get('/auth/facebook/login', passport.authenticate('facebook', {
    session: true,
    scope: ['public_profile', 'user_about_me', 'user_location']
  }));
  app.get('/auth/facebook/login/callback', passport.authenticate('facebook', {
    session: true,
    successRedirect: '/'
  }));
  app.get('/api/me', passport.authenticate('facebook', { session: true }), (req, res) => {
    res.json(req.user);
  });
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

};
