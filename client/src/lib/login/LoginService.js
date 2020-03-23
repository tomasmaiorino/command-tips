const firebaseService = require('../util/FirebaseService');

async function login(email, password) {
    return await firebaseService.auth().signInWithEmailAndPassword(email, password);
}

async function recoverTokenId() {
    try {
        return await firebaseService.auth().currentUser.getIdToken();
    } catch (err) {
        console.log('Error recovering user token.');
    }
}

async function doesVerifyToken(idToken) {
    let checkRevoked = true;
    admin.auth().verifyIdToken(idToken, checkRevoked)
        .then(payload => {
            return true;
        })
        .catch(error => {
            if (error.code == 'auth/id-token-revoked') {
                // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
            } else {
                // Token is invalid.
            }
            return false;
        });
}
function verifyToken(user) {
    //console.log('verifying token for user', user);
    const response = {
        async() { doesVerifyToken(user.token) }
    }
    return response;
    /*
    if (user && user.loginTime) {
        let hours = Math.abs(new Date() - new Date().setTime(user.loginTime)) / 36e5;
        if (hours > 1) {
            console.log('time expired. Checking token.')
            const response = {
                async() { doesVerifyToken(user.token) }
            }
            return response;
        }
        return false;
    }
    */
}
module.exports = { login, recoverTokenId, verifyToken }