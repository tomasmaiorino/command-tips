const mongoose = require('mongoose');
let timestampPlugin = require('../../plugins/timestamp')

const tagSchema = mongoose.Schema({
  value: { type: String, required: [true, 'The tag value is required.'], uppercase: true, unique: true },
});

tagSchema.plugin(timestampPlugin);

module.exports = mongoose.model('Tag', tagSchema);
