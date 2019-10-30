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
  console.log('searching projects by id %j', ids);
  return await Project.find().where('_id').in(ids).exec();
}


module.exports = { findById, save, findAllByIds };
