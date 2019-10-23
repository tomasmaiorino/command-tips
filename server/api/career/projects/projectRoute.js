const bcrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
const Project = require('./project');
const ProjectController = require('./projectController');
const Technology = require('./technology');
const TechnologyController = require('./technologyController');

router.get('/:id', async (req, res, next) => {

  try {

    const projectId = req.params.id;
    console.info('finding project by id %j.', projectId);

    let project = await ProjectController.findById(projectId);

    console.debug('project found %j.', project);

    if (project == null) {
      return res.status(404).json({});
    }

    return res.status(200).json({
      "project": project
    });

  } catch (error) {
    return res.status(500).json({
      'error': error
    });
  }
});

router.post('/', async (req, res, next) => {

  console.debug('creating project.');

  let technologies = await processTecnologies(req.body.techs);

  //console.debug('technologies to be create ' + technologies);

  const project = new Project({
    name: req.body.name,
    techs: technologies,
    roles: req.body.roles,
    description: req.body.description,
    achievements: req.body.achievements
  });

  //console.debug('%j', req.body);

  //console.info('project being created %j.', project);

  let newTechs = await saveTechnologies(techs);

  const error = project.validateSync();

  if (error) {
    console.debug('Invalid project given [' + project + '].');
    console.log(error);
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

function createTech(name) {
  let tech = new Technology({
    'name': name
  });
  return tech;
}

async function saveTechnologies(techs) {

  console.log('techs to be saved %j', techs);

  for (const t of techs) {
    if (!t.createdAt) {
      try {
        let saved = await TechnologyController.save(t);
        console.log('tec saved %j', saved);
      } catch(err) {
        console.log('Error saving tecnologies %j.', err);
      };
    }
  }

  techs.forEach(t => {
    
  });
}

async function createTechs(techs, onlyCreate) {
  console.info('Creating techs %j. %j', techs, onlyCreate);
  let projectTechs = new Array();
  techs.forEach(t => {
    if (onlyCreate) {
      projectTechs.push(createTech(t));
    } else {
      let op = createdTechs.filter(data => (data.name.upperCase === t.upperCase));
      if (!op) {
        projectTechs.push(createTech(t));
      } else {
        projectTechs.push(op);
      }
    }
  });
  console.log('techs to creat %j', projectTechs);
  return projectTechs;
}

async function processTecnologies(techs) {
  console.info('Processing techs %j.', techs);
  if (techs != null && techs.length > 1) {
    let createdTechs = await TechnologyController.findAll();
    console.log('Created techs %j.', createdTechs)
    if (createdTechs != null && createdTechs.length > 0) {
      return createTechs(techs, false);
    } else {
      return createTechs(techs, true);
    }
  }
  return null;
}

function processRoles(roles) {
  if (!roles && roles.length > 1) {


  }
}

module.exports = router;
