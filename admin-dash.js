import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Not logged in");
        window.location.href = "adminlog.html";
        return;
    }


    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || userSnap.data().role !== "admin") {
        alert("Access Denied");
        window.location.href = "student-dash.html";
        return;
    }

    const postBtn = document.getElementById("postNoticeBtn");
    const noticeTitle = document.getElementById("noticeTitle");
    const noticeMsg = document.getElementById("noticeMsg");
    const noticeList = document.getElementById("noticeList");
    const activityList = document.getElementById("activitylist");


    noticeList.style.maxHeight = "260px";
    noticeList.style.overflowY = "auto";

    activityList.style.maxHeight = "260px";
    activityList.style.overflowY = "auto";


    postBtn.addEventListener("click", async () => {
        if (!noticeTitle.value || !noticeMsg.value) {
            alert("Fill all fields");
            return;
        }

        await addDoc(collection(db, "notices"), {
            title: noticeTitle.value,
            message: noticeMsg.value,
            postedBy: user.uid,
            time: serverTimestamp()
        });

        await addDoc(collection(db, "activity"), {
            action: "Admin posted a notice",
            time: serverTimestamp()
        });

        await addDoc(collection(db, "notifications"), {
            type: "notice",
            title: noticeTitle.value,
            time: serverTimestamp()
        });

        noticeTitle.value = "";
        noticeMsg.value = "";

        loadNotices();
        loadActivity();
    });


    async function loadNotices() {
        noticeList.innerHTML = "";

        const q = query(collection(db, "notices"), orderBy("time", "desc"));
        const snap = await getDocs(q);

        snap.forEach(d => {
            const li = document.createElement("li");

            li.innerHTML = `
        <b>${d.data().title}</b><br>
        ${d.data().message}<br>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
        <hr>
      `;


            li.querySelector(".edit").style.width = "70px";
            li.querySelector(".delete").style.width = "70px";
            li.querySelector(".edit").style.marginleft = "50px";


            li.querySelector(".delete").onclick = async () => {
                await deleteDoc(doc(db, "notices", d.id));
                loadNotices();
            };


            li.querySelector(".edit").onclick = async () => {
                const newTitle = prompt("Edit title", d.data().title);
                const newMsg = prompt("Edit message", d.data().message);
                if (!newTitle || !newMsg) return;

                await updateDoc(doc(db, "notices", d.id), {
                    title: newTitle,
                    message: newMsg,
                    time: serverTimestamp()
                });

                loadNotices();
            };

            noticeList.appendChild(li);
        });
    }


    async function loadActivity() {
        activityList.innerHTML = "";

        const q = query(collection(db, "activity"), orderBy("time", "desc"));
        const snap = await getDocs(q);

        snap.forEach(d => {
            const li = document.createElement("li");
            li.textContent = d.data().action;
            activityList.appendChild(li);
        });
    }


    loadNotices();
    loadActivity();
});