const bcrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./user');
const mongoose = require('mongoose');

router.get('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    
    console.log('Looking for the user ' + userId + '.');

    if (mongoose.Types.ObjectId.isValid(userId)) {
    User.findById(req.params.userId)
        .exec()
        .then( user => {
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

 router.post('/',(req, res, next) => {

    console.log('receiving request to create an user ->');

    const user = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }

    const userModel = new User(user);
    const error = userModel.validateSync();

    if (error) {
        res.status(400).json({
            'errors': error.errors
        })
    }

    console.log('user to be created ' + user);

    User.find({email: user.email})
        .then(user => {
            if (user) {
                res.status(400).json({
                    'message': 'Email already exist'
                })
            }
        })
        .catch(error => {
            res.status(500).json({'error': error});
        });    
    
    userModel
    .save()
    .then( doc => {
        res.status(200).json({
            '_id': doc._id,
            'username': doc.username,
            'email': doc.email
        });
    })
    .catch( error => {
        res.status(500).json({'error': error});
    });
  
 });

function configureResponse(model) {
    
}

 module.exports = router;