const Command = require('./command');

function findById(commandId) {
    return new Promise((resolve, reject) => {
        Command.findById(commandId)
            .exec()
            .then(command => {
                resolve(command);
            })
            .catch(error => {
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
        .exec((err, commands) => {
            if (err) {
                reject(err);
            }
            resolve(commands);
        });
    });
}

module.exports = { findById, findByTag, search };