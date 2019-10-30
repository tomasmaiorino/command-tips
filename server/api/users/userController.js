const bcrypt = require('bcryptjs');
const User = require('./user');
const ErrorsUtils = require('../util/errorsUtils');

async function findUser(req, res, next) {

  const userId = req.params.userId;

  ///console.debug('Looking for the user ' + userId + '.');

  try {

    let result = await User.findById(userId);

    //console.debug('User found %j.', result);

    if (result) {
      return res.status(200).json({
        'user': user
      });
    } else {
      return next(ErrorsUtils.createNotFound('user not found'));
    }
  } catch (error) {
    console.error('Error finding user %j. Error %j', userId, error);
    return next(ErrorsUtils.createGenericError(error.message));
  }
}

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

async function create(req, res, next) {
  try {
    //console.debug('user to save %j.', req.body);

    let data = await User.findOne({ email: req.body.email });

    //console.debug('user response %j.', data);

    if (data) {
      console.info('User found for email %j.', data.email);
      return next(ErrorsUtils.createBadRequest('Email already exist'));
    }
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    });

    const error = user.validateSync();

    if (error) {
      console.log('Invalid user given ' + user + ' .');
      console.log(error.message);
      return next(ErrorsUtils.createBadRequest(error.message));
    }

    //console.debug('Saving user %j.', user);

    let userSaved = await User.create(user);

    //console.debug('Saved user %j.', userSaved);

    if (userSaved) {
      return res.status(201).json({
        'user': user
      });
    } else {
      return next(ErrorsUtils.createGenericError(error.message));
    }
  } catch (error) {
    console.log('error catch' + error);
    return next(ErrorsUtils.createGenericError(error.message));
  }
}

async function updateUser(req, res, next) {
  const userId = req.params.userId;
  console.info('Updating user ' + userId + '.');

  try {

    let user = await User.findById(req.params.userId);

    if (!user) {
      console.log('User not found.');
      return next(ErrorsUtils.createNotFound('user not found'));
    }

    let userByEmail = await User.findOne({ email: req.body.email });
    
    if (userByEmail != null && !userByEmail._id.equals(user._id)){
      console.info('User found for email %j.', req.body.email);
      return next(ErrorsUtils.createBadRequest('Email already exist'));
    }

    console.log('request body %j', req.body);

    const newUser = new User({
      _id: userId,
      password: user.password,
      username: req.body.username,
      email: req.body.email
    });

    const error = newUser.validateSync();

    if (error) {
      console.log('Invalid user given %j for update.', user);
      console.log(error.message);
      return next(ErrorsUtils.createBadRequest(error.message));
    }

    let updatedUser = await User.findOneAndUpdate({ _id: userId },
      { $set: newUser }, {new: true, useFindAndModify: false});

    console.log('User updated.');

    if (updatedUser) {
      return res.status(200).json({
        'user': user
      });
    } else {
      return next(ErrorsUtils.createGenericError(error.message));
    }

  } catch(error){
    console.log('Error .' + error);
    return next(ErrorsUtils.createGenericError(error.message));
  };
}

module.exports = { updateUser, create, findUser, findById, update, save, findOne };
