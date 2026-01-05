import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("RememberMe").checked;

    const persistence = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;

    setPersistence(auth, persistence)
        .then(() => {
            return signInWithEmailAndPassword(auth, email, password);
        })
        .then(() => {
            alert("Admin login successful");
            window.location.href = "admin-dash.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});