import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("signupform");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Capture values from the 'name' attributes in your HTML
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.Confirmpassword.value;

    // DEBUG: This will show in your console so you can see if the data is empty
    console.log("Attempting signup with:", email, password);

    if (password.length < 6) {
        alert("Firebase requires passwords to be at least 6 characters!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Success!", userCredential.user);
            alert("Signup successful!");
            window.location.href = "login.html"; 
        })
        .catch((error) => {
            // This prints the EXACT reason for the 400 error in the console
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);
            alert("Firebase Error: " + error.message);
        });
});