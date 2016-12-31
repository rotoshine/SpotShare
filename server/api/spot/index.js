const express = require('express');
const router = express.Router();
const controller = require('./spot.controller.js');
const authUtils = require('../../auth/authUtils');

const {isAuthenticate} = authUtils;

router.get('/spots', controller.findAll);
router.get('/spots/:spotId', controller.findById);
router.get('/spots/:spotId/files/:fileId', controller.findFile);
router.post('/spots', isAuthenticate, controller.save);
router.put('/spots/:spotId', isAuthenticate, controller.update);
router.delete('/spots/:spotId', isAuthenticate, controller.remove);
router.post('/spots/:spotId/remove-request', isAuthenticate, controller.removeRequest);
router.post('/spots/:spotId/like', isAuthenticate, controller.like);
router.post('/spots/:spotId/unlike', isAuthenticate, controller.unlike);

module.exports = router;

