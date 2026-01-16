import { db } from "./firebase.js";
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");

let allStudents = [];


async function loadStudents() {
    const snap = await getDocs(collection(db, "students"));
    allStudents = [];

    snap.forEach(docu => {
        allStudents.push({ docId: docu.id, ...docu.data() });
    });


    allStudents.sort((a, b) => a.studentId - b.studentId);

    renderTable(allStudents);
}


function renderTable(data) {
    studentTable.innerHTML = "";

    data.forEach((s, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.department}</td>
            <td>${s.year}</td>
            <td>${s.mobile}</td>
            <td>
                <button onclick="viewStudent('${s.docId}')">View</button>
                <button onclick="updateStudent('${s.docId}')">Update</button>
            </td>
        `;
        studentTable.appendChild(tr);
    });
}


window.filterTable = function () {
    const text = searchInput.value.toLowerCase();
    const filtered = allStudents.filter(s =>
        s.name.toLowerCase().includes(text) ||
        s.studentId.toString().includes(text)
    );
    renderTable(filtered);
};


window.viewStudent = function (id) {
    localStorage.setItem("viewStudentId", id);
    window.location.href = "view.html";
};


window.updateStudent = function (id) {
    const s = allStudents.find(x => x.docId === id);
    localStorage.setItem("editStudent", JSON.stringify(s));
    window.location.href = "add.html";
};

loadStudents();