// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import firebase from "firebase/app"
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

//realtime database import
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDB-yF6L-RDGL7rhZrORZZLMk0CK8WZR9c",

  authDomain: "insta-react-1ec83.firebaseapp.com",

  projectId: "insta-react-1ec83",

  storageBucket: "insta-react-1ec83.appspot.com",

  messagingSenderId: "761466698559",

  appId: "1:761466698559:web:55103bdca9351c2da2318a",
  databaseURL: "https://insta-react-1ec83-default-rtdb.firebaseio.com/",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage(app);
export const realtimeDatabase = getDatabase(app);
