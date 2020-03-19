const express = require('express')
const router = express.Router();
const { create, updateCommand, deleteCommand } = require('../CommandController');

router.patch('/:commandId', async (req, res, next) => {
    return updateCommand(req, res, next);
});

router.post('/',
    async (req, res, next) => {
        return create(req, res, next);
    });

router.delete('/:commandId', async (req, res, next) => {
    console.log('removing command')
    return deleteCommand(req, res, next);
});

module.exports = router;
