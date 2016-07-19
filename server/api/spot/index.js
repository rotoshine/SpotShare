const express = require('express');
const router = express.Router();
const controller = require('./spot.controller.js');
const authUtils = require('../../auth/authUtils');

router.get('/spots', controller.findAll);
router.get('/spots/:spotId', controller.findById);
router.post('/spots', authUtils.isAuthenticate, controller.save);
router.put('/spots/:spotId', authUtils.isAuthenticate, controller.update);
router.delete('/spots/:spotId', authUtils.isAuthenticate, controller.remove);
router.post('/spots/:spotId/like', authUtils.isAuthenticate, controller.like);
router.post('/spots/:spotId/unlike', authUtils.isAuthenticate, controller.unlike);

module.exports = router;
