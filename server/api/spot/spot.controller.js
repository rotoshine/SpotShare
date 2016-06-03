'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Spot = mongoose.model('Spot');

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
  .populate('createdBy', 'name')
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

    return spot.save((err) => {
      if (err) {
        return res.status(500).json({
          error: e.message
        });
      } else {
        return res.send();
      }
    });
};

exports.update = (req, res) => {

};

exports.remove = (req, res) => {

};

exports.like = (req, res) => {
  let spotId = req.params.spotId;
  return Spot.findById(spotId, (err, spot) => {
    handleError(err, res, () => {
      const userId = req.user._id;
      if(!_.includes(spot.likes, userId)){
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
      if(_.includes(spot.likes, userId)){
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

function handleError(err, res, cb){
  if(err){
    return res.status(500).json({
      error: err.message
    });
  }else{
    return cb();
  }
}
