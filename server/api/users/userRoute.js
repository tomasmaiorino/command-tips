const express = require('express')
const router = express.Router();
const UserController = require('./userController');

router.get('/:userId', async (req, res, next) => {
  return UserController.findUser(req, res, next);
});

module.exports = router;
