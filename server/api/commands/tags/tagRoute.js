const bcrypt = require('bcrypt');
const express = require('express')
const router = express.Router();
const Tag = require('./tag');


router.get('/', (req, res, next) => {

  Tag.find()
    .exec()
    .then(tags => {
      if (tags) {
        res.status(200).json(
          {
            tags
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

module.exports = router;
