const _ = require('lodash');
const mongoose = require('mongoose');
const async = require('async');
const fs = require('fs');
const path = require('path');
const config = require('../../config');
const Spot = mongoose.model('Spot');
const SpotFile = mongoose.model('SpotFile');

const fileUtils = require('../../utils/fileUtils');

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
  const uploadedFiles = req.files;

  return handleSpotFilesSave(res, spotId, req.user._id, uploadedFiles);
};

exports.findTempFile = (req, res) => {
  let tempFileDestination = `${config.fileUploadPath}/${req.params.tempFileName}`;
  return fileUtils.streamFileToResponse(res, tempFileDestination)
};

exports.uploadFileTemp = (req, res) => {
  return res.json(req.files);
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
