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
        });
    });

    // Add event listener to the "NEXT" button
    let nextButton = document.querySelector(".next-button");
    nextButton.addEventListener("click", function(event) {
        event.preventDefault();
        let selectedButton = document.querySelector(".selected-service");
        if (selectedButton) {
            const selectedService = selectedButton.textContent.trim();
            console.log("Selected Service:", selectedService);
            findMatchingUsers(selectedService);
        } else {
            console.log("No service selected.");
        }
    });
});

// timer
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
// Find Matching Service Providers
function findMatchingUsers(service) {
    const q = query(
        collection(db, "users"),
        where("User_details.Type of service", "==", service),
        where("user_type", "==", "service provider")
    );

    getDocs(q)
        .then((querySnapshot) => {
            let results = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                let serviceProviderName = data.name; // Assuming 'name' is the field for the service provider's name
                let serviceProviderEmail = data.email;
                let result = {
                    "service_provider_name": serviceProviderName,
                    "service_requested": service,
                    "email": serviceProviderEmail,
                    "time": "",
                    "location": "(1.385782, 103.8800001)",
                    "picture": ""
                };
                results.push(result);
            });
            console.log(results); // This will log the array of JSON objects
            // If you want to use this data in another JS file, you can set it to a global variable or use other methods like LocalStorage, etc.
            window.serviceProviderData = results; // Setting to a global variable
            localStorage.setItem('serviceProviderData', JSON.stringify(results));
            sleep(2500).then(() => { window.location.href = "request"; });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}