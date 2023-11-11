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

function isValidName(name) {
  const nameRegex = /^[A-Za-z\s]+$/;
  return nameRegex.test(name);
}


function isValidUserName(username) {
  // Regular expression to check for at least one alphabet and one number
  const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
  return usernameRegex.test(username);
}


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

// Sign up function
async function signUp(event) {
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

  //Check whether name is valid
  if (!isValidName(name)) {
    alert("Invalid name format!");
    return;
  }

  //Check whether username is valid
  if (!isValidUserName(username)) {
    alert("Invalid username format!");
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
      alert("Invalid password format!");
      return;
  }

  // Check if email or username already exists
  const emailQuery = query(collection(db, 'User_details'), where('email', '==', email));
  const usernameQuery = query(collection(db, 'User_details'), where('username', '==', username));

  const emailSnapshot = await getDocs(emailQuery);
  const usernameSnapshot = await getDocs(usernameQuery);

  if (!usernameSnapshot.empty) {
    alert("Username already exists!");
    return;
}

  if (!emailSnapshot.empty) {
      alert("Email already exists!");
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

// Check whether user details exist in Firestore
async function signIn(event) {
  event.preventDefault();

  const username = document.getElementById("loginName").value;
  const password = document.getElementById("loginPassword").value;
  console.log("signIn function called");

  if (!password || !username) {
    alert("All fields must be filled out!");
    return;
  }

  try {
      // Check if username exists in Firestore
      const usernameQuery = query(collection(db, 'User_details'), where('username', '==', username));
      const usernameSnapshot = await getDocs(usernameQuery);

      if (usernameSnapshot.empty) {
          alert("Invalid username.");
          return;
      }

      // Check if password matches the one associated with the username
      const passwordQuery = query(collection(db, 'User_details'), where('username', '==', username), where('password', '==', password));
      const passwordSnapshot = await getDocs(passwordQuery);

      if (passwordSnapshot.empty) {
          alert("Invalid password!");
          return;
      }

      alert("User signed in successfully!");
      window.location.href = "/services"; 
  } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
  }
}

// Event listeners for whether buttons are clicked
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

// Switch from register to login tab
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

