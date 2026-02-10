import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const classDropdown = document.getElementById("Class-dropdown");
const deptDropdown = document.getElementById("Department-dropdown");
const MonthInput = document.getElementById("search-Month");
const tableBody = document.querySelector("#ledgerTable tbody");

window.getLedgerReport = async function () {
    const year = classDropdown.value;
    const department = deptDropdown.value;
    const month = MonthInput.value;

    if (!year || !department || !month) {
        alert("Select Month, Class and Department");
        return;
    }

    tableBody.innerHTML = "";

    window.getresetinput = function () {

        classDropdown.value = "";
        deptDropdown.value = "";
        MonthInput.value = "";


        tableBody.innerHTML = "<tr><td colspan='5'>No data found</td></tr>";
    };


    const firstDay = new Date(`${month}-01`);
    const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
    const totalDaysInMonth = lastDay.getDate();

    const monthYear = month;


    const q = query(
        collection(db, "attendance"),
        where("year", "==", year),
        where("department", "==", department),
        where("monthYear", "==", monthYear)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        tableBody.innerHTML = "<tr><td colspan='6'>No data found</td></tr>";
        return;
    }

    let studentMap = {};
    snap.forEach(doc => {
        const data = doc.data();
        if (!studentMap[data.studentId]) {
            studentMap[data.studentId] = {
                name: data.name,
                present: 0,
                absent: 0
            };
        }
        if (data.status === "P") studentMap[data.studentId].present++;
        if (data.status === "A") studentMap[data.studentId].absent++;
    });


    Object.keys(studentMap)
        .sort((a, b) => a - b)
        .forEach(id => {
            const s = studentMap[id];
            const remainingDays = totalDaysInMonth - (s.present + s.absent);
            const average = ((s.present / totalDaysInMonth) * 100).toFixed(2);

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${id}</td>
                <td>${s.name}</td>
                <td>${s.present}</td>
                <td>${s.absent}</td>
                <td>${remainingDays}</td>
                <td>${average}%</td>
            `;
            tableBody.appendChild(tr);
        });
};