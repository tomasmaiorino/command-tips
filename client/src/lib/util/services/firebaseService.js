
const firebase = require('firebase');

const config = {
    apiKey: "AIzaSyB31On5_sGKC7zbWDgwqOalKmW5v70-Vtg",
    authDomain: "command-2c7bb.firebaseapp.com",
    databaseURL: "https://command-2c7bb.firebaseio.com",
    projectId: "command-2c7bb",
    storageBucket: "command-2c7bb.appspot.com",
    messagingSenderId: "966215055409",
    appId: "1:966215055409:web:f901c67cf0c5144a"
}

firebase.initializeApp(config);

module.exports = firebase;