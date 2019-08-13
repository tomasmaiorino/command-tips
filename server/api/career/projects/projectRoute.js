const bcrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
const Project = require('./project');
const ProjectController = require('./projectController');


router.get('/', async (req, res, next) => {

  console.debug('creating project.');

  const project = new Project({
    name: req.body.name,
    techs: req.body.techs,
    role: req.body.role,
    description: req.body.description,
    achievements: req.body.achievements
  });

  const error = project.validateSync();

  if (error) {
    console.log('Invalid project given [' + project + '].');
    return res.status(400).json({
      'errors': error.errors
    });
  }

  try {

    let projectResponse = await ProjectController.save(project);

    if (projectResponse) {
      return res.status(201).json({
        'project': projectResponse
      });
    }

  } catch (error) {
    console.log('Error creation project [' + error + '].');
    res.status(500).json({
      'error': error
    });
  }
});

module.exports = router;
