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
                return res.status(200).json({
                    '_id': saved._id,
                    'username': saved.username,
                    'email': saved.email
                });
            });
    })
    .catch(error => {
        console.log('error catch' + error);
        res.status(500).json({'error': error});
    });
});
module.exports = router;