import mongoose from 'mongoose';
const Spot = mongoose.model('Spot');

module.exports = (app) => {
  app.get('/spots', (req, res, next) => {
    //let query = _.assign({}, { isDisplay: true }, req.query);
    let query = { isDisplay: true };
    let sort = {
      _id: -1
    };

    return Spot
      .find(query)
      .populate('files', '_id')
      .populate('createdBy', 'name provider')
      .sort(sort)
      .skip(0)
      .limit(10)
      .exec()
      .then((spots) => {
        req.preloadedState = {
          spots: {
            nowLoading: false,
            spots: spots,
            spotForm: {
              _id: null,
              spotName: '',
              description: '',
              address: '',
              geo: [],
              files: []
            }
          }
        };
        next();
      })
      .catch(() => {
        next();
      });
  });
};
