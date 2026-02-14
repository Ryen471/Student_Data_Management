// add.js
import { db, functions } from "./firebase.js";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    getDocs,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js";

// Function to add activity logs
async function addActivity(text) {
    await addDoc(collection(db, "activities"), {
        text,
        time: serverTimestamp()
    });
}

const form = document.getElementById("studentForm");
const photoInput = document.getElementById("photo-id");

async function getNextStudentId() {
    const snap = await getDocs(collection(db, "students"));
    let maxId = 0;
    snap.forEach(doc => {
        const data = doc.data();
        if (data.studentId && data.studentId > maxId) maxId = data.studentId;
    });
    return maxId + 1;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic validations
    const requiredIds = [
        "std-name", "father-ipt-id", "mother-ipt-id", "std-email-id",
        "mobile-id", "dob-id", "emergency-id", "country-status",
        "std-address", "state-id", "district-id", "taluka-id",
        "city-id", "degree-level", "dept-id", "course-id", "year-id"
    ];

    for (let id of requiredIds) {
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
            alert("Please fill all * marked fields");
            return;
        }
    }

    if (!photoInput || photoInput.files.length === 0) {
        alert("Student photo is mandatory");
        return;
    }

    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    if (!gender) {
        alert("Please select gender");
        return;
    }

    const email = document.getElementById("std-email-id").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert("Invalid email format");
        return;
    }

    const mobile = document.getElementById("mobile-id").value.trim();
    if (!/^\d{10}$/.test(mobile)) {
        alert("Mobile number must be 10 digits");
        return;
    }

    const aadhar = document.getElementById("aadhar-id").value.trim();
    if (aadhar && !/^\d{12}$/.test(aadhar)) {
        alert("Aadhar must be 12 digits");
        return;
    }

    // Collect student data
    const studentData = {
        name: document.getElementById("std-name").value.trim(),
        father: document.getElementById("father-ipt-id").value.trim(),
        mother: document.getElementById("mother-ipt-id").value.trim(),
        email,
        mobile,
        dob: document.getElementById("dob-id").value,
        gender,
        aadhar,
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
        year: document.getElementById("year-id").value
    };

    // Convert photo to Base64
    if (photoInput.files.length > 0) {
        const file = photoInput.files[0];
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        studentData.photo = base64;
    }

    try {
        // Add student to Firestore
        studentData.studentId = await getNextStudentId();
        await addDoc(collection(db, "students"), studentData);

        // Call Cloud Function to create Firebase Auth user
        const createStudentUser = httpsCallable(functions, 'createStudentUser');
        const password = "123456"; // Default password for new student
        await createStudentUser({ email, password });

        await addActivity(`New student added: ${studentData.name}`);
        alert(`Student Added Successfully! Default password: ${password}`);
        form.reset();
    } catch (err) {
        alert(err.message);
    }
});