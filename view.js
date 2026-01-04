import { db } from "./firebase.js";
import { doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('id');

async function loadStudentProfile() {
    if (!studentId) {
        alert("No student ID found!");
        return;
    }

    try {
        const docRef = doc(db, "students", studentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            document.getElementById("name").innerText = `Student Name: ${data.fullName || 'N/A'}`;
            
            
            document.getElementById("roll").innerText = data.rollNo || 'N/A';

            document.getElementById("dob").innerText = data.dob || 'N/A';
            document.getElementById("gender").innerText = data.gender || 'N/A';
            document.getElementById("bloodGroup").innerText = data.bloodGroup || 'N/A';
            document.getElementById("aadhar").innerText = data.aadhar || 'N/A';
            document.getElementById("parentsName").innerText = `${data.fatherName || ''} / ${data.motherName || ''}`;

            document.getElementById("admDate").innerText = data.admissionDate || 'N/A';
            document.getElementById("course").innerText = data.course || 'N/A';
            document.getElementById("department").innerText = data.department || 'N/A';
            document.getElementById("class").innerText = data.studyYear || 'N/A';

            document.getElementById("mobile").innerText = data.mobile || 'N/A';
            document.getElementById("emergency").innerText = data.emergency || 'N/A';
            document.getElementById("email").innerText = data.email || 'N/A';
            document.getElementById("city").innerText = data.city || 'N/A';
            document.getElementById("state").innerText = data.state || 'N/A';
            document.getElementById("taluka").innerText = data.taluka || 'N/A';
            document.getElementById("pincode").innerText = data.pincode || 'N/A';

        } else {
            alert("Student not found.");
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

const deleteBtn = document.querySelector(".delete-btn");
if (deleteBtn) {
    deleteBtn.onclick = async () => {
        if (confirm("Permanently delete this record?")) {
            await deleteDoc(doc(db, "students", studentId));
            alert("Deleted!");
            window.location.href = "search.html";
        }
    };
}

loadStudentProfile();