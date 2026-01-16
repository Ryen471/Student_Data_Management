import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("studentForm");


const editData = localStorage.getItem("editStudent");
let editDocId = null;

if (editData) {
    const s = JSON.parse(editData);
    editDocId = s.docId;

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
}



async function getNextStudentId() {
    const snap = await getDocs(collection(db, "students"));
    return snap.size + 1;
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();


    const gender =
        document.querySelector('input[name="gender"]:checked')?.value || "";

    const studentData = {
        name: document.getElementById("std-name").value.trim(),
        father: document.getElementById("father-ipt-id").value.trim(),
        mother: document.getElementById("mother-ipt-id").value.trim(),
        email: document.getElementById("std-email-id").value.trim(),
        mobile: document.getElementById("mobile-id").value.trim(),
        dob: document.getElementById("dob-id").value,

        gender: gender,

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
    };

    try {
        if (editDocId) {
            await updateDoc(doc(db, "students", editDocId), studentData);
            localStorage.removeItem("editStudent");
            alert("Student Updated Successfully");
        } else {
            studentData.studentId = await getNextStudentId();
            await addDoc(collection(db, "students"), studentData);
            alert("Student Added Successfully");
        }

        window.location.href = "search.html";
    } catch (err) {
        alert("Error: " + err.message);
    }
});