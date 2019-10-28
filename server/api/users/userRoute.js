const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router();
const User = require('./user');
const UserController = require('./userController');


router.get('/:userId', async (req, res, next) => {

  const userId = req.params.userId;

  ///console.debug('Looking for the user ' + userId + '.');

  try {

    let result = await UserController.findById(userId);

    //console.debug('User found %j.', result);

    if (result) {
      res.status(200).json({
        'user': user
      });
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error('Error finding user %j. Error %j', userId, error);
    res.status(500).json({
      'error': error
    });
  }
});

router.post('/', async (req, res, next) => {

  try {
    //console.debug('user to save %j.', req.body);

    let data = await UserController.findOne(req.body.email);

    //console.debug('user response %j.', data);

    if (data) {
      console.info('User found for email %j.', data.email);
      return res.status(400).json({
        message: 'Email already exist'
      });
    }
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    });

    const error = user.validateSync();

    if (error) {
      console.log('Invalid user given ' + user + ' .');
      return res.status(400).json({
        'errors': error.errors
      });
    }

    //console.debug('Saving user %j.', user);

    let userSaved = await UserController.save(user);

    //console.debug('Saved user %j.', userSaved);

    if (userSaved) {
      return res.status(201).json({
        'user': user
      });
    } else {
      return res.status(500).json({});
    }
  } catch (error) {
    console.log('error catch' + error);
    return res.status(500).json({ 'error': error });
  }
});
router.put('/:userId', async (req, res, next) => {
  const userId = req.params.userId;
  console.info('Updating user ' + userId + '.');

  try {

    let user = await UserController.findById(req.params.userId);

    if (!user) {
      console.log('User not found.');
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    let userByEmail = await UserController.findOne(req.body.email);
    
    if (userByEmail != null && !userByEmail._id.equals(user._id)){
      console.log('Email %j already in use.', userByEmail.email);
      return res.status(400).json({
        message: 'Email already in use.'
      });
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

      console.log('error ' + error);

      return res.status(400).json({
        'errors': error.errors
      });
    }

    let updatedUser = await UserController.update(userId, newUser);

    console.log('User updated.');

    if (updatedUser) {
      return res.status(200).json({
        'user': user
      });
    } else {
      return res.status(500).json({});
    }

  } catch(err){
    console.log('Error .' + err);
  };

});
module.exports = router;
