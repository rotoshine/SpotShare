module.exports = {
  mongo: 'mongodb://localhost/spots',
  daumMapApiKey: '',
  title: '보드 스팟 공유',
  sessionSecret: '',
  auth: {
    facebook: {
      appId: '',
      appSecret: '',
      callbackURL: 'http://localhost:8000/auth/facebook/login/callback'
    },
    kakao: {
      clientID: '',
      callbackURL: 'http://localhost:8000/auth/kakao/login/callback'
    }
  },
  fireBaseApiKey: '',
  fireBaseAuthDomain: '',
  fireBaseDatabaseURL: ''
};
