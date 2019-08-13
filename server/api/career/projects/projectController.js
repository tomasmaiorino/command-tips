const Project = require('./project');

async function findById(projectId) {
  console.debug('controller -> Looking for the project  ' + projectId);
  return Project.findById(commandId);
}

async function save(project) {
  console.debug('creating project');
  return Project.create(project);
}


module.exports = { findById, save };
