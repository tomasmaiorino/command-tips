const Position = require('./position');

async function save(position) {
  console.debug('creating position');
  return Position.create(position);
}

async function findById(positionId) {
  console.info('controller -> Looking for the position  ' + positionId);
  return Position.findById(positionId);
}

module.exports = { save, findById };
