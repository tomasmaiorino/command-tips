const mongoose = require('mongoose');
let timestampPlugin = require('../plugins/timestamp')

const userSchema = mongoose.Schema({
  username: { type: String, required: [true, 'The username is required.'] },
  email: { type: String, unique: true, required: [true, 'The email is required.'] },
  password: { type: String, required: [true, 'The password is required.'] },
  comments: [{ body: String, date: Date }],
  active: { type: Boolean, default: true },
  meta: {
    commentsCounter: { type: Number, default: 0 },
    commandsCounter: { type: Number, default: 0 }
  }
});

userSchema.plugin(timestampPlugin);

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

module.exports = mongoose.model('User', userSchema);