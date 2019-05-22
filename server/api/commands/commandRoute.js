const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser')
const User = require('../users/user');
const Command = require('./command');
const TagService = require('../tags/tagService')
const Tag = require('../tags/tag');
const CommandController = require('./commandController');

router.get('/', (req, res, next) => {
    res.status(200).json({
        "message": "command tip"
    });
});


//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/5c3f1f833de0b83a31915f05

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/users/

router.get('/tags/:tagValue', (req, res, next) => {

    const tagValue = req.params.tagValue;

    CommandController.findByTag(tagValue)
        .then(commands => {
            if (commands) {
                res.status(200).json(
                    {
                        commands
                    }
                );
            } else {
                res.status(404);
            }
        })
        .catch(error => {
            res.status(500).json({
                'error': error
            })
        });
});


router.get('/:commandId', (req, res, next) => {

    const commandId = req.params.commandId;

    console.debug('Looking for the command ' + commandId + '.');

    CommandController.findById(commandId)
        .then(command => {
            if (command) {
                res.status(200).json(
                    {
                        'command': command
                    }
                );
            } else {
                res.status(404).json({});
            }
        })
        .catch(error => {
          console.error('Error looking fot command ' + error);
            res.status(500).json({
                'error': error
            })
        });
});

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/search/kill
router.get('/search/:query', (req, res, next) => {

    const query = req.params.query;

    console.debug('Looking for the command with the query [' + query + '].');

    CommandController.search(query)
    .then(commands => {
        if (commands) {
            res.status(200).json(
                {
                    commands
                }
            );
        }
    })
    .catch(error => {
        res.status(500).json({
            'error': error
        });
    });
});

router.patch('/:commandId', (req, res, next) => {

    const commandId = req.params.commandId;
    const attribute = req.body.attribute;
    const increment = req.body.increment;
    const value = req.body.value;

    Command.findById(commandId, (err, command) => {
        if (err) {
            res.status(500).json({
                error: err
            });

        } else if (command) {

            if (command[attribute] == undefined || attribute === 'id' || attribute === '_id') {
                // do something
                res.status(400).json({
                    'message': 'Invalid attribute [' + attribute + '].'
                });
            } else {
                console.debug('attribute to update ' + attribute);
                console.debug('increment ' + increment);
                console.debug('value ' + value);

                if (increment === true) {

                    console.debug('incremmenting attribute ' + command[attribute]);
                    command[attribute] = command[attribute] + 1;

                } else {
                    command[attribute] = value;
                }
                console.debug('updating command ' + command);
                command.save()
                    .then(updatedCommand => {
                        res.status(200).json({
                            'command': updatedCommand
                        });
                    })
                    .catch(error => {
                        res.status(500).json({
                            'error': error
                        });
                    });
            }
        } else {
            res.status(404).json({
                'message': 'Command not found'
            });
        }
    });
});

router.get('/:id', (req, res, next) => {

    const commandId = req.params.id;

    res.status(200).json({
        "message": "command tip",
        "id": commandId
    });

});

doValidateRequest = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        res.status(400).json({
            'message': 'Invalid user id.'
        });
    } else {
       next();
    }
}

checkValidUser = (req, res, next) => {
    User.findOne({ _id: req.body.userId })
    .then(user => {
        if(!user) {
            res.status(400).json({
                'message': 'User not found.'
            });
        } else {
            next();
        }
    })
    .catch(error => {
        res.status(500).json({
            'error': error
        });
    });
}

router.post('/',(req, res, next) => {
        doValidateRequest(req, res, next);
    }, (req, res, next) => {
       checkValidUser(req, res, next);
    }, (req, res) => {

      console.debug('creating command');

        const description = req.body.description == null || undefined ? req.body.title : req.body.description;
        const command = new Command({
            title: req.body.title,
            command: req.body.command,
            full_description: description,
            helpfull_links: req.body.links,
            user_id: req.body.userId,
            tags: req.body.tags
        });

        const error = command.validateSync();

        if (error) {
            console.log('Invalid command given [' + command + '].');
            return res.status(400).json({
                'errors': error.errors
            });
        }

        if (command.tags) {
            processingTags(command.tags);
        }

        command.save()
            .then(saved => {
                return res.status(201).json({
                    'command': command
                });
            })
            .catch(error => {
                console.log('Error creation command [' + error + '].');
                res.status(500).json({
                    'error': error
                });
            });
    });

processingTags = (paramTags) => {
    Tag.find()
    .exec()
    .then(tags => {
        if (tags) {
            console.debug(' tags ' + tags.length);
            let tagsInformed = paramTags.split(" ");
            tags.map(t1 => {
                if (tagsInformed.length > 0) {
                    console.debug('tag found value ' + t1.value);
                    const tagIndex = tagsInformed.indexOf(t1.value.toUpperCase());
                    console.debug('index found ' + tagIndex);
                    if (tagIndex !== -1) {
                        console.debug('removing tag: ' + t1);
                        tagsInformed.splice(tagIndex, 1);
                    }
                }
            });
            if (tagsInformed.length > 0) {
                console.debug('tagInformed length ' + tagsInformed.length);
                tagsInformed.map(t2 => {
                    console.debug('tag being created: ' + t2);
                    new Tag({ value: t2 }).save();
                });
            }
        }
    })
    .catch(error => {
        console.log('Error trying to create a tag [' + error + '].');
    });
}

module.exports = router;
