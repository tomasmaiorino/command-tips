const express = require('express')
const bodyParser = require('body-parser')
const users = require('./api/users/userRoute');
const adminUsers = require('./api/users/admin/userRoute');
const commands = require('./api/commands/commandRoute');
const adminCommands = require('./api/commands/admin/commandRoute');
const tags = require('./api/commands/tags/tagRoute');
const projects = require('./api/career/projects/projectRoute');
const adminProjects = require('./api/career/projects/admin/projectRoute');
const positions = require('./api/career/positions/positionRoute');
const adminPositions = require('./api/career/positions/admin/positionRoute');
const CheckTokenMiddleware = require('./api/util/checkTokenMiddleware');
const firebaseAdmin = require('firebase-admin')
const app = express();
const cors = require('cors');

firebaseAdmin.initializeApp({
    "credential": firebaseAdmin.credential.applicationDefault()
});

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
    allowedHeaders: "Content-Type"
}

app.use(cors(corsOptions));
app.use(express.static("dist"));

app.use(bodyParser.json());
/*
app.use((req, res, next) => {
    req.isAuth = true;
    next();
});
*/
app.use(CheckTokenMiddleware.checkIfAuthenticated);
app.use('/api/users', users);
app.use('/api/tips', commands);
app.use('/api/tags', tags);
app.use('/api/projects', projects);
app.use('/api/positions', positions);

// admin routes
app.use('/admin/api/users', adminUsers);
app.use('/admin/api/commands', adminCommands);
app.use('/admin/api/projects', adminProjects);
app.use('/admin/api/positions', adminPositions);


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
