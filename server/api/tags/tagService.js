const mongoose = require('mongoose');
const Tag = require('./tag');

function save(tag) {
    
    return new Promise((resolve, reject) => {
        const tagModel = new Tag(tag);
        tagModel
        .save()
        .then(doc => {
            resolve(doc)
        })
        .catch(error => {
            reject(error);
        });
    });

}

function findAllTags() {
    return new Promise((resolve, reject) => {
        Tag.find()
            .then(tags => {
                resolve(tags);
            })
            .catch(error => {
                reject(error);
            });

    });
}
module.exports = { save, findAllTags };