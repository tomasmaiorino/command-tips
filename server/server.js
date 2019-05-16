const app = require('./app');
const http = require('http');
const config = require('./config/config');
const mongoose = require('mongoose');

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || '8080';

app.set('port', port);

if (process.env.NODE_ENV !== 'test') {
  mongoose
      .connect(config.db.url,{ useNewUrlParser: true})
      .then(() => {
          console.log('Database connected.');
  });
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('Listening on port ' + app.get('port'));
});

