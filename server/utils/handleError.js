const logger = require('./logger');

function handleError(err, res, cb){
  if(err){
    logger.error(err);
    return res.status(500).json({
      error: err.message
    });
  }else{
    return cb();
  }
}

exports.handleError = handleError;
