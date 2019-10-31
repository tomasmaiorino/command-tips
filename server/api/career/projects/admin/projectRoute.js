const express = require('express')
const router = express.Router();
const ProjectController = require('../projectController');

router.post('/', async (req, res, next) => {
  return ProjectController.create(req, res, next);
});

module.exports = router;
