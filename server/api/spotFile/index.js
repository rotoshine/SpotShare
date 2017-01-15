const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('./spotFile.controller.js');
const authUtils = require('../../auth/authUtils');
const config = require('../../config');
const {isAuthenticate} = authUtils;

router.get('/files/upload/temp/:tempFileName', controller.findTempFile);
router.post('/files/upload', isAuthenticate, controller.uploadFileTemp);

router.get('/files/:fileId', controller.findFile);
router.get('/spots/:spotId/files/:fileId', controller.findFile);
router.post('/spots/:spotId/files', isAuthenticate, controller.uploadToSpot);
router.post('/spots/:spotId/files/temp-files-save', isAuthenticate, controller.tempFilesMoveToSpot);
module.exports = router;
