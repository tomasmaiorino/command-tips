const Position = require('./position');

async function save(position) {
  console.debug('creating position');
  return Position.create(position);
}

module.exports = { save };
