import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("attendanceTable");
const subjectDropdown = document.getElementById("subject-dropdown");
const dateInput = document.getElementById("search-date");

let students = [];


async function loadStudents() {
    const snap = await getDocs(collection(db, "students"));
    students = [];

    snap.forEach(d => {
        students.push(d.data());
    });

    students.sort((a, b) => a.studentId - b.studentId);
    renderTable();
}


function renderTable() {
    table.innerHTML = "";

    students.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${s.studentId}</td>
      <td>${s.name}</td>
      <td>
        <label>
          <input type="radio" 
                 name="att_${s.studentId}" 
                 value="P" checked> Present
        </label>
        &nbsp;&nbsp;
        <label>
          <input type="radio" 
                 name="att_${s.studentId}" 
                 value="A"> Absent
        </label>
      </td>
    `;
        table.appendChild(tr);
    });
}


window.saveAttendance = async function () {
    const date = dateInput.value;
    if (!date) return alert("Select date");
    if (!subjectDropdown.value) return alert("Select subject");

    const subject =
        subjectDropdown.options[subjectDropdown.selectedIndex].text;

    for (let s of students) {
        const status = document.querySelector(
            `input[name="att_${s.studentId}"]:checked`
        ).value;

        await addDoc(collection(db, "attendance"), {
            studentId: s.studentId,
            name: s.name,
            subject,
            date,
            status
        });
    }

    alert("Attendance saved successfully");
};

loadStudents();