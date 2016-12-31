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

router.get('/spots/:spotId/files/:fileId', controller.findFile);
router.post('/files/temp', isAuthenticate, upload.single('file'), controller.uploadFileTemp);
router.post('/spots/:spotId/files', isAuthenticate, upload.single('file'), controller.upload);

module.exports = router;
