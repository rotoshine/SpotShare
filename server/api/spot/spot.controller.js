'use strict';
const _ = require('lodash');
const fs = require('fs');
const mongoose = require('mongoose');
const Spot = mongoose.model('Spot');
const SpotHistory = mongoose.model('SpotHistory');
const handleError = require('../../utils/handleError').handleError;

const loggingError = (err) => {
  console.error(err);
};

const findSpots = (query) => {
  return new Promise((resolve, reject) => {
    return Spot
      .find(query)
      .populate('files', '_id')
      .populate('createdBy', 'name provider')
      .exec()
      .then(resolve)
      .catch(reject);
  });

};

exports.find = (req, res) => {
  let query = req.query;
  query.isDisplay = true;

  return findSpots(query)
    .then((spots) => {
      return res.json({spots: spots});
    })
    .catch((e) => {
      return res.status(500).json({message: e.message});
    });
};
exports.findWithCoordinates = (req, res) => {
  let queryParams = req.query;
  let x1 = queryParams.x1;
  let x2 = queryParams.x2;
  let y1 = queryParams.y1;
  let y2 = queryParams.y2;

  return findSpots({
    geo: {
      $geoWithin: {
        $box: [
          [x1, y1], [x2, y2]
        ]
      }
    },
    isDisplay: true
  })
    .then((spots) => {
      return res.json({
        spots: spots
      });
    })
    .catch((e) => {
      return res.status(500).json({
        message: e.message
      });
    });

};

exports.findById = (req, res) => {
  const spotId = req.params.spotId;

  return Spot
    .findById(spotId)
    .populate('files', '_id')
    .exec()
    .then((spot) => {
      return res.json(spot);
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message
      })
    });
};

exports.save = (req, res) => {
  let body = req.body;
  delete body.uploadedFiles;

  let spot = new Spot(body);
  spot.createdBy = req.user._id;

  console.log(spot);
  return spot
    .save()
    .then((savedSpot) => {
      return res.json(savedSpot);
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
              .then((updatedSpot) => {
                return res.status(200).json(updatedSpot);
              })
              .catch(loggingError);
          })
          .catch(loggingError);
      } else {
        return res.status(200).json(spot);
      }
    });
};

exports.remove = (req, res) => {
  Spot.findById(req.params.spotId)
    .then(spot => {
      if (spot.createdBy === req.user._id) {
        spot.isDisplay = false;
        spot.save().then(() => {
          return res.status(200).send();
        });
      } else {
        return res.status(401).send();
      }
    });
};

exports.removeRequest = (req, res) => {
  const requestUserId = req.user._id;
  Spot.findById(req.params.spotId)
    .then(spot => {
      if (!spot.removeRequestUsers) {
        spot.removeRequestUsers = [];
      }

      if (!_.includes(spot.removeRequestUsers, requestUserId)) {
        spot.removeRequestUsers.push(requestUserId);
      }

      if (spot.removeRequestUsers.length > 2) {
        spot.isDisplay = false;
      }

      spot.save().then(() => {
        return res.status(200).send();
      });
    })
    .catch(loggingError);
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
