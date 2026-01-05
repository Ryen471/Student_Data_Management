import { db, auth } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

ROLE SECURITY CHECK
const role = localStorage.getItem("role");

if (role !== "admin") {
    alert("Access Denied!");
    window.location.href = "student-dashboard.html";
}

const postBtn = document.getElementById("postNoticeBtn");
const noticeTitle = document.getElementById("noticeTitle");
const noticeMsg = document.getElementById("noticeMsg");
const noticeList = document.getElementById("noticeList");
const activityList = document.getElementById("activityList");


postBtn.addEventListener("click", async () => {

    if (!noticeTitle.value || !noticeMsg.value) {
        alert("Please fill all fields");
        return;
    }

    try {
        await addDoc(collection(db, "notices"), {
            title: noticeTitle.value,
            message: noticeMsg.value,
            postedBy: "Admin",
            time: serverTimestamp()
        });

        await addDoc(collection(db, "activity"), {
            action: "Posted a new notice",
            time: serverTimestamp()
        });

        noticeTitle.value = "";
        noticeMsg.value = "";

        loadNotices();
        loadActivity();

        alert("Notice posted successfully");

    } catch (error) {
        console.error(error);
        alert("Error posting notice");
    }
});


async function loadNotices() {
    noticeList.innerHTML = "";

    const q = query(
        collection(db, "notices"),
        orderBy("time", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${doc.data().title}</strong> - ${doc.data().message}`;
        noticeList.appendChild(li);
    });
}


async function loadActivity() {
    activityList.innerHTML = "";

    const q = query(
        collection(db, "activity"),
        orderBy("time", "desc")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
        const li = document.createElement("li");
        li.textContent = doc.data().action;
        activityList.appendChild(li);
    });
}


loadNotices();
loadActivity();