const bcrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./user');
const mongoose = require('mongoose');
const UserService = require('./userService');
const UserController = require('./userController');


router.get('/:userId', async (req, res, next) => {

  const userId = req.params.userId;

  console.debug('Looking for the user ' + userId + '.');

  try {

    let result = await UserController.findById(userId);

    console.debug('User found %j.', result);

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
    console.info('user to save %j.', req.body);

    let data = await UserController.findOne(req.body.email);

    console.info('user response %j.', data);

    if (data) {
      console.info('user found.');
      return res.status(400).json({
        message: 'Email already exist'
      });
    }
    const user = new User({
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

    console.log('Saving user %j.', user);
    let userSaved = await UserController.save(user);

    console.log('Saved user %j.', userSaved);
    if (userSaved) {
      res.status(201).json({
        'user': user
      });
    }
  } catch (error) {
    console.log('error catch' + error);
    res.status(500).json({ 'error': error });
  }
});

/*
router.put('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    console.log('Updating user ' + userId + '.');
    UserController.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(400).json({
                    'message': 'User not found.'
                });
            }
            const newUser = {
                username: req.body.username,
                email: req.body.email
            };

            UserController.update(req.params.userId, newUser)
            .then(updatedUser => {
                return res.status(200).json({
                    'user': updatedUser
                });
            })
            .catch(error => {
                return res.status(500).json({
                    'error': error
                })
            });
        })
        .catch(error => {
            return res.status(500).json({
                'error': error
            })
        });
});

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/users/5c3f1d1b1fe49b35a0c7a968/tips

router.get('/:userId/tips', (req, res, next) => {

    const userId = req.params.userId;

    console.debug('Looking for the commands from the user ' + userId + '.');

    Command.find({user_id: userId})
        .exec()
        .then(commands => {
            if (commands) {
                res.status(200).json(
                    {
                        commands
                    }
                );
            } else {
                res.status(404);
            }
        })
        .catch(error => {
            res.status(500).json({
                'error': error
            })
        });
});

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X POST http://localhost:3000/users -d "{\"username\":\"test\", \"password\": \"1233\", \"email\": \"teste@test.com\"}"
router.post('/', (req, res, next) => {
  UserController.findOne(req.body.email)
    .then(data => {

        if (data) {
            return res.status(400).json({
                message: 'Email already exist'
            });
        }
        const user = new User({
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

        UserController.save(user)
            .then(saved => {
                return res.status(201).json({
                    'user': user
                });
            });
    })
    .catch(error => {
        console.log('error catch' + error);
        res.status(500).json({'error': error});
    });
});
*/
module.exports = router;
