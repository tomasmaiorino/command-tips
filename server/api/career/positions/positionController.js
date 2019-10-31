const Position = require('./position');
const Project = require('../projects/project')
const ErrorsUtils = require('../../util/errorsUtils')

async function addProjectsToPosition(req, res, next) {
  try {

    const positionId = req.params.id;
    console.info('finding position by id %j.', positionId);

    let position = await Position.findById(positionId);

    //console.log('position found %j', position);

    if (position == null) {
      return next(ErrorsUtils.createNotFound('position not found.'));
    }

    if (req.body.projectIds === null) {
      return next(ErrorsUtils.createBadRequest('The project ids must be informed.'));
    }

    let projects = await Project.find().where('_id').in(req.body.projectIds).exec();

    console.log('total projects found %j, total projects given %j', projects.length, req.body.projectIds.length);

    if (projects === null || projects.length == 0
      || projects.length != req.body.projectIds.length) {
      console.log('All projects given were not found.');
      return next(ErrorsUtils.createBadRequest('All projects given were not found.'));
    }

    let projectIds = projects.map(item => {
      return item['_id'];
    });

    console.log('updating position %j, adding projects', position._id);

    position.projects = projectIds;
    let savedPosition = await Position.create(position);

    return res.status(200).json({
      "position": savedPosition
    });

  } catch (error) {
    console.error(error);
    return next(ErrorsUtils.createGenericError('internal server error'));
  }
}

async function create(req, res, next) {
  console.debug('creating position.');

  //console.debug('technologies to be create ' + technologies);

  const position = new Position({
    userAuthId: req.authId,
    name: req.body.name,
    companyName: req.body.companyName,
    description: req.body.description,
    link: req.body.link,
    mainColor: req.body.companyName
  });

  //console.debug('%j', req.body);

  //console.info('position being created %j.', position);

  const error = position.validateSync();

  if (error) {
    console.debug('Invalid position given [' + position + '].');
    console.log(error.message);
    return next(ErrorsUtils.createBadRequest(error.message));
  }

  try {

    let positionResponse = await Position.create(position);

    if (positionResponse) {

      return res.status(201).json({
        'position': positionResponse
      });
    }

  } catch (error) {
    console.log('Error creation position [' + error + '].');
    return next(ErrorsUtils.createGenericError(error.message));
  }
}

async function findById(req, res, next) {

  const positionId = req.params.id;

  console.info('controller -> Looking for the position  ' + positionId);

  try {
    let positionResponse = await Position.findById(positionId);

    if (positionResponse == null) {
      return next(ErrorsUtils.createNotFound('position not found'));
    }
    return res.status(200).json({
      'position': positionResponse
    });
  } catch (error) {
    console.log('Error searching for position [' + error + '].');
    return next(ErrorsUtils.createGenericError(error.message));
  }
}

module.exports = { create, addProjectsToPosition, findById };
