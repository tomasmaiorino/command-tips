const express = require('express')
const router = express.Router();
const PositionController = require('./positionController');

router.get('/:id', async (req, res, next) => {
  return PositionController.findById(req, res, next);
});

module.exports = router;
