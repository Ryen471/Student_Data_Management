import { db } from "./firebase.js";
import { doc, getDoc, updateDoc, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('id');
const studentForm = document.getElementById("studentForm");
const submitBtn = document.getElementById("submitBtn");


if (studentId) {
    (async () => {
        const docRef = doc(db, "students", studentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("std-name").value = data.fullName || "";
            document.getElementById("father-ipt-id").value = data.fatherName || "";
            document.getElementById("mother-ipt-id").value = data.motherName || "";
            document.getElementById("std-email-id").value = data.email || "";
            document.getElementById("mobile-id").value = data.mobile || "";
            document.getElementById("dob-id").value = data.dob || "";

            if (data.gender === "Male") document.getElementById("male-id").checked = true;
            if (data.gender === "Female") document.getElementById("female-id").checked = true;

            document.getElementById("aadhar-id").value = data.aadhar || "";
            document.getElementById("blood-group").value = data.bloodGroup || "";
            document.getElementById("admission-date").value = data.admissionDate || "";
            document.getElementById("emergency-id").value = data.emergency || "";
            document.getElementById("country-status").value = data.countryStatus || "Indian";
            document.getElementById("std-address").value = data.address || "";
            document.getElementById("state-id").value = data.state || "";
            document.getElementById("district-id").value = data.district || "";
            document.getElementById("taluka-id").value = data.taluka || "";
            document.getElementById("city-id").value = data.city || "";
            document.getElementById("pincode-id").value = data.pincode || "";
            document.getElementById("ssc-marks").value = data.sscMarks || "";
            document.getElementById("hsc-marks").value = data.hscMarks || "";
            document.getElementById("degree-level").value = data.degreeLevel || "";
            document.getElementById("dept-id").value = data.department || "";
            document.getElementById("course-id").value = data.course || "";
            document.getElementById("year-id").value = data.studyYear || "";

            if (submitBtn) submitBtn.innerText = "Update Details";
        }
    })();
}


studentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const genderInput = document.querySelector('input[name="gender"]:checked');

    const studentData = {
        fullName: document.getElementById("std-name").value,
        fatherName: document.getElementById("father-ipt-id").value,
        motherName: document.getElementById("mother-ipt-id").value,
        email: document.getElementById("std-email-id").value,
        mobile: document.getElementById("mobile-id").value,
        dob: document.getElementById("dob-id").value,
        gender: genderInput ? genderInput.value : "N/A",
        aadhar: document.getElementById("aadhar-id").value,
        bloodGroup: document.getElementById("blood-group").value,
        admissionDate: document.getElementById("admission-date").value,
        emergency: document.getElementById("emergency-id").value,
        countryStatus: document.getElementById("country-status").value,
        address: document.getElementById("std-address").value,
        state: document.getElementById("state-id").value,
        district: document.getElementById("district-id").value,
        taluka: document.getElementById("taluka-id").value,
        city: document.getElementById("city-id").value,
        pincode: document.getElementById("pincode-id").value,
        sscMarks: document.getElementById("ssc-marks").value,
        hscMarks: document.getElementById("hsc-marks").value,
        degreeLevel: document.getElementById("degree-level").value,
        department: document.getElementById("dept-id").value,
        course: document.getElementById("course-id").value,
        studyYear: document.getElementById("year-id").value
    };

    try {
        if (studentId) {

            await updateDoc(doc(db, "students", studentId), studentData);
            alert("Record Updated Successfully!");
        } else {

            const snapshot = await getDocs(collection(db, "students"));


            const nextRollNo = snapshot.size + 1;

            studentData.rollNo = nextRollNo;

            await addDoc(collection(db, "students"), studentData);
            alert("Student Added! Allotted Roll No: " + nextRollNo);
        }
        window.location.href = "search.html";
    } catch (err) {
        console.error("Error:", err);
        alert("Error saving record: " + err.message);
    }
});