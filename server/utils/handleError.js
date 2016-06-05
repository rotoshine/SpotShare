function handleError(err, res, cb){
  if(err){
    return res.status(500).json({
      error: err.message
    });
  }else{
    return cb();
  }
}

exports.handleError = handleError;
