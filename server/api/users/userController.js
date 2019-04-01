const User = require('./user');

function findById(userId) {
    return new Promise((resolve, reject) => {
        User.findById(userId)
            .exec()
            .then(user => {
                resolve(user);
            })
            .catch(error => {
                reject(error);
        });
    });
}

function update(userId, newUser) {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate({_id:userId},
            {$set: newUser}, {new:true})
        .then(updatedUser => {
            resolve(updatedUser);
        })
        .catch(error => {
            reject(error);
        });
    });
}

/*
function findByTag(tagValue) {
    return new Promise((resolve, reject) => {
        User.find({ "tags": { $regex: tagValue, $options: 'i' } })
            .exec()
            .then(users => {
                resolve(users);
            })
            .catch(error => {
                reject(error);
        });
    });
}

function search(query) {
    //console.log('looking for ' + query);
    return new Promise((resolve, reject) => {
        User.find({
            $or: [
                { "full_description": { $regex: query, $options: 'i' } },
                { "title": { $regex: query, $options: 'i' } },
                { "user": { $regex: query, $options: 'i' } }]
        })
        .exec()
        .then(users => {
            resolve(users);
        })
        .catch(error =>{
            reject(error);
        })
    });
}
*/

module.exports = { findById, update };
