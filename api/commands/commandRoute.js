var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser')

router.get('/', (req, res, next) => {
    res.status(200).json({
        "message":"command tip"
    });
 });

 router.post('/', (req, res, next) => {
    console.log('console log ' + req.body.name);
    res.status(200).json({
        name: req.body.name
    });
 });

 router.get('/:id', (req, res, next) => {    

    const commandId = req.params.id;

    res.status(200).json({
        "message":"command tip",
        "id": commandId
    });

 });

module.exports = router;