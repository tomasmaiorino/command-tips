const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser')
const User = require('../users/user');
const Command = require('./command');

router.get('/', (req, res, next) => {
    res.status(200).json({
        "message":"command tip"
    });
 });


//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/5c3f1f833de0b83a31915f05

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/users/


 router.get('/:commandId', (req, res, next) => {
    
    const commandId = req.params.commandId;
    
    console.log('Looking for the command ' + commandId + '.');

    Command.findById(commandId)
        .exec()
        .then(command => {
            if (command) {
                res.status(200).json(
                    {
                    'command': command
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

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X GET http://localhost:3000/tips/search/kill
router.get('/search/:query', (req, res, next) => {

    const query = req.params.query;
    
    console.log('Looking for the command with the query [' + query + '].');

    Command.find({ $or: [
                    {"full_description" : { $regex: query, $options: 'i'}}, 
                    {"title" : { $regex: query, $options: 'i'}}, 
                    {"command" : { $regex: query, $options: 'i'}}]
    })
    .exec((err, commands) => {
        if (commands) {
            //console.log('commands ' + commands);
            res.status(200).json(
                {
                    commands
                }
            );
        } else {
            res.status(404);
        }
    });
});

//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X POST http://localhost:3000/tips -d {\"title\": \"FIND A TASK BY PID\",\"command\": \"tasklist -fi \"pid eq 2856\"\",\"description\": \"Find a task by id\",\"links\": \"\",\"userId\": \"5c3f1d1b1fe49b35a0c7a968\"}
//curl -i -H "Content-Type:application/json" -H "Accept:application/json" -X POST http://localhost:3000/tips -d "{\"title\": \"KILLING A TASK USING A FIND RESULT\",\"command\": \"taskkill /F /FI 'PID eq 2856'\",\"description\": \"Kill a task through a find result.\",\"links\": \"\",\"userId\": \"5c3f1d1b1fe49b35a0c7a968\"}"

 router.post('/', (req, res, next) => {

    console.log('looking for user ' + req.body.userId);

    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        res.status(400).json({
            'message': 'Invalid user id.'
        });
    } else {
        User.findOne({_id: req.body.userId})
        .then(user => {        
            if (!user) {
                res.status(400).json({
                    'message': 'User not found.'
                });
            } else {

                const command = new Command({
                    title: req.body.title,                
                    command: req.body.command,
                    full_description: req.body.description,
                    helpfull_links: req.body.links,
                    user_id: req.body.userId,
                    tags: req.body.tags
                });

                const error = command.validateSync();
                if (error) {
                    console.log('Invalid command given ' + command + ' .');
                    return res.status(400).json({
                        'errors': error.errors
                    });
                }
        
                command.save()
                    .then(saved => {
                        return res.status(201).json({
                            'command': command
                        });
                    })
                    .catch(error => {
                        res.status(500).json({
                            'error': error
                        })
                    });
                }
        })
        .catch(error => {
            res.status(500).json({
                'error': error
            })
        });
    }
 });

 router.get('/:id', (req, res, next) => {    

    const commandId = req.params.id;

    res.status(200).json({
        "message":"command tip",
        "id": commandId
    });

 });

module.exports = router;