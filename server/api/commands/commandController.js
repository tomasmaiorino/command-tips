const Command = require('./command');
const ErrorsUtils = require('../util/errorsUtils')
const Tag = require('./tags/tag');

async function findById(req, res, next) {
  
  try {
    const commandId = req.params.commandId;
    console.info('controller -> Looking for the command  ' + commandId);
    let command = await Command.findById(commandId);
    if (command) {
      return res.status(200).json(
        {
          'command': command
        }
      );
    } else {
      return next(ErrorsUtils.createNotFound('command not found'));
    }
  } catch (error) {
    console.error('Error looking for command ' + error);
    return next(ErrorsUtils.createGenericError('internal server error'));
  }
}

async function search(req, res, next) {

  const query = req.params.query;

  try {

    let commands = await Command.find({
      $or: [
          { "full_description": { $regex: query, $options: 'i' } },
          { "title": { $regex: query, $options: 'i' } },
          { "command": { $regex: query, $options: 'i' } }]
      });

    if (commands) {
      return res.status(200).json(
        {
          commands
        }
      );
    }
  } catch (error) {
    console.error(error);
    return next(ErrorsUtils.createGenericError('internal server error'));
  }
}

async function updateCommand(req, res, next) {
  const commandId = req.params.commandId;
  const attribute = req.body.attribute;
  const increment = req.body.increment;
  const value = req.body.value;

  //console.debug('Params received %j', req.params);
  //console.debug('Body received %j', req.body);

  try {

    let command = await Command.findById(commandId);

    if (command) {

      if (command[attribute] == undefined || attribute === 'id' || attribute === '_id') {
        // do something
        return res.status(400).json({
          'message': 'Invalid attribute [' + attribute + '].'
        });
      } else {

        command = configureCommandToUpdate(command, attribute, increment, value);

        //console.debug('updating command ' + command);

        command.save()
          .then(updatedCommand => {
            return res.status(200).json({
              'command': updatedCommand
            });
          })
          .catch(error => {
            return next(ErrorsUtils.createGenericError(error.message));
          });
      }
    } else {
      //console.log('Command %j not found.', commandId);
      return next(ErrorsUtils.createNotFound('command not found'));
    }
  } catch (error) {
    console.error(error);
  }
}

function configureCommandToUpdate(command, attribute, increment, value) {
  // console.debug('attribute to update ' + attribute);
  // console.debug('increment ' + increment);
  // console.debug('value ' + value);

  if (increment == true) {

    console.debug('incremmenting attribute ' + command[attribute]);
    command[attribute] = command[attribute] + 1;

  } else {
    command[attribute] = value;
  }
  return command;
}

async function findByTag(req, res, next) {
  const tagValue = req.params.tagValue;

  console.debug('looking for tag ' + tagValue);
  try {

    let commands = await Command.find({ "tags": { $regex: tagValue, $options: 'i' } });

    if (commands && commands.length > 0) {
      return res.status(200).json(
        {
          commands
        }
      );
    } else {
      return next(ErrorsUtils.createNotFound('command not found'));
    }
  } catch (error) {
    console.error(error);
    return next(ErrorsUtils.createGenericError(error.message));
  }
}

async function create(req, res, next) {
//console.debug('creating command');

  const description = req.body.description == null || undefined ? req.body.title : req.body.description;

  const command = new Command({
    userAuthId: req.authId,
    title: req.body.title,
    command: req.body.command,
    full_description: description,
    helpfull_links: req.body.links,
    //user_id: req.body.userId,
    tags: req.body.tags
  });

  const error = command.validateSync();

  if (error) {
    console.log('Invalid command given [' + command + '].');
    console.log(error.message);
    return next(ErrorsUtils.createBadRequest(error.message));
  }

  if (command.tags) {
    processingTags(command.tags);
  }

  try {

    let commandResponse = await Command.create(command);

    if (commandResponse) {
      return res.status(201).json({
        'command': commandResponse
      });
    }

  } catch (error) {
    console.log('Error creation command [' + error + '].');
    return next(ErrorsUtils.createGenericError(error.message));
  }
}


processingTags = (paramTags) => {
  Tag.find()
    .exec()
    .then(tags => {
      if (tags) {
        //console.debug(' tags ' + tags.length);
        let tagsInformed = paramTags.split(" ");
        tags.map(t1 => {
          if (tagsInformed.length > 0) {
            //console.debug('tag found value ' + t1.value);
            const tagIndex = tagsInformed.indexOf(t1.value.toUpperCase());
            //console.debug('index found ' + tagIndex);
            if (tagIndex !== -1) {
              //console.debug('removing tag: ' + t1);
              tagsInformed.splice(tagIndex, 1);
            }
          }
        });
        if (tagsInformed.length > 0) {
          //console.debug('tagInformed length ' + tagsInformed.length);
          tagsInformed.map(t2 => {
//            console.debug('tag being created: ' + t2);
            new Tag({ value: t2 }).save();
          });
        }
      }
    })
    .catch(error => {
      console.log('Error trying to create a tag [' + error + '].');
    });
}


module.exports = {updateCommand, findById, findByTag, search, create };
