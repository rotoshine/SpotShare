'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Spot = mongoose.model('Spot');
const SpotHistory = mongoose.model('SpotHistory');
const handleError = require('../../utils/handleError').handleError;

const loggingError = (err) => {
  console.error(err);
};
exports.findAll = (req, res) => {
  let queryParams = req.query;
  let x1 = queryParams.x1;
  let x2 = queryParams.x2;
  let y1 = queryParams.y1;
  let y2 = queryParams.y2;

  return Spot.find({
    geo: {
      $geoWithin: {
        $box: [
          [x1, y1], [x2, y2]
        ]
      }
    }
  })
    .populate('createdBy', 'name provider')
    .exec((err, spots) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      } else {
        return res.json({
          spots: spots
        });
      }
    });
};

exports.findById = (req, res) => {
  const spotId = req.params.spotId;

  return Spot.findById(spotId, (err, spot) => {
    handleError(err, res, () => {
      return res.json({
        spot: spot
      });
    });
  });
};

exports.save = (req, res) => {
  let body = req.body;

  let spot = new Spot(body);
  spot.createdBy = req.user._id;

  return spot
    .save()
    .then(() => {
      return res.send();
    })
    .catch(loggingError);
};

exports.update = (req, res) => {
  let body = req.body;
  const spotId = req.params.spotId;
  return Spot
    .findById(spotId)
    .then((spot) => {
      const hasUpdate = spot.spotName !== body.spotName || spot.description !== body.description;
      if (spot !== null && hasUpdate) {
        const originSpotJSON = JSON.stringify(spot);
        spot.spotName = body.spotName;
        spot.description = body.description;
        spot.updatedAt = new Date();
        spot.updatedBy = req.user._id;
        const updateSpotJSON = JSON.stringify(spot);
        const saveHistory = new SpotHistory({
          spot: spot._id,
          originData: originSpotJSON,
          updateData: updateSpotJSON,
          historyType: 'MODIFY',
          createdBy: req.user._id
        });

        return saveHistory
          .save()
          .then(() => {
            return spot.save()
              .then(() => {
                return res.status(200).json({
                  result: 'success'
                });
              })
              .catch(loggingError);
          })
          .catch(loggingError);
      }else{
        return res.status(200).json({
          result: 'not update.'
        });
      }
    });
};

exports.remove = (req, res) => {

};

exports.like = (req, res) => {
  let spotId = req.params.spotId;
  return Spot.findById(spotId, (err, spot) => {
    handleError(err, res, () => {
      const userId = req.user._id;
      if (!_.includes(spot.likes, userId)) {
        spot.likes.push(userId);
        return spot.save(err => {
          handleError(err, res, () => {
            return res.status(200).json({
              result: 'success'
            });
          });
        })
      }
    });
  });
};

exports.unlike = (req, res) => {
  let spotId = req.params.spotId;
  return Spot.findById(spotId, (err, spot) => {
    handleError(err, res, () => {
      const userId = req.user._id;
      if (_.includes(spot.likes, userId)) {
        spot.likes = _.remove(spot.likes, (likeId) => {
          return likeId === userId
        });

        return spot.save(err => {
          handleError(err, res, () => {
            return res.status(200).json({
              result: 'success'
            });
          });
        })
      }
    });
  });
};

