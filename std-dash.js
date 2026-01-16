import { auth, db } from "./firebase.js";
import { onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let usernameSet = false;
let lastSeenNoticeTime = localStorage.getItem("lastSeenNoticeTime");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "portal.html";
        return;
    }

    if (!usernameSet) {
        const username = user.email.split("@")[0];
        document.querySelector(".username h1").innerText =
            `Welcome, ${username}`;
        usernameSet = true;
    }

    loadNotice();
});

function loadNotice() {
    const noticeText = document.getElementById("notice-text");
    const indicator = document.getElementById("notice-indicator");

    const q = query(
        collection(db, "notices"),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            noticeText.innerText = "No notice available";
            indicator.style.display = "none";
            return;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        const noticeTime = data.createdAt?.seconds;

        noticeText.innerHTML = `
          <strong>${data.title}</strong><br>
          ${data.msg}
        `;


        if (!lastSeenNoticeTime || noticeTime > lastSeenNoticeTime) {
            indicator.style.display = "inline";
        } else {
            indicator.style.display = "none";
        }


        noticeText.onclick = () => {
            localStorage.setItem("lastSeenNoticeTime", noticeTime);
            indicator.style.display = "none";
            lastSeenNoticeTime = noticeTime;
        };
    });
}