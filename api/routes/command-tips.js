var express = require('express')
var router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        "message":"command tip"
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