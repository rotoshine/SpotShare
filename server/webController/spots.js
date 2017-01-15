import _ from 'lodash';
import mongoose from 'mongoose';
const Spot = mongoose.model('Spot');

module.exports = (app) => {
  app.get('/spots', (req, res, next) => {
    let query = _.assign({}, { isDisplay: true }, req.query);
    let sort = {
      createdAt: -1
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
          spots: spots
        };
        next();
      })
      .catch(() => {
        next();
      });
  });
};
