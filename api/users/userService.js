var mongoose = require('mongoose');
var userSchema = require('./user');

   
    function createUser(user) {    
        const User = mongoose.model('user', userSchema);
        let userModel = new User(user);
        userModel.save()
         .then( (doc) => {
          return doc;
        })
        .error((error) => {
            console.log('has error ' + error);            
        })
    }

module.exports = {createUser};