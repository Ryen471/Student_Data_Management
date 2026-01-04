import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Login successful!", userCredential.user);
            alert("Login Successful!");
            window.location.href = "home.html";
        })
        .catch((error) => {
            console.error(error.code, error.message);
            alert("Login failed: " + error.message);
        });
});