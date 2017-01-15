import async from 'async';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import config from '../config';
import multer from 'multer';
import logger from './logger';

const Spot = mongoose.model('Spot');
const SpotFile = mongoose.model('SpotFile');

const DEFAULT_FILE_FIELDS_NAME = config.defaultFileFieldsName || 'files';
const MAX_UPLOAD_COUNT = config.maxUploadCount || 5;
const MAX_UPLOAD_SIZE = config.maxUploadSize || 1024 * 1024 * 10;
const uploadFromMulter = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, config.fileUploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}`);
    }
  }),
  limits: {
    files: MAX_UPLOAD_COUNT,
    fileSize: MAX_UPLOAD_SIZE
  }
}).array(DEFAULT_FILE_FIELDS_NAME);


const fileUtils = {
  upload: (req, res) => {
    return new Promise((resolve, reject) => {
      uploadFromMulter(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(req.files);
        }
      });
    });
  },

  /**
   * 임시폴더에 있는 파일을 특정 스팟 아래 파일로 이동시키는 함수.
   * 코드의 간결함을 위해 동기방식으로 동작하므로 성능저하를 주의할 것.
   * @param spotId
   * @param uploadedMulterFile
   * @returns {string}
   */
  moveTempToDestination: (spotId, uploadedMulterFile) => {
    const tempFilePath = `${config.fileUploadPath}/${uploadedMulterFile.filename}`;
    const fileDestinationDirectory = path.normalize(`${config.fileUploadPath}/${spotId}`);
    const fileDestination = `${fileDestinationDirectory}/${uploadedMulterFile.filename}`;
    if (!fs.existsSync(fileDestinationDirectory)) {
      fs.mkdirSync(fileDestinationDirectory);
    }

    fs.renameSync(tempFilePath, fileDestination);

    return fileDestination;
  },

  saveSpotFiles: (spotId, userId, uploadedMulterFiles) => {
    return new Promise((resolve, reject) => {
      let works = [];
      uploadedMulterFiles.forEach((uploadedFile) => {
        works.push((next) => {
          let fileDestination = fileUtils.moveTempToDestination(spotId, uploadedFile);

          let spotFile = new SpotFile({
            spot: spotId,
            originalFileName: uploadedFile.filename,
            filePath: fileDestination,
            mimeType: uploadedFile.mimetype,
            size: uploadedFile.size,
            createdBy: userId
          });


          spotFile
            .save()
            .then((savedFile) => {
              next(null, savedFile._id);
            })
            .catch(e => {
              logger.error('upload file info save error', e);
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
  },

  streamFileToResponse: (res, filePath, mimeType) => {
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
  },

  getImageUrl: (fileId) => {
    return `${config.url}/api/files/${fileId}`;
  }
};

export default fileUtils;
