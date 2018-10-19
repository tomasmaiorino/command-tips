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
    User.findById(req.params.userId)
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json(
                    {
                    'user': user
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


router.put('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    console.log('Updating user ' + userId + '.');
    User.findById(req.params.userId)
        .exec()
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

            User.findOneAndUpdate({_id:req.params.userId},
                {$set: newUser}, {new:true})
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

router.post('/', (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(data => {
        if (data) {
            return res.status(400).json({
                message: 'Email already exist'
            });
        }
        const user = new User({
            _id: mongoose.Types.ObjectId(),
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

        UserService.save(user)
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

module.exports = router;