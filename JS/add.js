import { db, firebaseConfig, storage } from "./firebase.js";
import { collection, addDoc, doc, updateDoc, getDocs, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Auth Setup
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

const form = document.getElementById("studentForm");
const achievementBox = document.getElementById("AcheivementsSection");
const photoInput = document.getElementById("photo-id");

// 1. ACHIEVEMENT HIDE LOGIC (Page load hote hi)
const editData = localStorage.getItem("editStudent");
if (!editData && achievementBox) {
    achievementBox.style.display = "none";
} else if (editData && achievementBox) {
    achievementBox.style.display = "block";
}

// 2. NAVIGATION (Next buttons)
document.querySelector(".next").addEventListener("click", () => {
    document.querySelector(".personal-info").style.display = "none";
    document.querySelector(".Address").style.display = "block";
});
document.querySelector(".next-page").addEventListener("click", () => {
    document.querySelector(".Address").style.display = "none";
    document.querySelector(".Academic-details").style.display = "block";
});

// 3. SUBMIT LOGIC (Tera original flow)
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // VALIDATION
    const email = document.getElementById("std-email-id").value;
    const mobile = document.getElementById("mobile-id").value;
    if (!email || !mobile) { alert("Email/Mobile missing!"); return; }

    try {
        let photoURL = "";
        // Photo Upload
        if (photoInput.files[0]) {
            const file = photoInput.files[0];
            const sRef = ref(storage, `students/${email}`);
            const snap = await uploadBytes(sRef, file);
            photoURL = await getDownloadURL(snap.ref);
        }

        const studentData = {
            name: document.getElementById("std-name").value,
            email: email,
            mobile: mobile,
            photo: photoURL,
            // ... baaki sari fields tere original style mein ...
            role: "student"
        };

        if (localStorage.getItem("editStudent")) {
            // Update logic
            await updateDoc(doc(db, "students", JSON.parse(editData).docId), studentData);
            alert("Updated!");
        } else {
            // Add logic + AUTH LOGIN creation
            const userCred = await createUserWithEmailAndPassword(secondaryAuth, email, mobile);
            studentData.uid = userCred.user.uid;
            await addDoc(collection(db, "students"), studentData);
            await signOut(secondaryAuth);

            alert("Added Successfully!");
            // ADD HONE KE BAAD DIKHAO
            if (achievementBox) achievementBox.style.display = "block";
        }
    } catch (err) {
        alert(err.message);
    }
});