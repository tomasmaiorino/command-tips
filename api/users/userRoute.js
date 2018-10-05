const bcrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./user');
const mongoose = require('mongoose');
const UserService = require('./userService');

router.get('/:userId', (req, res, next) => {
    const userId = req.params.userId;

    console.log('Looking for the user ' + userId + '.');

    if (mongoose.Types.ObjectId.isValid(userId)) {
        User.findById(req.params.userId)
            .exec()
            .then(user => {
                if (user) {
                    res.status(200).json(
                        {
                            '_id': user._id,
                            'username': user.username,
                            'email': user.email
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
    } else {
        res.status(500).json({
            'message': 'Invalid id'
        });
    }
});

router.post('/', (req, res, next) => {

    console.log('Receiving request to create an user ->');

    const user = {
        _id: mongoose.Types.ObjectId(),
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }

    const userModel = new User(user);
    const error = userModel.validateSync();

    if (error) {
        console.debug('Invalid user given ' + user + ' .');
        return res.status(400).json({
            'errors': error.errors
        });
    } else {
        //console.log('User to be created ' + user);
        UserService.findUserByEmail(user.email)
            .then(data => {
                if (data) {
                    //console.log('user found ' + data);
                    return res.status(400).json({
                        'message': 'Email already exist'
                    });
                } else {
                    return UserService.save(user);
                }
            }).then(result => {
                res.status(201).json({
                    result
                });
            }).catch(error => {
                console.log('error catch' + error);
                res.status(500).json({'error': error});
        });
    }
});
module.exports = router;