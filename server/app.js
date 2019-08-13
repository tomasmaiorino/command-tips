const express = require('express')
const bodyParser = require('body-parser')
const users = require('./api/users/userRoute');
const commands = require('./api/commands/commandRoute');
const tags = require('./api/commands/tags/tagRoute');
const projects = require('./api/career/projects/projectRoute');

const app = express();

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use('/api/users', users);
app.use('/api/tips', commands);
app.use('/api/tags', tags);
app.use('/api/projects', projects);

app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
