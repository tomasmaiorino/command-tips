const express = require('express')
const router = express.Router();
const { findAllTags, search } = require('./tagController');

router.get('/', (req, res, next) => {
  return findAllTags(req, res, next);
});

router.get('/search/:query', async (req, res, next) => {
  return search(req, res, next);
});

module.exports = router;
