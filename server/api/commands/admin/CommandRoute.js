const express = require('express')
const router = express.Router();
const { create, updateCommand } = require('../CommandController');

router.patch('/:commandId', async (req, res, next) => {
    return updateCommand(req, res, next);
});

router.post('/',
    async (req, res, next) => {
        return create(req, res, next);
    });

module.exports = router;
