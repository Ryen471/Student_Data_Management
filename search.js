import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("viewModal");
const content = document.getElementById("fullInfoContent");

let allStudents = [];

async function loadStudents() {
    const snap = await getDocs(collection(db, "students"));
    allStudents = [];

    snap.forEach(d => {
        allStudents.push({ id: d.id, ...d.data() });
    });

    renderTable(allStudents);
}


function renderTable(data) {
    studentTable.innerHTML = "";

    data.forEach(std => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${std.studentId}</td>
      <td>${std.name}</td>
      <td>${std.department}</td>
      <td>${std.year}</td>
      <td>${std.mobile}</td>
      <td>
        <button onclick="viewStudent('${std.id}')">View</button>
        <button onclick="editStudent('${std.id}')">Update</button>
      </td>
    `;
        studentTable.appendChild(tr);
    });
}

window.filterTable = function () {
    const text = searchInput.value.toLowerCase();
    const city = document.querySelector('select[name="city"]').value;
    const year = document.querySelector('select[name="class"]').value;
    const dept = document.querySelector('select[name="Department"]').value;

    const filtered = allStudents.filter(s => {
        const searchMatch =
            s.name.toLowerCase().includes(text) ||
            s.studentId.toString().includes(text);

        const cityMatch = city ? s.residency === city : true;
        const yearMatch = year ? s.year === year : true;
        const deptMatch = dept ? s.department === dept : true;

        return searchMatch && cityMatch && yearMatch && deptMatch;
    });

    renderTable(filtered);
};

window.viewStudent = function (id) {
    const s = allStudents.find(x => x.id === id);

    content.innerHTML = `
    <h3>${s.name}</h3>
    <p><b>ID:</b> ${s.studentId}</p>
    <p><b>Email:</b> ${s.email}</p>
    <p><b>Mobile:</b> ${s.mobile}</p>
    <p><b>Department:</b> ${s.department}</p>
    <p><b>Year:</b> ${s.year}</p>
    <p><b>City:</b> ${s.residency}</p>
    <button onclick="closeModal()">Close</button>
  `;
    modal.style.display = "block";
};

window.editStudent = function (id) {
    const s = allStudents.find(x => x.id === id);

    content.innerHTML = `
    <h3>Update Student</h3>

    <input id="uName" value="${s.name}">
    <input id="uMobile" value="${s.mobile}">
    <input id="uDept" value="${s.department}">
    <input id="uYear" value="${s.year}">
    <input id="uCity" value="${s.residency}">

    <br><br>
    <button onclick="saveUpdate('${id}')">Save</button>
    <button onclick="closeModal()">Cancel</button>
  `;
    modal.style.display = "block";
};


window.saveUpdate = async function (id) {
    const ref = doc(db, "students", id);

    await updateDoc(ref, {
        name: document.getElementById("uName").value,
        mobile: document.getElementById("uMobile").value,
        department: document.getElementById("uDept").value,
        year: document.getElementById("uYear").value,
        residency: document.getElementById("uCity").value
    });

    alert("Student updated");
    closeModal();
    loadStudents();
};


window.closeModal = function () {
    modal.style.display = "none";
};


loadStudents();