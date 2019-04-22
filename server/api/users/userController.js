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

function findOne(userEmail) {
  console.debug("Looking for user by email: " + userEmail);
  return new Promise((resolve, reject) => {
    User.findOne({email:userEmail})
      .then(user => {
        resolve(user);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function save(user) {
  console.debug("Creating user: " + user);
    return new Promise((resolve, reject) => {
        User.create(user)
        .then(createdUser => {
            resolve(createdUser)
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = { findById, update, save, findOne };
