const express = require('express')

var command = require('./api/routes/command-tips');

var app = express();

const port = process.env.PORT || 3000;

app.use('/tips', command);

app.use((req, res, next) => {
    const error = new Error("not found");
    error.setStatus(404);
    next(error);
});

app.use((error, req, res, next) => {

});

app.listen(port, () => console.log('Command tips listening on port 3000!'))