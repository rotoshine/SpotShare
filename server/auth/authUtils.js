module.exports = {
  isAuthenticate(req, res, next) {
    if(req.user){
      return next();
    }else{
      return res.status(401).json({
        message: '로그인 하세요.'
      });
    }
  }
};
