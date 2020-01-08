const mongoose = require('mongoose');
let timestampPlugin = require('../plugins/timestamp')

const commandSchema = mongoose.Schema({
  title: { type: String, required: [true, 'The title is required.'] },
  tags: { type: String },
  command: { type: String, required: [true, 'The command is required.'] },
  full_description: { type: String },
  helpfull_links: { type: String },
  userAuthId: { type: String, required: [true, 'The auth id is required.'] },
  helpfull: { type: Number, default: 0 },
  unhelpfull: { type: Number, default: 0 },
  works: { type: Number, default: 0 },
  doesnt_work: { type: Number, default: 0 },
  comments_counts: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
});

commandSchema.plugin(timestampPlugin);

commandSchema.methods.toJSON = function () {
  var obj = this.toObject();
  //delete obj.password;
  return obj;
}

module.exports = mongoose.model('Command', commandSchema);

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
