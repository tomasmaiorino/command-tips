const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
//    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: [true, 'The username is required.']},
    email: {type: String, required: [true, 'The email is required.']},
    password: {type: String, required: [true, 'The password is required.']},
    createdDate: { type: Date, default: Date.now },
    comments: [{ body: String, date: Date }],
    lastUpdate: { type: Date, default: Date.now },
    active: {type: Boolean, default: true},
    meta: {
      commentsCounter: {type: Number, default: 0},
      commandsCounter:  {type: Number, default: 0}
    }
  });

  module.exports = mongoose.model('User', userSchema);