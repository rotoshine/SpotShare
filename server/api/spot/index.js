const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('./spot.controller.js');
const authUtils = require('../../auth/authUtils');

router.get('/spots', controller.findAll);
router.get('/spots/:spotId', controller.findById);
router.post('/spots', authUtils.isAuthenticate, controller.save);
router.put('/spots/:spotId', controller.update);
router.delete('/spots/:spotId', controller.remove);

module.exports = router;
