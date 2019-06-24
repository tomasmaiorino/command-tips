const User = require('./user');

function findById(userId) {
  return User.findById(userId)
    .exec();
}

function update(userId, newUser) {
  return User.findOneAndUpdate({ _id: userId },
    { $set: newUser }, { new: true });
}

function findOne(userEmail) {
  console.debug("Looking for user by email: " + userEmail);
  return User.findOne({ email: userEmail });
}

function save(user) {
  console.debug("Creating user: " + user);
  return User.create(user);
}

module.exports = { findById, update, save, findOne };
