import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getDatabase, ref, runTransaction } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCkp2U4ZVKiWTpQB-KQlCSsYzat3x8Ixmc",
    authDomain: "servify-clicks.firebaseapp.com",
    databaseURL: "https://servify-clicks-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "servify-clicks",
    storageBucket: "servify-clicks.appspot.com",
    messagingSenderId: "520072688967",
    appId: "1:520072688967:web:86991d7762dfc0e05a0862",
    measurementId: "G-GZBVJC33KP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase initialized:", app);
// Reference to Firebase Realtime Database
var database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
    const serviceRequested = localStorage.getItem('serviceRequested');
    const timing = localStorage.getItem('timing');
    const location = localStorage.getItem('location');

    if (serviceRequested && timing && location) {
        document.querySelector("h3:nth-child(2)").textContent = "Service Requested: " + serviceRequested;
        document.querySelector("h3:nth-child(3)").textContent = "Timing: " + timing;
        document.querySelector("h3:nth-child(4)").textContent = "Location: " + location;
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Accept button
    const acceptButton = document.querySelector(".accept-req a.btn:nth-child(1)");
    if (!acceptButton) {
        console.error("Accept button not found!");
        return;
    }
    acceptButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default action
        console.log("Accept button clicked!"); // Log to console
        registerClick("accepted");
    });

    // Decline button
    const declineButton = document.querySelector(".accept-req a.btn:nth-child(2)");
    if (!declineButton) {
        console.error("Decline button not found!");
        return;
    }
    declineButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default action
        console.log("Decline button clicked!"); // Log to console
        registerClick("declined");
    });
});

function registerClick(action) {
    console.log(`Registering click for action: ${action}`); // Log to console
    const responsesRef = ref(database, 'responses/' + action);
    runTransaction(responsesRef, (currentData) => {
        return (currentData || 0) + 1;
    }).then((result) => {
        if (result.committed) {
            console.log('Transaction committed with value:', result.snapshot.val());
        } else {
            console.log('Transaction not committed.');
        }
    }).catch((error) => {
        console.error('Transaction failed:', error);
    });
}