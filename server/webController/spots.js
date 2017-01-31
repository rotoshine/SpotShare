import mongoose from 'mongoose';
import _ from 'lodash';

import spotService from '../services/spotService';

import config from '../config';

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

      if(query.hasOwnProperty('spotName')){
        const spotName = query.spotName;
        const title = `${config.title} - ${spotName}의 검색결과`;
        const description = `${query.spotName}의 검색결과입니다.`;
        const imageUrl = config.meta.imageUrl;

        req.meta = {
          description: description,
          keywords: config.meta.keyword,
          twitter: _.assign({}, config.meta.twitter, {
            title: title,
            description: description,
            imageUrl: imageUrl
          }),
          og: {
            url: `${config.url}/spots?spotName=${spotName}`,
            title: title,
            description: description,
            imageUrl: imageUrl
          }
        };
      }

      next();
    }).catch(next);
  });
};
