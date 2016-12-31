const mongoose = require('mongoose');

exports.upload = (req, res) => {

};
exports.findFile = (req, res) => {
  const {fileId} = req.params;

  return File
    .findById(fileId)
    .then((file => {
      return fs.exists(file.filePath, (exists) => {
        if(exists){
          res.header('content-type', file.mimeType);
          return fs.createReadStream(file.filePath).pipe(res);
        }else{
          return res.status(404).json({
            message: '파일이 서버에 존재하지 않습니다.'
          });
        }
      });
    }))
    .catch((e) => {
      return res.status(404).json({
        messaage: 'file find error. ' + e.message
      });
    });
};
