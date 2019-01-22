'use strict';

// config.js
const env = process.env.NODE_ENV || 'dev'// 'dev' or 'test'

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000
  },
  db: {
    url: 'mongodb://localhost:27017/command-tips'
  }
};
const prod = {
  db: {
//    url: 'mongodb://localhost:27017/command-tips'
    url: '' + process.env.MONGODB_URI
  }
};

const config = {
  dev,
  prod
};

module.exports = config[env];


// /**
//  * Expose
//  */

// module.exports = {
//   db: 'mongodb://localhost:27017/command-tips'
// }
