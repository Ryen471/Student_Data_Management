import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmIBuR8ZM4uRsc1C9mtYo0MTwY76HM2dk",
  authDomain: "student-data-management-d6fd0.firebaseapp.com",
  projectId: "student-data-management-d6fd0",
  storageBucket: "student-data-management-d6fd0.firebasestorage.app",
  messagingSenderId: "765325009664",
  appId: "1:765325009664:web:66923e9a89be59043449e5",
  measurementId: "G-KD0744GM41"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);