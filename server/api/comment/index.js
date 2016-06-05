const express = require('express');
const router = express.Router();
const controller = require('./comment.controller.js');
const authUtils = require('../../auth/authUtils');

router.get('/spots/:spotId/comments', controller.findBySpotId);
router.post('/spots/:spotId/comments', authUtils.isAuthenticate, controller.create);
router.delete('/spots/:spotId/comments/:commentId', authUtils.isAuthenticate, controller.remove);

module.exports = router;
