const User = require('./user');

async function findById(userId) {
  //console.debug('user controller find by id %j.', userId);
  return User.findById(userId);
}

async function update(userId, newUser) {
  return User.findOneAndUpdate({ _id: userId },
    { $set: newUser }, {new: true, useFindAndModify: false});
}

async function findOne(userEmail) {
  //console.debug("Looking for user by email: ${'userEmail'}.");
  return User.findOne({ email: userEmail });
}

async function save(user) {
  //console.debug("[Controller] - Creating user: %j", user);
  return User.create(user);
}

module.exports = { findById, update, save, findOne };
