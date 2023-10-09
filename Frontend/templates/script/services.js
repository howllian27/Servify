import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { collection, where, query, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBqszrUVSBQ0wJjWzJ6xgUmDcZ18e5SLRc",
  authDomain: "servify-7779b.firebaseapp.com",
  projectId: "servify-7779b",
  storageBucket: "servify-7779b.appspot.com",
  messagingSenderId: "783072685791",
  appId: "1:783072685791:web:8d537a12658e8cbbe0036a",
  measurementId: "G-F2CTVEC3QV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


// Set up your event listeners
document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".toggle-button");
    buttons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            buttons.forEach((btn) => btn.classList.remove("selected-service"));
            this.classList.add("selected-service");

            const selectedService = this.textContent.trim();
            console.log("Selected Service:", selectedService);

            findMatchingUsers(selectedService);
        });
    });
});

function findMatchingUsers(service) {
    const q = query(
        collection(db, "users"),
        where("User_details.Type of service", "==", service),
        where("user_type", "==", "service provider")
    );

    getDocs(q)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}
