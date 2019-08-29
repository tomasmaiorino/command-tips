const Project = require('./project');

async function findById(projectId) {
  console.info('controller -> Looking for the project  ' + projectId);
  return Project.findById(projectId);
}

async function save(project) {
  console.debug('creating project');
  return Project.create(project);
}


module.exports = { findById, save };
