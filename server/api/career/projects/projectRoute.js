const express = require('express')
const router = express.Router();
const ProjectController = require('./projectController');

router.get('/:id', async (req, res, next) => {
  return ProjectController.findById(req, res, next);
});

module.exports = router;
