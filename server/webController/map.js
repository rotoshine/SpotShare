module.exports = (app) => {
  app.get('/map', (req, res, next) => {
    console.log('hi!');
    next();
  });
};
