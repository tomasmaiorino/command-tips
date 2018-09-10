const express = require('express')
const router = express.Router();
const bodyParser = require('body-parser');
const UserService = require('./userService');


router.get('/', (req, res, next) => {
    res.status(200).json({
        "message":"command tip"
    });
 });

 router.post('/', (req, res, next) => {

    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password        
    }

    console.log('user ');
    console.log(user);

    UserService.createUser(user)
    .then( (doc) => {
        console.log('doc saved');
        res.status(200).json({
           user: doc
        });
    })
    .error((error) => {
        console.log('has error ' + error);
    })
 });

 module.exports = router;