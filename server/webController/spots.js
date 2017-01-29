import mongoose from 'mongoose';
import spotService from '../services/spotService';

const Spot = mongoose.model('Spot');
module.exports = (app) => {
  app.get('/spots', (req, res, next) => {
    let {query} = req;
    if(query.hasOwnProperty('spotName') && query.spotName === ''){
      return res.redirect('/spots');
    }
    spotService.find(query, true).then(result => {
      req.preloadedState = {
        spots: {
          nowLoading: false,
          spots: result.spots,
          totalCount: result.totalCount,
          page: result.page,
          limit: result.limit,
          query: result.query
        }
      };

      next();
    }).catch(next);
  });
};
