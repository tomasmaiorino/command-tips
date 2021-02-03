const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');

const commands = require('./api/commands/commandRoute');
const app = express();
const cors = require('cors');

let env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
    console.log('configuring cors for dev environment.');
    let whitelist = ['http://localhost:3000', 'http://0.0.0.0:3000'];

    let corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        methods: 'DELETE, POST, GET, OPTIONS',
        allowedHeaders: "Content-Type, Authorization"
    }
    app.use(cors(corsOptions));
}
app.use(express.static("dist"));

app.use(bodyParser.json());
/*
app.use((req, res, next) => {
    req.isAuth = true;
    next();
});
*/
app.use('/api/tips', commands);

//e2e means end to end test outside production
if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'e2e') {
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, './dist/index.html'));
    });
}

app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            error: error.code,
            message: error.message
        }
    });
});

module.exports = app;
