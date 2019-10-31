const express = require('express')
const router = express.Router();
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

module.exports = router;
