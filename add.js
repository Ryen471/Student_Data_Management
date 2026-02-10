import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    getDocs,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


async function addActivity(text) {
    await addDoc(collection(db, "activities"), {
        text,
        time: serverTimestamp()
    });
}


const form = document.getElementById("studentForm");
const achievementBox = document.getElementById("AcheivementsSection");
const photoInput = document.getElementById("photo-id");

const editData = localStorage.getItem("editStudent");
let editDocId = null;


if (editData) {
    const s = JSON.parse(editData);
    editDocId = s.docId;


    if (achievementBox) achievementBox.style.display = "block";

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


    document.getElementById("achievementInput-id").value = "";

    document.getElementById("submitBtn").innerText = "Update Student";
} else {

    if (achievementBox) achievementBox.style.display = "none";
}


async function getNextStudentId() {
    const snap = await getDocs(collection(db, "students"));
    return snap.size + 1;
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();


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


    if (!editDocId && (!photoInput || photoInput.files.length === 0)) {
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

    try {
        if (editDocId) {
            const ref = doc(db, "students", editDocId);
            const snap = await getDoc(ref);
            const existingAchievements = snap.exists() && Array.isArray(snap.data().achievements) ? snap.data().achievements : [];

            const achText = document.getElementById("achievementInput-id").value.trim();
            let achievements = [];
            if (achText) achievements = achText.split(",").map(a => a.trim());


            studentData.achievements = [...existingAchievements.filter(a => a), ...achievements];

            await updateDoc(ref, studentData);
            await addActivity(`Student updated: ${studentData.name}`);
            localStorage.removeItem("editStudent");
            alert("Student Updated Successfully");
        } else {
            studentData.studentId = await getNextStudentId();
            await addDoc(collection(db, "students"), studentData);
            await addActivity(`New student added: ${studentData.name}`);
            alert("Student Added Successfully");
        }

        window.location.href = "search.html";
    } catch (err) {
        alert(err.message);
    }
});