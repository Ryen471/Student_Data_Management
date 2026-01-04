import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const studentTable = document.getElementById("studentTable");

async function loadStudents() {
    try {
        const querySnapshot = await getDocs(collection(db, "students"));
        studentTable.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            const student = doc.data();
            const row = document.createElement("tr");
            
            row.innerHTML = `
                <td>${student.rollNo || "N/A"}</td> 
                <td>${student.fullName || "N/A"}</td>
                <td>${student.department || "N/A"}</td>
                <td>${student.studyYear || "N/A"}</td> 
                <td>${student.mobile || "N/A"}</td>
                <td>
                    <button class="view-btn" data-id="${doc.id}">View</button>
                    <button class="update-btn" data-id="${doc.id}" style="background-color: #ff9800; color: white; margin-left: 5px; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Update</button>
                </td>
                <td style="display:none;">${student.countryStatus || ""}</td>
            `;
            studentTable.appendChild(row);
        });

        attachListeners();
    } catch (error) {
        console.error("Error loading students: ", error);
    }
}

function attachListeners() {
    document.querySelectorAll(".view-btn").forEach(btn => {
        btn.onclick = (e) => window.location.href = `view.html?id=${e.target.dataset.id}`;
    });
    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.onclick = (e) => window.location.href = `add.html?id=${e.target.dataset.id}`;
    });
}

function filterTable() {
    const nameFilter = document.getElementById("searchInput").value.toUpperCase().trim();
    const cityFilter = document.querySelector('select[name="city"]').value.toUpperCase().trim();
    const classFilter = document.querySelector('select[name="class"]').value.toUpperCase().trim();
    const deptFilter = document.querySelector('select[name="Department"]').value.toUpperCase().trim();

    const rows = studentTable.getElementsByTagName("tr");

    for (let row of rows) {
        const nameText = row.cells[1].textContent.toUpperCase().trim();
        const deptText = row.cells[2].textContent.toUpperCase().trim();
        const classText = row.cells[3].textContent.toUpperCase().trim();
        const cityText = row.cells[6].textContent.toUpperCase().trim(); 

        const matchesName = nameFilter === "" || nameText.includes(nameFilter);
        const matchesCity = cityFilter === "" || cityText === cityFilter;
        const matchesClass = classFilter === "" || classText === classFilter;
        const matchesDept = deptFilter === "" || deptText === deptFilter;

        if (matchesName && matchesCity && matchesClass && matchesDept) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}

window.filterTable = filterTable;
loadStudents();