const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router();
const User = require('./user');
const UserController = require('./userController');


router.get('/:userId', async (req, res, next) => {
  return UserController.findUser(req, res, next);
});

router.post('/', async (req, res, next) => {
  return UserController.create(req, res, next);  
});
router.put('/:userId', async (req, res, next) => {
  return UserController.updateUser(req, res, next);
});
module.exports = router;
