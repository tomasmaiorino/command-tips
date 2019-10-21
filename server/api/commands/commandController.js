const Command = require('./command');

async function findById(commandId) {
  //console.debug('controller -> Looking for the command  ' + commandId);
  return Command.findById(commandId);
}

async function findByTag(tagValue) {
  //console.debug('looking command by tag %j.', tagValue);
  return Command.find({ "tags": { $regex: tagValue, $options: 'i' } });
}

async function save(command) {
  //console.debug('creating command');
  return Command.create(command);
}

async function search(query) {
  //console.debug('looking for ' + query);
  return Command.find({
    $or: [
      { "full_description": { $regex: query, $options: 'i' } },
      { "title": { $regex: query, $options: 'i' } },
      { "command": { $regex: query, $options: 'i' } }]
  });
}

module.exports = { findById, findByTag, search, save };
