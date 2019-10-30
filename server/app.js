const express = require('express')
const bodyParser = require('body-parser')
const users = require('./api/users/userRoute');
const commands = require('./api/commands/commandRoute');
const tags = require('./api/commands/tags/tagRoute');
const projects = require('./api/career/projects/projectRoute');
const positions = require('./api/career/positions/positionRoute');

const app = express();

app.use(express.static("dist"));
app.use(bodyParser.json());
/*
app.use((req, res, next) => {
    req.isAuth = true;
    next();
});
*/
app.use('/api/users', users);
app.use('/api/tips', commands);
app.use('/api/tags', tags);
app.use('/api/projects', projects);
app.use('/api/positions', positions);

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
