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

function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        User.find({email: email})
        .then(user => {
            console.log('user service ' + user);
            resolve(user);
        })
        .catch(error => {
            console.log('user service error ' + error);
            reject(error);
        });
    });
}
module.exports = {createUser, findUserByEmail};