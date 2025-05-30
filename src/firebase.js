// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgdjMrncpzdEt7TB2bKOEPy4hdJJ18aQU",
  authDomain: "edtalk-71675.firebaseapp.com",
  projectId: "edtalk-71675",
  storageBucket: "edtalk-71675.firebasestorage.app",
  messagingSenderId: "758573163261",
  appId: "1:758573163261:web:67fefd31c40ed79ab35494"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
