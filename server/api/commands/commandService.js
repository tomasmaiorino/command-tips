const Command = require('./command');
const Tag = require('./../tags/tag');

const findById = async (commandId) => {
  return Command.findById(commandId);
}

async function search(query) {

  return Command.find({
    $or: [
      { "full_description": { $regex: query, $options: 'i' } },
      { "title": { $regex: query, $options: 'i' } },
      { "command": { $regex: query, $options: 'i' } }]
  });

}

async function updateCommand(context) {

  let command = context.commandFound;

  command = configureCommandToUpdate(command, context.attribute, context.increment, context.value);

  //console.debug('updating command ' + command);

  return command.save();
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

async function findByTag(tagValue) {
  return Command.find({ "tags": { $regex: tagValue, $options: 'i' } });
}

async function createCommand(command) {
  //console.debug('creating command');

  if (command.tags) {
    processingTags(command.tags);
  }

  return Command.create(command);
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

const deleteCommand = async (commandId) => {
  return Command.findOneAndDelete(commandId);
}

module.exports = { updateCommand, findById, findByTag, search, createCommand, deleteCommand };
