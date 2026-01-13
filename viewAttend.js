import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

window.getLedgerReport = async function() {
    const dateInput = document.getElementById("search-date").value;
    const tableBody = document.getElementById("reportData");

    if (!dateInput) {
        alert("Please select a date first!");
        return;
    }

   
    const parts = dateInput.split("-");
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

    
    const subjects = ["EVS", "OE", "Mathematics", "Microcontroller", "STBC", "Advance C", "AEC"];

    try {
        tableBody.innerHTML = "<tr><td colspan='9'>Loading...</td></tr>";

        const q = query(collection(db, "AttendanceRecords"), where("date", "==", formattedDate));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="9">No records found for ${formattedDate}</td></tr>`;
            return;
        }

        let ledger = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const roll = data.rollNo;
            if (!ledger[roll]) {
                ledger[roll] = { name: data.studentName, attendMap: {} };
            }
            ledger[roll].attendMap[data.subject] = data.status;
        });

        tableBody.innerHTML = ""; 

        for (let roll in ledger) {
            const student = ledger[roll];
            const tr = document.createElement("tr");

            let rowHTML = `<td>${roll}</td><td>${student.name}</td>`;

          
            subjects.forEach(sub => {
                const status = student.attendMap[sub] || "-";
                let colorClass = "";
                if (status === "Present") colorClass = "status-present";
                if (status === "Absent") colorClass = "status-absent";

                rowHTML += `<td class="${colorClass}">${status}</td>`;
            });

            tr.innerHTML = rowHTML;
            tableBody.appendChild(tr);
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
};