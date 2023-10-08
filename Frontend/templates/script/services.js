// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


// Set up your event listeners
document.addEventListener("DOMContentLoaded", function () {
    let buttons = document.querySelectorAll(".toggle-button");
    buttons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            buttons.forEach((btn) => btn.classList.remove("selected-service"));
            this.classList.add("selected-service");

            const selectedService = this.textContent.trim();
            findMatchingUsers(selectedService);
        });
    });
});

function findMatchingUsers(service) {
    db.collection("users")
        .where("User_details.Type of service", "==", service)
        .where("user_type", "==", "service provider")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

