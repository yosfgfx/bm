(node:80476) ExperimentalWarning: CommonJS module /Users/yosfgfx/.nvm/versions/node/v23.2.0/lib/node_modules/npm/node_modules/debug/src/node.js is loading ES Module /Users/yosfgfx/.nvm/versions/node/v23.2.0/lib/node_modules/npm/node_modules/supports-color/index.js using require().
Support for loading ES Module in require() is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

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
