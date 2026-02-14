import { db, firebaseConfig } from "./firebase.js";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    getDocs,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Secondary App Initialize (For Login Creation)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

async function addActivity(text) {
    await addDoc(collection(db, "activities"), {
        text,
        time: serverTimestamp()
    });
}

const form = document.getElementById("studentForm");
const achievementBox = document.getElementById("AcheivementsSection");
const photoInput = document.getElementById("photo-id");

// --- 1. ACHIEVEMENT HIDE/SHOW LOGIC ---
const editData = localStorage.getItem("editStudent");
let editDocId = null;

if (editData) {
    const s = JSON.parse(editData);
    editDocId = s.docId;
    if (achievementBox) achievementBox.style.display = "block"; // Edit mein dikhega

    // Aapka original edit mapping logic
    document.getElementById("std-name").value = s.name || "";
    document.getElementById("father-ipt-id").value = s.father || "";
    document.getElementById("mother-ipt-id").value = s.mother || "";
    document.getElementById("std-email-id").value = s.email || "";
    document.getElementById("mobile-id").value = s.mobile || "";
    document.getElementById("dob-id").value = s.dob || "";
    document.getElementById("aadhar-id").value = s.aadhar || "";
    document.getElementById("blood-group").value = s.blood || "";
    document.getElementById("admission-date").value = s.admissionDate || "";
    document.getElementById("emergency-id").value = s.emergency || "";
    document.getElementById("country-status").value = s.residency || "";
    document.getElementById("std-address").value = s.address || "";
    document.getElementById("state-id").value = s.state || "";
    document.getElementById("district-id").value = s.district || "";
    document.getElementById("taluka-id").value = s.taluka || "";
    document.getElementById("city-id").value = s.city || "";
    document.getElementById("pincode-id").value = s.pincode || "";
    document.getElementById("ssc-marks").value = s.ssc || "";
    document.getElementById("hsc-marks").value = s.hsc || "";
    document.getElementById("degree-level").value = s.degree || "";
    document.getElementById("dept-id").value = s.department || "";
    document.getElementById("course-id").value = s.course || "";
    document.getElementById("year-id").value = s.year || "";
    if (s.gender === "Male") document.getElementById("male-id").checked = true;
    if (s.gender === "Female") document.getElementById("female-id").checked = true;
    document.getElementById("submitBtn").innerText = "Update Student";
} else {
    // AGAR NAYA STUDENT HAI TO HIDE KARO
    if (achievementBox) achievementBox.style.display = "none";
}

// --- 2. NAVIGATION LOGIC (Buttons kaam nahi kar rahe the isliye ye zaruri hai) ---
document.querySelector(".next").addEventListener("click", () => {
    document.querySelector(".personal-info").style.display = "none";
    document.querySelector(".Address").style.display = "block";
});

document.querySelector(".next-page").addEventListener("click", () => {
    document.querySelector(".Address").style.display = "none";
    document.querySelector(".Academic-details").style.display = "block";
});

async function getNextStudentId() {
    const snap = await getDocs(collection(db, "students"));
    return snap.size + 1;
}

// --- 3. SUBMIT & VALIDATION LOGIC ---
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // SIMPLE VALIDATION
    const email = document.getElementById("std-email-id").value.trim();
    const mobile = document.getElementById("mobile-id").value.trim();
    const name = document.getElementById("std-name").value.trim();

    if (!email || !mobile || !name) {
        alert("Please fill mandatory fields!");
        return;
    }

    const studentData = {
        name: name,
        father: document.getElementById("father-ipt-id").value.trim(),
        mother: document.getElementById("mother-ipt-id").value.trim(),
        email: email,
        mobile: mobile,
        dob: document.getElementById("dob-id").value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || "",
        aadhar: document.getElementById("aadhar-id").value.trim(),
        blood: document.getElementById("blood-group").value,
        admissionDate: document.getElementById("admission-date").value,
        emergency: document.getElementById("emergency-id").value.trim(),
        residency: document.getElementById("country-status").value,
        address: document.getElementById("std-address").value.trim(),
        state: document.getElementById("state-id").value.trim(),
        district: document.getElementById("district-id").value.trim(),
        taluka: document.getElementById("taluka-id").value.trim(),
        city: document.getElementById("city-id").value.trim(),
        pincode: document.getElementById("pincode-id").value.trim(),
        ssc: document.getElementById("ssc-marks").value.trim(),
        hsc: document.getElementById("hsc-marks").value.trim(),
        degree: document.getElementById("degree-level").value,
        department: document.getElementById("dept-id").value,
        course: document.getElementById("course-id").value,
        year: document.getElementById("year-id").value,
        role: "student"
    };

    try {
        if (editDocId) {
            // Update Logic
            const ref = doc(db, "students", editDocId);
            await updateDoc(ref, studentData);
            alert("Updated!");
            localStorage.removeItem("editStudent");
        } else {
            // NEW STUDENT: Auth create karein
            const userCred = await createUserWithEmailAndPassword(secondaryAuth, email, mobile);
            studentData.uid = userCred.user.uid;
            studentData.studentId = await getNextStudentId();

            await addDoc(collection(db, "students"), studentData);
            await signOut(secondaryAuth);

            alert("Student Added Successfully!");
            // ADD HONE KE BAAD SHOW KARO (Aapki request ke hisab se)
            if (achievementBox) achievementBox.style.display = "block";
        }

        // window.location.href = "search.html"; // Isko uncomment kar dena agar redirect chahiye
    } catch (err) {
        alert("Error: " + err.message);
    }
});