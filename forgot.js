import { auth } from "./firebase.js";
import { sendPasswordResetEmail } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const btn = document.getElementById("button");

btn.addEventListener("click", () => {
  const email = document.querySelector('input[name="Email"]').value;

  if (email === "") {
    alert("Please enter email");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset link sent to your email");
      window.location.href = "project.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});