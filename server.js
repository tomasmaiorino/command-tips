const express = require('express')
var command = require('./api/router/command-tips')

var app = express();

app.use('/tips', command);

app.listen(3000, () => console.log('Command tips listening on port 3000!'))