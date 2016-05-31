'use strict';
const mongoose = require('mongoose');
const Spot = mongoose.model('Spot');

exports.findAll = (req, res) => {
  console.log(req.user);
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
