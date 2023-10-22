import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { collection, where, query, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


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

// Check email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check password format
function isValidPassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return passwordRegex.test(password);
}

function signUp(event) {
  event.preventDefault();
  console.log("signUp function called");

  const email = String(document.getElementById("registerEmail").value);
  const password = document.getElementById("registerPassword").value;
  const repeatPassword = document.getElementById("repeatPassword").value;
  const name = document.getElementById("registerName").value;
  const username = document.getElementById("registerUsername").value;

  //Check whether all fields are filled
  if (!email || !password || !name || !username) {
      alert("All fields must be filled out!");
      return;
  }

  //Check whether email is valid
  if (!isValidEmail(email)) {
      alert("Invalid email format!");
      return;
  }

  //Check whether passwords match
  if (password !== repeatPassword) {
      alert("Passwords do not match!");
      return;
  }

  //Check whether password is valid
  if (!isValidPassword(password)) {
      alert("Password must contain at least 1 capital letter, 1 digit, and 1 special character!");
      return;
  }

  // Add user details to Firestore
  const userRef = doc(db, 'User_details', username);
  setDoc(userRef, {
      email: email,
      name: name,
      username: username,
      password: password,
      // ... other fields
  })
  .then(() => {
      alert("User registered successfully!");
      switchToLoginTab(); 
  })
  .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
  });
}

async function signIn(event) {
  event.preventDefault();

  const username = document.getElementById("loginName").value;
  const password = document.getElementById("loginPassword").value;
  console.log("signIn function called");

  try {
      // Check if user exists in Firestore
      const q = query(collection(db, 'User_details'), where('username', '==', username), where('password', '==', password));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
          alert("No matching users found.");
          return;
      }
      alert("User signed in successfully!");
      window.location.href = "services.html"; 
  } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("Event listeners attached");

  // Attach event listener for signIn
  const signInButton = document.getElementById("signInBtn");
  if (signInButton) {
    signInButton.addEventListener("click", signIn);
  }

  // Attach event listener for signUp
  const signUpButton = document.getElementById("signUpBtn");
  if (signUpButton) {
    signUpButton.addEventListener("click", signUp);
  }
});

function switchToLoginTab() {
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register"); // Get the register tab
  const registerTabContent = document.getElementById("pills-register");
  const loginTabContent = document.getElementById("pills-login");

  if (loginTab && registerTab) {
      loginTab.classList.add("active");
      registerTab.classList.remove("active"); // Remove active class from register tab
      registerTabContent.classList.remove("show", "active");
      loginTabContent.classList.add("show", "active");
  }
}

