const firebase = require('firebase');
//process.env.FIREBASE_APIKEY
const config = {
    apiKey: "",
    authDomain: "command-2c7bb.firebaseapp.com",
    databaseURL: "https://command-2c7bb.firebaseio.com",
    projectId: "command-2c7bb",
    storageBucket: "command-2c7bb.appspot.com",
    messagingSenderId: "",
    appId: ""
}

firebase.initializeApp(config);

module.exports = firebase;
