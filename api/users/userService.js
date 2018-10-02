const User = require('./user');

function save(user) {
    console.log('user to be created ' + JSON.stringify(user));
    return new Promise((resolve, reject) => {
        const userModel = new User({ user });
        console.log('user model to be created ' + JSON.stringify(userModel));
        userModel
        .save()
        .then(doc => {
            resolve(doc)
        })
        .catch(error => {
            reject(error);
        });
    });
}

function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email })
            .then(user => {
                resolve(user);
            })
            .catch(error => {
                reject(error);
            });

    });
}
module.exports = { save, findUserByEmail };