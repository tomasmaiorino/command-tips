const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();
const User = require('../users/user');
const CommandController = require('./commandController');


//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/5c3f1f833de0b83a31915f05

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/users/

router.get('/tags/:tagValue', async (req, res, next) => {
  return CommandController.findByTag(req, res, next);
});

router.get('/:commandId', (req, res, next) => {
  return CommandController.findById(req, res, next);
});

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/search/kill
router.get('/search/:query', async (req, res, next) => {
  return CommandController.search(req, res, next); 
});

router.patch('/:commandId', async (req, res, next) => {
  return CommandController.updateCommand(req, res, next); 
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

module.exports = router;
