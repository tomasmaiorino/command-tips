const express = require('express')
const router = express.Router();
const Position = require('./position');
const PositionController = require('./positionController');


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
