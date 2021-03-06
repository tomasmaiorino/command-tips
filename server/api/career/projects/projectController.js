const Project = require('./project');
const Technology = require('./technology');
const ErrorsUtils = require('../../util/errorsUtils');

async function findById(req, res, next) {

  try {

    const projectId = req.params.id;
    console.info('finding project by id %j.', projectId);

    let project = await Project.findById(projectId);

    //console.debug('project found %j.', project);

    if (project == null) {
      return next(ErrorsUtils.createNotFound('project not found'));
    }

    return res.status(200).json({
      "project": project
    });

  } catch (error) {
    console.log('Error creation project [' + error + '].');
    return next(ErrorsUtils.createGenericError(error.message));
  }
}

async function create(req, res, next) {

  console.debug('creating project.');

  let technologies = await processTecnologies(req.body.techs);

  //console.debug('technologies to be create ' + technologies);

  const project = new Project({
    userAuthId: req.authId,
    name: req.body.name,
    techs: technologies,
    roles: req.body.roles,
    description: req.body.description,
    achievements: req.body.achievements,
    companyName: req.body.companyName,
    projectTimeline: req.body.projectTimeline
  });

  const errors = project.validateSync();

  if (errors) {
    console.debug('Invalid project given [' + project + '].');
    console.log(errors.message);
    return next(ErrorsUtils.createBadRequest(errors.message));
  }

  //console.debug('%j', req.body);<

  //console.info('project being created %j.', project);

  let newTechs = await saveTechnologies(project.techs);

  try {

    let projectResponse = await Project.create(project);

    if (projectResponse) {

      return res.status(201).json({
        'project': projectResponse
      });
    }

  } catch (error) {
    console.log('Error creation project [' + error + '].');
    return next(ErrorsUtils.createGenericError(error.message));
  }
}

async function processTecnologies(techs) {
  //console.info('Processing techs %j.', techs);
  if (techs != null && techs.length > 1) {
    let createdTechs = await Technology.find();
    //console.log('Created techs %j.', createdTechs)
    if (createdTechs != null && createdTechs.length > 0) {
      return createTechs(techs, false);
    } else {
      return createTechs(techs, true);
    }
  }
  return null;
}

async function createTechs(techs, onlyCreate) {
  //console.info('Creating techs %j. %j', techs, onlyCreate);
  let projectTechs = new Array();
  for (const t of techs) {
    if (onlyCreate) {
      projectTechs.push(createTech(t));
    } else {
      let createdTechs = await Technology.find();
      let op = createdTechs.filter(data => (data.name.upperCase === t.upperCase));
      if (!op) {
        projectTechs.push(createTech(t));
      } else {
        projectTechs.push(op);
      }
    }
  }
  //console.log('techs to creat %j', projectTechs);
  return projectTechs;
}

async function saveTechnologies(techs) {

  //console.log('techs to be saved %j', techs);

  for (const t of techs) {
    if (!t.createdAt) {
      try {
        let saved = await Technology.create(t);
        //console.log('tec saved %j', saved);
      } catch (err) {
        console.log('Error saving tecnologies %j.', err);
      };
    }
  }

  techs.forEach(t => {

  });
}

function createTech(name) {
  let tech = new Technology({
    'name': name
  });
  return tech;
}


module.exports = { findById, create };
