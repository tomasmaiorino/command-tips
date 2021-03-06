'use strict';

// config.js
const env = process.env.NODE_ENV;// 'dev' or 'test'

let envValues = {
    server: {
        url: ''
    }
};

if (env === 'development') {
    envValues.server.url = 'http://127.0.0.1:8089';
}

module.exports = envValues;
