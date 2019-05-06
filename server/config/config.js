'use strict';

// config.js
const env = process.env.NODE_ENV || 'dev'// 'dev' or 'test'

let envValues = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000
  },
  db: {
    url: 'mongodb://localhost:27017/command-tips'
  }
};
if (process.env.NODE_ENV === 'prod') {
  envValues = {
    db: {
  //    url: 'mongodb://localhost:27017/command-tips'
      url: process.env.MONGODB_URI || process.env.MONGODB_URI.toString()
    }
  };
} else if (process.env.NODE_ENV === 'test') {
  envValues = {
    db: {
      url: 'mongodb://localhost:27017/command-tips-test'
    }
  }
}
// const config = {
//   dev,
//   prod
// };

//module.exports = config[env];
module.exports = envValues;


// /**
//  * Expose
//  */

// module.exports = {
//   db: 'mongodb://localhost:27017/command-tips'
// }
