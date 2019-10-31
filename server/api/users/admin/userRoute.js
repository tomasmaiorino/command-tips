const express = require('express')
const router = express.Router();
const UserController = require('../userController');

router.post('/', async (req, res, next) => {
  return UserController.create(req, res, next);
});
router.put('/:userId', async (req, res, next) => {
  return UserController.updateUser(req, res, next);
});

module.exports = router;
