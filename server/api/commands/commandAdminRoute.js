const express = require('express')
const router = express.Router();
const errorsUtils = require('./../util/errorsUtils');
const Command = require('./command');
const { createCommand, updateCommand, deleteCommand, findById } = require('./commandService');
const keyWord = 'rmvprod';
router.patch('/:commandId', async (req, res, next) => {

    let context = {
        commandId: req.params.commandId,
        attribute: req.body.attribute,
        increment: req.body.increment,
        value: req.body.value
    }

    let commandFound = await findById(context.commandId);

    if (!commandFound) {
        return next(errorsUtils.createNotFound('command not found'));
    }

    if (commandFound[context.attribute] == undefined || context.attribute === 'id' || context.attribute === '_id') {
        // do something
        return res.status(400).json({
            'message': 'Invalid attribute [' + context.attribute + '].'
        });
    }

    context.commandFound = commandFound;

    try {

        let updatedCommand = await updateCommand(context);

        if (updatedCommand) {
            return res.status(200).json({
                'command': updatedCommand
            });
        } else {
            return next(errorsUtils.createGenericError(error.message));
        }

    } catch (error) {
        console.log('error ', error);
        return next(errorsUtils.createGenericError(error.message));
    };
});


router.post('/', async (req, res, next) => {

    const description = req.body.description == null || undefined ? req.body.title : req.body.description;

    const command = new Command({
        userAuthId: req.authId,
        title: req.body.title,
        command: req.body.command,
        full_description: description,
        helpfull_links: req.body.links,
        tags: req.body.tags
    });

    const error = command.validateSync();

    if (error) {
        console.log('Invalid command given [' + command + '].');
        console.log(error.message);
        return next(errorsUtils.createBadRequest(error.message));
    }

    try {

        let commandResponse = await createCommand(command);

        if (commandResponse) {

            await integrationTestProduction(commandResponse);

            return res.status(201).json({
                'command': commandResponse
            });
        }

    } catch (error) {
        console.log('Error creation command [' + error + '].');
        return next(errorsUtils.createGenericError(error.message));
    }
});

router.delete('/:commandId', async (req, res, next) => {

    console.log('removing command')

    try {

        const commandId = req.params.commandId;
        console.debug('controller -> Looking for command to delete [%s].', commandId);

        let command = await deleteCommand(commandId);

        if (command) {

            return res.status(204).json({});

        } else {
            return next(errorsUtils.createNotFound('command not found'));
        }
    } catch (error) {
        console.error('Error removing for command ' + error);
        return next(errorsUtils.createGenericError('internal server error'));
    }
});

async function integrationTestProduction(commandResponse) {

    let environment = process.env.NODE_ENV || 'dev';

    if (environment === 'prod') {

        if (commandResponse.title.includes(keyWord)) {
            let commandToRemove = await deleteCommand(commandResponse._id);
            if (commandToRemove) {
                console.log('command removed!');
            }
        }
    }
}

module.exports = router;
