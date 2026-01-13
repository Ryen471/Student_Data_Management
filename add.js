import { auth, db } from "./firebase.js";
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Please login first");
        window.location.href = "adminlog.html";
        return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists() || snap.data().role !== "admin") {
        alert("Access denied");
        window.location.href = "student-dashboard.html";
    }
});


document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "adminlog.html";
});


const form = document.getElementById("studentForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();


    const name = document.getElementById("std-name").value.trim();
    const email = document.getElementById("std-email-id").value.trim();
    const mobile = document.getElementById("mobile-id").value.trim();
    const dob = document.getElementById("dob-id").value;
    const admissionDate = document.getElementById("admission-date").value;
    const address = document.getElementById("std-address").value.trim();
    const dept = document.getElementById("dept-id").value;
    const course = document.getElementById("course-id").value;
    const year = document.getElementById("year-id").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;


    if (!name) return alert("Student name is required");
    if (!email || !email.includes("@")) return alert("Enter valid email");
    if (mobile.length !== 10) return alert("Mobile number must be 10 digits");
    if (!gender) return alert("Select gender");
    if (!dob) return alert("Date of birth is required");
    if (!admissionDate) return alert("Admission date is required");
    if (!address) return alert("Address is required");
    if (dept === "Select") return alert("Select department");
    if (course === "Select") return alert("Select course");
    if (year === "Select") return alert("Select study year");


    const aadhar = document.getElementById("aadhar-id").value.trim();
    if (aadhar && aadhar.length !== 12)
        return alert("Aadhar must be 12 digits");

    const emergency = document.getElementById("emergency-id").value.trim();
    if (emergency && emergency.length !== 10)
        return alert("Emergency contact must be 10 digits");

    const pincode = document.getElementById("pincode-id").value.trim();
    if (pincode && pincode.length !== 6)
        return alert("Pincode must be 6 digits");


    const studentData = {
        name,
        fatherName: document.getElementById("father-ipt-id").value,
        motherName: document.getElementById("mother-ipt-id").value,
        email,
        mobile,
        dob,
        gender,
        aadhar,
        bloodGroup: document.getElementById("blood-group").value,
        admissionDate,
        emergency,

        residency: document.getElementById("country-status").value,
        address,
        state: document.getElementById("state-id").value,
        district: document.getElementById("district-id").value,
        taluka: document.getElementById("taluka-id").value,
        city: document.getElementById("city-id").value,
        pincode,

        ssc: document.getElementById("ssc-marks").value,
        hsc: document.getElementById("hsc-marks").value,
        degreeLevel: document.getElementById("degree-level").value,
        department: dept,
        course,
        year,

        createdAt: serverTimestamp()
    };


    try {
        await addDoc(collection(db, "students"), studentData);
        alert("Student added successfully ");
        form.reset();
    } catch (err) {
        alert("Failed to save student ");
        console.error(err);
    }
});