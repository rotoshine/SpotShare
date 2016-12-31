const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('./file.controller.js');
const authUtils = require('../../auth/authUtils');
const config = require('../../config');
const {isAuthenticate} = authUtils;
const upload = multer({
  dest: config.fileUploadPath,
  limits: {
    fileSize : 1024 * 1024 * 3
  }
});

router.post('/files/temp', isAuthenticate, uploadUtils.upload, controller.uploadFileTemp);
router.post('/spots/:spotId/files', isAuthenticate, uploadUtils.upload, controller.upload);

module.exports = router;
