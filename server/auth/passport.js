'use strict';
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

function oauthConnect(provider, profile, done) {
  return User.findOne({
    provider: provider,
    providerId: profile.id
  }, (err, user) => {
    if (err) {
      return done(err, null);
    } else {
      if (!user) {
        const newUser = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: provider,
          providerId: profile.id,
          originData: profile._json
        });
        return newUser.save(() => {
          return done(null, newUser);
        });
      } else {
        user.name = profile.displayName;
        user.originData = profile._json;

        return user.save((err) => {
          return done(err, user);
        });
      }
    }
  });
}

const Provider = {
  FACEBOOK: 'facebook',
  KAKAO: 'kakao'
};

module.exports = (app, passport, config) => {
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    return User.findById(id, (err, user) => {
      return done(err, user);
    });
  });

  // facebook setting
  passport.use(new FacebookStrategy({
    clientID: config.auth.facebook.appId,
    clientSecret: config.auth.facebook.appSecret,
    callbackURL: config.auth.facebook.callbackURL
  }, (accessToken, refreshToken, profile, done) => {
    return oauthConnect(Provider.FACEBOOK, profile, done);
  }));

  app.get('/auth/facebook/login', passport.authenticate('facebook', {
    session: true,
    scope: ['public_profile', 'user_about_me', 'user_location']
  }));
  app.get('/auth/facebook/login/callback', passport.authenticate('facebook', {
    session: true,
    successRedirect: '/'
  }));

  // kakao setting
  if(config.auth.kakao){
    passport.use(new KakaoStrategy({
        clientID: config.auth.kakao.clientID,
        callbackURL: config.auth.kakao.callbackURL
      },
      (accessToken, refreshToken, profile, done) => {
        return oauthConnect(Provider.KAKAO, profile, done);
      }
    ));

    app.get('/auth/kakao/login', passport.authenticate('kakao', {
      session: true
    }));

    app.get('/auth/kakao/login/callback', passport.authenticate('kakao', {
      session: true,
      successRedirect: '/'
    }));
  }

  app.get('/api/me', passport.authenticate('facebook', {session: true}), (req, res) => {
    res.json(req.user);
  });
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
