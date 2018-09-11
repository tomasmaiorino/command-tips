const User = require('./user');
   
function createUser(user) {
    console.log('creating user ' + user);

    const userModel = new User({user});
    console.log('user model ' + userModel);

    userModel
        .save()
        .then( doc => {
            console.log('doc found ' + doc);
            return doc;
        })
        .catch( error => {
            console.log('has error ' + error);            
        });
}

module.exports = {createUser};