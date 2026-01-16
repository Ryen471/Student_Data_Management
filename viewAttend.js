import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const reportBody = document.getElementById("reportData");
const dateInput = document.getElementById("search-date");

window.getLedgerReport = async function () {
    const date = dateInput.value;

    if (!date) {
        alert("Please select date");
        return;
    }

    reportBody.innerHTML = "";


    const studentSnap = await getDocs(collection(db, "students"));
    let students = [];

    studentSnap.forEach(docu => {
        students.push({ ...docu.data() });
    });


    students.sort((a, b) => a.studentId - b.studentId);


    const attQuery = query(
        collection(db, "attendance"),
        where("date", "==", date)
    );
    const attSnap = await getDocs(attQuery);

    let attendanceMap = {};
    attSnap.forEach(d => {
        const a = d.data();
        if (!attendanceMap[a.studentId]) {
            attendanceMap[a.studentId] = {};
        }
        attendanceMap[a.studentId][a.subject] = a.status;
    });


    students.forEach(s => {
        const att = attendanceMap[s.studentId] || {};

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${s.studentId}</td>
      <td>${s.name}</td>
      <td>${att["EVS"] || "-"}</td>
      <td>${att["OE"] || "-"}</td>
      <td>${att["Mathematics"] || "-"}</td>
      <td>${att["Microcontroller"] || "-"}</td>
      <td>${att["STBC"] || "-"}</td>
      <td>${att["Advance C"] || "-"}</td>
      <td>${att["English"] || "-"}</td>
    `;
        reportBody.appendChild(tr);
    });
};