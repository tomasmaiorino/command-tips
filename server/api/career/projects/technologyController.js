const Technology = require('./technology');

async function findAll() {
  return Technology.find();
}

async function findOne(name) {
  console.debug("Looking for tecnology by name: ${'name'}.");
  return Technology.findOne({ name: name });
}

async function save(technology) {
  console.debug('creating technology');
  return Technology.create(technology);
}


module.exports = { findAll, save, findOne };
