'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');
const handleError = require('../../utils/handleError').handleError;

exports.findBySpotId = (req, res) => {
  const spotId = req.params.spotId;

  return Comment
    .find({
      spot: spotId
    })
    .populate('createdBy', 'name')
    .sort({
      createdAt: -1
    })
    .exec((err, comments) => {
      handleError(err, res, () => {
        return res.json({
          comments: comments
        });
      })
    });
};


exports.create = (req, res) => {
  let comment = new Comment(req.body);
  comment.spot = req.params.spotId;
  comment.createdBy = req.user._id;

  return comment.save((err) => {
    return handleError(err, res, () => {
      return res.json({
        success: true
      });
    })
  });
};

exports.remove = (req, res) => {
  const commentId = req.params;

  return Comment.remove({
    _id: commentId
  }, (err) => {
    return handleError(err, res, () => {
      return res.json({
        success: true
      });
    });
  });
};
