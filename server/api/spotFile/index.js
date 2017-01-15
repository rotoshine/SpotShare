const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('./spotFile.controller.js');
const authUtils = require('../../auth/authUtils');
const config = require('../../config');
const {isAuthenticate} = authUtils;
const upload = multer({
  dest: config.fileUploadPath,
  limits: {
    fileSize : 1024 * 1024 * 10
  }
});
const MAX_UPLOAD_FILE_COUNT = 5;

router.get('/files/upload/temp/:tempFileName', controller.findTempFile);
router.post('/files/upload', isAuthenticate, upload.array('files', MAX_UPLOAD_FILE_COUNT), controller.uploadFileTemp);

router.get('/files/:fileId', controller.findFile);
router.get('/spots/:spotId/files/:fileId', controller.findFile);
router.post('/spots/:spotId/files', isAuthenticate, upload.array('files', MAX_UPLOAD_FILE_COUNT), controller.uploadToSpot);
router.post('/spots/:spotId/files/temp-files-save', isAuthenticate, controller.tempFilesMoveToSpot);
module.exports = router;
