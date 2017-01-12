const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'spot-share.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'spot-share-error.log',
      level: 'error'
    })
  ]
});

module.exports = logger;
