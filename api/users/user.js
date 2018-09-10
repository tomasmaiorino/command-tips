var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var user = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username:  String,
    email: String,
    password:   String,
    createdDate: { type: Date, default: Date.now },
    comments: [{ body: String, date: Date }],
    lastUpdate: { type: Date, default: Date.now },
    active: {type: Boolean, default: true},
    meta: {
      commentsCounter: {type: Number, default: 0},
      commandsCounter:  {type: Number, default: 0}
    }
  });