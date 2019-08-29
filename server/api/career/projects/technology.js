const mongoose = require('mongoose');
let timestampPlugin = require('../../plugins/timestamp')

const technologySchema = mongoose.Schema({
  name: { type: String, required: [true, 'The name is required.'] },
});

technologySchema.plugin(timestampPlugin);

module.exports = mongoose.model('Technology', technologySchema);
