const app = require('./app');
const http = require('http');
const config = require('./config/config');

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || '8089';

app.set('port', port);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Listening on port ' + app.get('port'));
});

