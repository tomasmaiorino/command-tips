const firebaseService = require('./firebaseService');

/*
const firebase = require('firebase');


firebase.initializeApp(config);
*/
async function login() {
    try {
        let user = await firebaseService.auth().signInWithEmailAndPassword('tomasmaiorino4@gmail.com', '123456');
        console.log('user %j', user);

        const token = await firebaseService.auth().currentUser.getIdToken();
        console.log('token %j', token);

    } catch (err) {
        console.log('error test ' + err);
    }
}

login();