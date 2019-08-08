const mongoose = require('mongoose');
const Tag = require('./tag');

async function save(tag) {
    return Tag.create(tag);
}

async function findAllTags() {
  return Tag.find();
}

module.exports = { save, findAllTags };
