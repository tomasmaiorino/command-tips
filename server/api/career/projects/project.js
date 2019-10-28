const mongoose = require('mongoose');
let timestampPlugin = require('../../plugins/timestamp')

const projectSchema = mongoose.Schema({
  name: { type: String, required: [true, 'The name is required.'] },
  techs: { type: Array, required: [true, 'The techs are required.'] },
  roles: { type: Array},
  description: { type: String, required: [true, 'The description is required.'] },
  achievements: { type: Array },
  /*user_id: {type: String, required: [true, 'The user id is required.']},*/
  active: { type: Boolean, default: true },  
  companyName: { type: String, required: [true, 'The company name is required.'] },
  projectTimeline: { type: String, required: [true, 'The project timeline is required.'] }
});

projectSchema.plugin(timestampPlugin);

projectSchema.methods.toJSON = function() {
  var obj = this.toObject();
  //delete obj.password;
  return obj;
}

module.exports = mongoose.model('Project', projectSchema);
