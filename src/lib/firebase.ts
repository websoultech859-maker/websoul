// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWTnul_nRK5-aOc2OwYsW9ksRAPV07Qsw",
  authDomain: "websoul-d4cd8.firebaseapp.com",
  projectId: "websoul-d4cd8",
  storageBucket: "websoul-d4cd8.firebasestorage.app",
  messagingSenderId: "396560149655",
  appId: "1:396560149655:web:11358fb7e5e3fd61510dd2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);