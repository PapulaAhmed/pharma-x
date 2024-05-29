// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const auth = getAuth();

export default app;