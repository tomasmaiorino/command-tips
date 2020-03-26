'use strict';

// config.js
const env = process.env.NODE_ENV;// 'dev' or 'test'

let envValues = {
    server: {
        url: ''
    }
};

if (env === 'dev') {
    envValues.server.url = 'http://127.0.0.1:8080';
}

module.exports = envValues;
