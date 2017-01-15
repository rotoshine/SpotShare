import _ from 'lodash';
import mongoose from 'mongoose';
import config from '../../config';
import fileUtils from '../../utils/fileUtils';

const Spot = mongoose.model('Spot');
const SpotFile = mongoose.model('SpotFile');



const handleSpotFilesSave = (res, spotId, userId, uploadedMulterFiles) => {
  if(!res){
    throw new Error('response 객체가 누락되었습니다.');
  }
  if(!spotId){
    throw new Error('spotId가 누락되었습니다.');
  }
  if(!userId){
    throw new Error('userId가 누락되었습니다.');
  }
  return fileUtils
    .saveSpotFiles(spotId, userId, uploadedMulterFiles)
    .then((spotFileIds) => {
      let spotFiles = [];
      // id 배열을 오브젝트 형태로 만듦
      spotFileIds.forEach((spotFileId) => {
        spotFiles.push({
          _id: spotFileId
        });
      });

      return res.json(spotFiles);
    })
    .catch((e) => {
      return res.status(500).json({
        message: e.message
      });
    });
};
exports.tempFilesMoveToSpot = (req, res) => {
  const spotId = req.params.spotId;
  return handleSpotFilesSave(res, spotId, req.user._id, req.body.tempUploadedFiles);
};

exports.uploadToSpot = (req, res) => {
  const spotId = req.params.spotId;
  fileUtils.upload(req, res)
    .then((files) => {
      return handleSpotFilesSave(res, spotId, req.user._id, files);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
};

exports.findTempFile = (req, res) => {
  let tempFileDestination = `${config.fileUploadPath}/${req.params.tempFileName}`;
  return fileUtils.streamFileToResponse(res, tempFileDestination)
};

exports.uploadFileTemp = (req, res) => {
  fileUtils.upload(req, res)
    .then((files) => {
      let uploadedFileNames = _.map(files, (file) => {
        return {
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size
        };
      });
      return res.json(uploadedFileNames);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
};

exports.findFile = (req, res) => {
  const {fileId} = req.params;

  return SpotFile
    .findById(fileId)
    .then((file => {
      return fileUtils.streamFileToResponse(res, file.filePath, file.mimeType);
    }))
    .catch((e) => {
      return res.status(404).json({
        message: 'file find error. ' + e.message
      });
    });
};
