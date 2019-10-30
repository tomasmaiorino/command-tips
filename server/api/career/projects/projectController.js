const mongoose = require('mongoose');
const Project = require('./project');

async function findById(projectId) {
  console.info('controller -> Looking for the project  ' + projectId);
  return Project.findById(projectId);
}

async function save(project) {
  console.debug('creating project');
  return Project.create(project);
}

async function findAllByIds(ids) {
  console.log('searching projects by ids ' + ids[0]);
  return Project.findById(ids[0]);
  //return Project.find();
  //let arr = ids.map(item => new mongoose.Types.ObjectId(item));
  //return Project.find().where('_id').in(ids).exec();
}


module.exports = { findById, save, findAllByIds };
