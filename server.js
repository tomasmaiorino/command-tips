const app = require('./app');
const http = require('http');
const config = require('./config/env/development');
const mongoose = require('mongoose');

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || '3000';

app.set('port', port);

mongoose
    .connect(config.db,{ useNewUrlParser: true})
    .then(() => {
        console.log('Database connected.');
    });

http.createServer(app).listen(app.get('port'), function(){            
    console.log('Listening on port ' + app.get('port')); 
}); 