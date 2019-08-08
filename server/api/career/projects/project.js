const mongoose = require('mongoose');
let timestampPlugin = require('../plugins/timestamp')

const projectSchema = mongoose.Schema({
  name: { type: String, required: [true, 'The name is required.'] },
  techs: { type: String, required: [true, 'The techs are required.'] },
  role: { type: String},
  description: { type: String, required: [true, 'The description is required.'] },
  achievements: { type: String },
  /*user_id: {type: String, required: [true, 'The user id is required.']},*/
  active: { type: Boolean, default: true }
});

projectSchema.plugin(timestampPlugin);

projectSchema.methods.toJSON = function() {
  var obj = this.toObject();
  //delete obj.password;
  return obj;
}

module.exports = mongoose.model('Project', projectSchema);

//id
//title
//tags
//command
//full description
//helpfull links
//user
//helpfull (counter)
//unhelpfull (counter)
//it does works (counter)
//it doesnt work (counter)
//maybe wrong
//comments count
//create date
//last update
