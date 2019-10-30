const express = require('express')
const router = express.Router();
const Position = require('./position');
const PositionController = require('./positionController');
const ProjectController =  require('./../projects/projectController');


router.post('/:id', async (req, res, next) => {

  try {

    const positionId = req.params.id;
    console.info('finding position by id %j.', positionId);

    let position = await PositionController.findById(positionId);

    //console.debug('project found %j.', project);

    if (position == null) {
      console.log('position %j not found.', positionId);
      return res.status(404).json({});
    }

    if (req.body.projectIds === null) {
      return res.status(400).json({
        'error': 'The project ids must be informed.'
      });
    }

    let projects = ProjectController.findAllByIds(req.body.projectIds);

    console.log('projects found %j', projects.length);

    if (projects === null || projects.length == 0 
      || projects.length != req.body.length) {
      return res.status(400).json({
        'error': 'All projects given were not found.'
      });
    }

    let projectIds = projects.map( item => {
      return item['_id'];
    });

    console.log('updating position %j, adding projects', position._id);
   
    position.projects = projectIds;
    let savedPosition = ProjectController.save(position);

    return res.status(200).json({
      "position": savedPosition
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      'error': error
    });
  }
});

router.post('/', async (req, res, next) => {

  console.debug('creating position.');

  //console.debug('technologies to be create ' + technologies);

  const position = new Position({
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
    console.log(error);
    return res.status(400).json({
      'errors': error.errors
    });
  }

  try {

    let positionResponse = await PositionController.save(position);

    if (positionResponse) {

      return res.status(201).json({
        'position': positionResponse
      });
    }

  } catch (error) {
    console.log('Error creation position [' + error + '].');
    res.status(500).json({
      'error': error
    });
  }
});

module.exports = router;
