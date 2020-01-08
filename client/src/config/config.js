'use strict';

// config.js
const env = process.env.NODE_ENV || 'dev'// 'dev' or 'test'

let envValues = {
    server: {
        url: 'http://127.0.0.1:8080'
    }
};

if (process.env.NODE_ENV === 'prod') {
    envValues = {
        server: {
            url: 'http://127.0.0.1:8080'
        }
    };
}

module.exports = envValues;