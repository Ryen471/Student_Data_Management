import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("attendanceTable");
const classDropdown = document.getElementById("Class-dropdown");
const deptDropdown = document.getElementById("Department-dropdown");
const dateInput = document.getElementById("search-date");

let students = [];


const today = new Date();
dateInput.value = today.toISOString().split("T")[0];

async function loadStudents() {
    table.innerHTML = "";
    students = [];

    if (!classDropdown.value || !deptDropdown.value) return;

    const snap = await getDocs(collection(db, "students"));
    snap.forEach(doc => {
        const s = doc.data();
        if (s.year === classDropdown.value && s.department === deptDropdown.value) {
            students.push(s);
        }
    });

    students.sort((a, b) => a.studentId - b.studentId);
    renderTable();
}


function renderTable() {
    table.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Attendance (P/A)</th>
      </tr>
    `;

    students.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${s.studentId}</td>
          <td>${s.name}</td>
          <td>
            <input type="radio" name="att_${s.studentId}" value="P" checked> P
            <input type="radio" name="att_${s.studentId}" value="A"> A
          </td>
        `;
        table.appendChild(tr);
    });
}


classDropdown.addEventListener("change", loadStudents);
deptDropdown.addEventListener("change", loadStudents);


window.saveAttendance = async function () {
    const year = classDropdown.value;
    const department = deptDropdown.value;
    const date = dateInput.value;
    const monthYear = date.slice(0, 7);

    if (!year || !department || !date) {
        alert("Please fill all fields");
        return;
    }


    const q = query(
        collection(db, "attendance"),
        where("year", "==", year),
        where("department", "==", department),
        where("date", "==", date)
    );

    const snap = await getDocs(q);
    for (let d of snap.docs) {
        await deleteDoc(d.ref);
    }


    for (let s of students) {
        const status = document.querySelector(
            `input[name="att_${s.studentId}"]:checked`
        ).value;

        await addDoc(collection(db, "attendance"), {
            studentId: s.studentId,
            name: s.name,
            year,
            department,
            date,
            monthYear,
            status
        });
    }

    alert("Attendance saved successfully");
};


export async function getAverageAttendance(studentId, year, department, monthYear) {
    const snap = await getDocs(query(
        collection(db, "attendance"),
        where("studentId", "==", studentId),
        where("year", "==", year),
        where("department", "==", department),
        where("monthYear", "==", monthYear)
    ));

    let total = 0;
    let present = 0;
    snap.forEach(doc => {
        total++;
        if (doc.data().status === "P") present++;
    });

    if (total === 0) return 0;
    return ((present / total) * 100).toFixed(2);
};
