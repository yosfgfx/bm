import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// go to live share extention the click on my name then follow me

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDleVfi3Z9BO5Apxe8_TOzG4FkiQ2giBn8",
  authDomain: "yosfgfx-meetroom.firebaseapp.com",
  databaseURL: "https://yosfgfx-meetroom-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yosfgfx-meetroom",
  storageBucket: "yosfgfx-meetroom.firebasestorage.app",
  messagingSenderId: "605591505888",
  appId: "1:605591505888:web:74a259ca22cd2ce3aeb985",
  measurementId: "G-ZK83SMYP9M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
export { app, analytics, database };
