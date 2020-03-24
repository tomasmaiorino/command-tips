'use strict';

// config.js
const env = process.env.NODE_ENV || 'dev'// 'dev' or 'test'

let envValues = {
    server: {
        url: 'http://127.0.0.1:8080'
    }
};

if (env === 'prod') {
    envValues.server.url = '';
}

module.exports = envValues;
