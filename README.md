# 스팟 공유

## 설치법

* prject를 clone 받는다.
* npm install 로 모듈을 설치한다.
* server/config.sample.js를 참고하여 server/config.js를 만든다.
```javascript
module.exports = {
  mongo: 'mongodb://localhost/spots',
  daumMapApiKey: '',
  title: '보드 스팟 공유',
  auth: {
    facebook: {
      appId: '',
      appSecret: '',
      callbackURL: 'http://localhost:8000/auth/facebook/login/callback'
    }
  }
};
```

* 아래의 커맨드로 실행 가능.
```
npm run start-dev # 개발모드로 실행
npm run start
```
