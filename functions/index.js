const functions = require('firebase-functions');
const app = require('./app.js'); // Adjust the path as necessary

exports.api = functions.https.onRequest(app);
