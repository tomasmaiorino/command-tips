const User = require('./user');

function createUser(user) {
    const userModel = new User({ user });
    userModel
        .save()
        .then(doc => {
            return doc;
        })
        .catch(error => {
            console.error(error);
        });
}

function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        User.find({ email: email })
            .then(user => {
                resolve(user);
            })
            .catch(error => {
                reject(error);
            });
    });
}
module.exports = { createUser, findUserByEmail };