import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


window.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("studentEmail");
    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("RememberMe").checked = true;
    }
});


document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("RememberMe").checked;

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        if (rememberMe) {
            localStorage.setItem("studentEmail", email);
        } else {
            localStorage.removeItem("studentEmail");
        }


        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (role === "student") {

                window.location.href = "studenthome.html";
            } else {
                alert("This account is not a student!");
            }
        } else {
            alert("No role found for this user in Firestore!");
        }
    } catch (error) {
        alert("Login failed: " + error.message);
    }
});