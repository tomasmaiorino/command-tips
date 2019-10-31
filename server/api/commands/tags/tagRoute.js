const express = require('express')
const router = express.Router();
const TagController = require('./tagController');

router.get('/', (req, res, next) => {
  return TagController.findAllTags(req, res, next);
});

module.exports = router;
