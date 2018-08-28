var express = require('express')
var router = express.Router();

router.get('/', function (req, res) {
    res.status(200).json({
        "message":"command tip"
    });
 });

 router.get('/:id', function (req, res) {
    
    const commandId = req.params.id;

    res.status(200).json({
        "message":"command tip",
        "id": commandId
    });

 });

module.exports = router;