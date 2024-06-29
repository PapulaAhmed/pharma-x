// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1iSrsPpx_xVXnSZUMpwLHTtkK-WU1PpU",
  authDomain: "pharmax-uniq.firebaseapp.com",
  databaseURL: "https://pharmax-uniq-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pharmax-uniq",
  storageBucket: "pharmax-uniq.appspot.com",
  messagingSenderId: "976307445771",
  appId: "1:976307445771:web:dc00905dbf3d4fcf9fa70e",
  measurementId: "G-0CS9Y9HXB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
export default app;
