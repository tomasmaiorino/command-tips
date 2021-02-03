const express = require('express');
const router = express.Router();
const { findById } = require('./commandService');
const ErrorsUtils = require('./../util/errorsUtils');


//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/5c3f1f833de0b83a31915f05

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/users/

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
module.exports = router;
