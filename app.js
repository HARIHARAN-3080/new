// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJZYPHzaWbQm328L8SXDzvH52X5XB-vJw",
    authDomain: "signin-5a455.firebaseapp.com",
    projectId: "signin-5a455",
    storageBucket: "signin-5a455.appspot.com",
    messagingSenderId: "605090661173",
    appId: "1:605090661173:web:123456abcd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Use this to access Realtime Database

// Modal Functions
const loginModal = document.getElementById("loginModal");

// Open Modal
window.openLoginModal = function () {
    loginModal.classList.add("show");
};

// Close Modal
window.closeLoginModal = function () {
    loginModal.classList.remove("show");
};

// Firebase Login Function
window.login = function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            message.innerHTML = "Login successful! Redirecting...";
            message.className = "message success show";
            setTimeout(() => {
                window.location.href = "dept.html"; // Redirect after successful login
            }, 1500);
        })
        .catch((error) => {
            message.innerHTML = "Invalid email or password!";
            message.className = "message error show";
        });
};

// Department Navigation Function
window.navigateToYear = function (department) {
    // Redirect to the selected department's year page
    location.href = `year-${department}.html`;
};

// Fetch department data from Firebase
window.fetchDepartmentData = function (department, year) {
    const dbRef = ref(database, `department/${department}/${year}/students_namelist`);
    
    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(`Data for ${department} - ${year}`, snapshot.val());
            } else {
                console.log(`No data found for ${department} - ${year}`);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
};
