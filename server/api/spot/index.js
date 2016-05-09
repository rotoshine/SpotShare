const controller = require('./spot.controller.js');
module.exports = (router) => {
  router.get('/spots', controller.findAll);
  router.get('/spots/:spotId', controller.findById);
  router.post('/spots', controller.save);
  router.put('/spots/:spotId', controller.update);
  router.delete('/spots/:spotId', controller.remove);
}
