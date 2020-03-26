const firebaseAdmin = require('firebase-admin');

const initialize = (serviceAccount) => {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount)
        //"credential": firebaseAdmin.credential.applicationDefault()
    });
}

const getUserInfo = (token) => {
    //console.debug('checking token ' + token);
    return firebaseAdmin.auth().verifyIdToken(token);
}

module.exports = { initialize, getUserInfo };