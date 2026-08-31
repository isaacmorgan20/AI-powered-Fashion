// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPvgPEN8916bKwMZlz1_NR487NFijAApo",
  authDomain: "fashion-22af0.firebaseapp.com",
  projectId: "fashion-22af0",
  storageBucket: "fashion-22af0.firebasestorage.app",
  messagingSenderId: "335975986800",
  appId: "1:335975986800:web:db4520b452ead79217a6b5",
  measurementId: "G-8XD2YEZRNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth(app)
export {auth, db}