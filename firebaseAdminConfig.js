import admin from 'firebase-admin';
import serviceAccount from './path-to-your-firebase-adminsdk-json'; // Replace with the path to your Firebase Admin SDK JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://servify-clicks-default-rtdb.asia-southeast1.firebasedatabase.app' // Your Firebase database URL
});

const db = admin.database();

module.exports = db;
