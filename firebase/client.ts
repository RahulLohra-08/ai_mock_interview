// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5c5dDWuqP7fYFUVTm0Zjpji_Jqe7OZDQ",
  authDomain: "prepwise-3b491.firebaseapp.com",
  projectId: "prepwise-3b491",
  storageBucket: "prepwise-3b491.firebasestorage.app",
  messagingSenderId: "1097271630662",
  appId: "1:1097271630662:web:4271ec6aa08bad8f73a347",
  measurementId: "G-X19EJ53S3Q"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);