module.exports = (app) => {
  app.get('/map', (req, res, next) => {
    next();
  });
};
