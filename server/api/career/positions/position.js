const mongoose = require('mongoose');
let timestampPlugin = require('../../plugins/timestamp')

const positionSchema = mongoose.Schema({
  name: { type: String, required: [true, 'The name is required.'] },
  companyName: { type: String, required: [true, 'The company name is required.'] },
  description: { type: String, required: [true, 'The description is required.'] },
  /*user_id: {type: String, required: [true, 'The user id is required.']},*/
  active: { type: Boolean, default: true },
  link: { type: String, required: [true, 'The position link is required.'] },
  applied: { type: Boolean, default: false },
  appliedDate: { type: Date },
  mainColor: { type: String }
  /*projects: [] */
});

positionSchema.plugin(timestampPlugin);

module.exports = mongoose.model('Position', positionSchema);