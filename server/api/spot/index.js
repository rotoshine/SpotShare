const express = require('express');
const router = express.Router();

const controller = require('./spot.controller.js');

router.get('/spots', controller.findAll);
router.get('/spots/:spotId', controller.findById);
router.post('/spots', controller.save);
router.put('/spots/:spotId', controller.update);
router.delete('/spots/:spotId', controller.remove);

module.exports = router;
