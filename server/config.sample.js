module.exports = {
  mongo: 'mongodb://localhost/spots',
  map: {
    apiKey: '',
    markerUrl: '/images/food_tool.svg'
  },
  title: '각종 스팟 공유',
  sessionSecret: '',
  googleAnalyticsKey: '',
  auth: {
    facebook: {
      clientID: '',
      clientSecret: '',
      callbackURL: 'http://localhost:8000/auth/facebook/login/callback'
    },
    kakao: {
      clientID: '',
      callbackURL: 'http://localhost:8000/auth/kakao/login/callback'
    },
    twitter: {
      consumerKey: '',
      consumerSecret: '',
      callbackURL: 'http://localhost:8000/auth/twitter/login/callback'
    }
  },
  fireBase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    storageBucket: '',
    messagingSenderId: ''
  },
  fileUploadPath: './upload'
};
