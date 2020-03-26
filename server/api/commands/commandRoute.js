const express = require('express');
const router = express.Router();
const { findByTag, findById, search } = require('./commandService');
const ErrorsUtils = require('./../util/errorsUtils');


//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/5c3f1f833de0b83a31915f05

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/users/

router.get('/tags/:tagValue', async (req, res, next) => {
  const tagValue = req.params.tagValue;

  console.debug('looking for tag [%s].', tagValue);
  try {

    let commands = await findByTag(tagValue);

    if (commands && commands.length > 0) {
      return res.status(200).json({ commands });
    } else {
      return next(ErrorsUtils.createNotFound('command not found'));
    }
  } catch (error) {
    console.error(error);
    return next(ErrorsUtils.createGenericError(error.message));
  }
});

router.get('/:commandId', async (req, res, next) => {

  try {

    const commandId = req.params.commandId;
    console.info('controller -> Looking for the command  ' + commandId);
    let command = await findById(commandId);
    if (command) {
      console.log('command found ' + JSON.stringify(command))
      return res.status(200).json({
        'command': command
      });
    } else {
      return next(ErrorsUtils.createNotFound('command not found'));
    }
  } catch (error) {
    console.error('Error looking for command ' + error);
    return next(ErrorsUtils.createGenericError('internal server error'));
  }
});

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/search/kill
router.get('/search/:query', async (req, res, next) => {

  const query = req.params.query;

  try {

    let commands = await search(query);

    if (commands) {
      return res.status(200).json({
        commands
      });
    }
  } catch (error) {
    console.error(error);
    return next(ErrorsUtils.createGenericError('internal server error'));
  }
});

module.exports = router;
