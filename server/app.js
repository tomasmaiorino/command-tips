const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');

//admin rounts
const adminProjects = require('./api/career/projects/admin/projectRoute');
const projects = require('./api/career/projects/projectRoute');
const adminCommands = require('./api/commands/commandAdminRoute');
const adminPositions = require('./api/career/positions/admin/positionRoute');

const adminUsers = require('./api/users/admin/userRoute');
const commands = require('./api/commands/commandRoute');
const tags = require('./api/tags/tagRoute');
const users = require('./api/users/userRoute');
const positions = require('./api/career/positions/positionRoute');

const CheckTokenMiddleware = require('./api/util/checkTokenMiddleware');
const firebaseHelper = require('./api/util/firebaseHelper')
const app = express();
const cors = require('cors');

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

firebaseHelper.initialize(serviceAccount);

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
