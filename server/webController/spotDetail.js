import _ from 'lodash';
import logger from '../utils/logger';
import mongoose from 'mongoose';
import config from '../config';
import fileUtils from '../utils/fileUtils';

const Spot = mongoose.model('Spot');
module.exports = (app) => {
  app.get('/spots/:spotId', (req, res, next) => {
    const spotId = req.params.spotId;
    Spot
      .findById(spotId)
      .populate('createdBy', 'name provider')
      .exec()
      .then((spot) => {
        req.preloadedState = {
          spots: {
            loadedSpot: spot
          }
        };

        const title = `${config.title} ${spot.spotName}`;
        let description = spot.description;
        if (description.length > 100) {
          description = description.substring(0, 100) + '..';
        }

        let imageUrl = config.meta.imageUrl;

        if (_.isArray(spot.files) && spot.files.length > 0) {
          imageUrl = fileUtils.getImageUrl(spot.files[0])
        }

        req.meta = {
          description: spot.description.substring(0, 100),
          keywords: config.meta.keyword,
          twitter: _.assign({}, config.meta.twitter, {
            title: title,
            description: description,
            imageUrl: imageUrl
          }),
          og: {
            url: `${config.url}/spots/${spot._id}`,
            title: title,
            description: description,
            imageUrl: imageUrl
          }
        };
        next();
      })
      .catch((err) => {
        logger.error(err);
        res.status(404).redirect('/not-found');
      });
  });
};
