# what is this?
지도 기반으로 각종 스팟을 공유할 수 있는 프로그램.

# installation

1. clone this project.
2. run `npm install` from terminal. 
3. create a `server/config.js` using the `server/config.sample.js`
```javascript
module.exports = {
  mongo: 'mongodb://localhost/spots',
  daumMapApiKey: '',
  title: 'Board Spot Share',
  auth: {
    facebook: {
      appId: '',
      appSecret: '',
      callbackURL: 'http://localhost:8000/auth/facebook/login/callback'
    }
  }
};
```

4. run server.
```
npm run start-dev # 개발모드로 실행
npm run start
```
