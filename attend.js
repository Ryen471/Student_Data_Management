
import { db } from "./firebase.js"; 


import { 
    collection, 
    getDocs, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const attendanceTable = document.getElementById("attendanceTable");


async function fetchStudents() {
    try {
        if (!db) {
            throw new Error("Firestore instance (db) not found! Check firebase.js");
        }

       
        const colRef = collection(db, "students"); 
        const querySnapshot = await getDocs(colRef);
        
        attendanceTable.innerHTML = ""; 

        if (querySnapshot.empty) {
            attendanceTable.innerHTML = "<tr><td colspan='3'>No students found in database.</td></tr>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const student = doc.data();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.rollNo || "N/A"}</td>
                <td>${student.fullName || student.name || "Unknown"}</td>
                <td>
                    <select class="status-select">
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </td>
            `;
            attendanceTable.appendChild(row);
        });
    } catch (error) {
        console.error("Detailed Error:", error);
        alert("Error fetching students: " + error.message);
    }
}


fetchStudents();


window.saveAttendance = async function () {
    const subject = document.getElementById("subject-dropdown").value;
    const rows = attendanceTable.querySelectorAll("tr");

    if (!subject) {
        alert("Please select a subject!");
        return;
    }

    try {
        const date = new Date().toLocaleDateString('en-GB'); 

        for (let row of rows) {
            const rollNo = row.cells[0].innerText;
            const name = row.cells[1].innerText;
            const status = row.querySelector(".status-select").value;

          
            await addDoc(collection(db, "AttendanceRecords"), {
                subject: subject,
                rollNo: rollNo,
                studentName: name,
                status: status,
                date: date,
                timestamp: serverTimestamp()
            });
        }
        alert("Attendance submitted successfully for " + subject);
    } catch (error) {
        console.error("Save Error:", error);
        alert("Failed to save attendance: " + error.message);
    }
};