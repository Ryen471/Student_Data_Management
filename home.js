import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        const username = user.email.split('@')[0];
        document.getElementById("title").innerText = `Welcome, ${username.toUpperCase()}`;
        
   
        updateStudentCount();
        loadNotices();
        showActivities();
    }
});


function showActivities() {
    const activityList = document.getElementById("activitylist");
    if (activityList) {
        activityList.innerHTML = `
            <li><i class="fa-solid fa-check-circle" style="color: green;"></i> Database: Student system Live</li>
            <li><i class="fa-solid fa-bullhorn" style="color: purple;"></i> Communication: Notice board active</li>
            <li><i class="fa-solid fa-shield-halved" style="color: blue;"></i> Session: Authorized Access</li>
        `;
    }
}


async function updateStudentCount() {
    try {
        const snapshot = await getDocs(collection(db, "students"));
        document.getElementById("totalCount").innerText = snapshot.size;
    } catch (err) { console.error(err); }
}


const postBtn = document.getElementById("postNoticeBtn");
if (postBtn) {
    postBtn.onclick = async () => {
        const title = document.getElementById("noticeTitle").value;
        const msg = document.getElementById("noticeMsg").value;

        if (title && msg) {
            try {
                await addDoc(collection(db, "notices"), {
                    title: title,
                    message: msg,
                    timestamp: serverTimestamp()
                });
                alert("Notice Published!");
                location.reload(); 
            } catch (err) {
                alert("Error: " + err.message);
            }
        } else {
            alert("Please fill both Title and Message!");
        }
    };
}


async function loadNotices() {
    const noticeList = document.getElementById("noticeList");
    if (!noticeList) return;
    
    const q = query(collection(db, "notices"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    noticeList.innerHTML = snapshot.empty ? "<li>No internal notices.</li>" : "";
    
    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${data.title}</strong>
            <p style="font-weight: 400; font-size: 13px; color: #666; margin-top: 5px;">${data.message}</p>
        `;
        noticeList.appendChild(li);
    });
}


document.getElementById("logoutBtn").onclick = () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};