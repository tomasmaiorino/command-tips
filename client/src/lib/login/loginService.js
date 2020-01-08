const firebaseService = require('./../util/services/firebaseService');

async function login(email, password) {
    return await firebaseService.auth().signInWithEmailAndPassword(email, password);
}

async function recoverTokenId() {
    try {
        return await firebaseService.auth().currentUser.getIdToken();
    } catch(err) {
        console.log('Error recovering user token.');
    }
}

module.exports = {login, recoverTokenId}