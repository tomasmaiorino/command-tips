const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();
const User = require('../../users/user');
const CommandController = require('../commandController');

router.patch('/:commandId', async (req, res, next) => {
    return CommandController.updateCommand(req, res, next);
});

router.post('/',
    /*
    (req, res, next) =>
    {
    doValidateRequest(req, res, next);
    },
    (req, res, next) => {
       checkValidUser(req, res, next);
    },
    */
    async (req, res, next) => {
        return CommandController.create(req, res, next);
    });

doValidateRequest = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        res.status(400).json({
            'message': 'Invalid user id.'
        });
    } else {
        next();
    }
}

checkValidUser = (req, res, next) => {
    User.findOne({ _id: req.body.userId })
        .then(user => {
            if (!user) {
                res.status(400).json({
                    'message': 'User not found.'
                });
            } else {
                next();
            }
        })
        .catch(error => {
            res.status(500).json({
                'error': error
            });
        });
}

module.exports = router;
