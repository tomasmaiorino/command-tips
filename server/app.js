const express = require('express')
const bodyParser = require('body-parser')
const command = require('./api/commands/commandRoute');
const users = require('./api/users/userRoute');
const tag = require('./api/tags/tagRoute');

const app = express();

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use('/api/tags', tag);
app.use('/api/tips', command);
app.use('/api/users', users);

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