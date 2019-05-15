const Command = require('./command');

function findById(commandId) {
  console.debug('controller -> Looking for the command  ' + commandId);
    return new Promise((resolve, reject) => {
      console.debug('promisse -> Looking for the command  ' + commandId);
        Command.findById(commandId)
            .exec()
            .then(command => {
              console.debug('resolving commnad  ' + command);
                resolve(command);
            })
            .catch(error => {
              console.error('error looking for command. ' + commandId);
              reject(error);
        });
    });
}

function findByTag(tagValue) {
    return new Promise((resolve, reject) => {
        Command.find({ "tags": { $regex: tagValue, $options: 'i' } })
            .exec()
            .then(commands => {
                resolve(commands);
            })
            .catch(error => {
                reject(error);
        });
    });
}

function search(query) {
    //console.log('looking for ' + query);
    return new Promise((resolve, reject) => {
        Command.find({
            $or: [
                { "full_description": { $regex: query, $options: 'i' } },
                { "title": { $regex: query, $options: 'i' } },
                { "command": { $regex: query, $options: 'i' } }]
        })
        .exec()
        .then(commands => {
            resolve(commands);
        })
        .catch(error =>{
            reject(error);
        })
    });
}

module.exports = { findById, findByTag, search };
