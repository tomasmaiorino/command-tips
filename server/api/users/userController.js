const User = require('./user');

async function findById(userId) {
  console.debug('user controller find by id ' + userId);
  return User.findById(userId).exec((error, user) => {
    if (error) {
      return error;
    } else {
      return user;
    }
  });
}

function update(userId, newUser) {
  return User.findOneAndUpdate({ _id: userId },
    { $set: newUser }, { new: true });
}

async function findOne(userEmail) {
  console.debug("Looking for user by email: " + userEmail);
  return User.findOne({ email: userEmail }).exec((error, user) => {
    if (error) {
      return error;
    } else {
      return user;
    }
  });
}

async function save(user) {
  console.info("Creating user: " + user);
  return await User.create(user);
}

module.exports = { findById, update, save, findOne };
