const express = require('express')
const router = express.Router();
const PositionController = require('./positionController');

router.post('/:id', async (req, res, next) => {
  return PositionController.addProjectsToPosition(req, res, next);
});

router.post('/', async (req, res, next) => {
  return PositionController.create(req, res, next);
});

module.exports = router;
