// firebaseConfig.js
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyChdTcetDfZM-4ukcQhaRkJmiDcY-8pYTI",
  authDomain: "fpcanew.firebaseapp.com",
  projectId: "fpcanew",
  storageBucket: "gs://fpcanew.appspot.com",
  messagingSenderId: "132020592028",
  appId: "1:132020592028:android:25692fb5d9209235dbfc59",
  databaseURL: 'https://fpcanew-default-rtdb.firebaseio.com',
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, db, storage, database };
