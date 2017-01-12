const async = require('async');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Spot = mongoose.model('Spot');
const SpotFile = mongoose.model('SpotFile');
const config = require('../config');

/**
 * 임시폴더에 있는 파일을 특정 스팟 아래 파일로 이동시키는 함수.
 * 코드의 간결함을 위해 동기방식으로 동작하므로 성능저하를 주의할 것.
 * @param spotId
 * @param uploadedMulterFile
 * @returns {string}
 */
const moveTempToDestination = (spotId, uploadedMulterFile) => {
  const fileDestinationDirectory = path.normalize(`${config.fileUploadPath}/${spotId}`);
  const fileDestination = `${fileDestinationDirectory}/${uploadedMulterFile.filename}`;
  if (!fs.existsSync(fileDestinationDirectory)) {
    fs.mkdirSync(fileDestinationDirectory);
  }

  fs.renameSync(uploadedMulterFile.path, fileDestination);

  return fileDestination;
};
exports.moveTempToDestination = moveTempToDestination;

const saveSpotFiles = (spotId, userId, uploadedMulterFiles) => {
  return new Promise((resolve, reject) => {
    let works = [];
    uploadedMulterFiles.forEach((uploadedFile) => {
      works.push((next) => {
        let fileDestination = moveTempToDestination(spotId, uploadedFile);

        let spotFile = new SpotFile({
          spot: spotId,
          originalFileName: uploadedFile.filename,
          filePath: fileDestination,
          mimeType: uploadedFile.mimetype,
          createdBy: userId
        });

        spotFile
          .save()
          .then((savedFile) => {
            next(null, savedFile._id);
          })
          .catch(e => {
            next(e);
          });
      });
    });

    async.parallel(works, (err, results) => {
      if (err) {
        reject(err);
      } else {
        Spot
          .findById(spotId)
          .then((spot) => {
            spot.files = spot.files.concat(results);

            spot.save().then(() => {
              return resolve(results);
            });
          })
          .catch((err) => {
            return reject(err);
          });
      }

    });
  });
};
exports.saveSpotFiles = saveSpotFiles;

const streamFileToResponse = (res, filePath, mimeType) => {
  return fs.exists(filePath, (exists) => {
    if (exists) {
      if (mimeType) {
        res.header('content-type', mimeType);
      }
      return fs.createReadStream(filePath).pipe(res);
    } else {
      return res.status(404).json({
        message: 'file not found'
      });
    }
  });
};
exports.streamFileToResponse = streamFileToResponse;
