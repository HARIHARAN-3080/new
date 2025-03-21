// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase Configuration

const firebaseConfig = {
    apiKey: "AIzaSyDJZYPHzaWbQm328L8SXDzvH52X5XB-vJw",
    authDomain: "signin-5a455.firebaseapp.com",
    projectId: "signin-5a455",
    storageBucket: "signin-5a455.firebasestorage.app",
    messagingSenderId: "330194380982",
    appId: "1:330194380982:web:9d5b942421760a6c8f1e17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Access Realtime Database

// Modal Functions
const loginModal = document.getElementById("loginModal");

// Open Modal
window.openLoginModal = function () {
    loginModal?.classList.add("show");
};

// Close Modal
window.closeLoginModal = function () {
    loginModal?.classList.remove("show");
};

// Firebase Login Function
window.login = function () {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const message = document.getElementById("message");

    if (email && password) {
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
    } else {
        message.innerHTML = "Please enter email and password.";
        message.className = "message error show";
    }
};

// Profile Dropdown
window.toggleProfileDropdown = function () {
    const dropdown = document.getElementById("dropdownContent");
    dropdown?.classList.toggle("show");
};

// Close dropdown when clicking outside
window.onclick = function (event) {
    if (!event.target.matches(".profile-img")) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains("show")) {
                dropdowns[i].classList.remove("show");
            }
        }
    }
};

// ✅ Navigate to Year Page for Specific Department
window.redirectToYear = function (department) {
    localStorage.setItem("selectedDepartment", department);
    window.location.href = `../${department}/year.html`;
};

// ✅ Corrected: Handle Year Button Clicks Properly
document.querySelectorAll(".year-btn").forEach((button) => {
    button.addEventListener("click", function () {
        const year = this.getAttribute("data-year");
        navigateToStudentPage(year);
    });
});

// Handle Year Selection in year.html
window.selectYear = function (year) {
    const selectedDept = localStorage.getItem("selectedDepartment");
    if (selectedDept) {
        window.location.href = `../studentportal.html?dept=${selectedDept}&year=${year}`;
    } else {
        alert("Please select a department first!");
    }
};

// ✅ Add Event Listeners for Year Buttons Only on year.html
if (document.querySelectorAll(".year-btn").length > 0) {
    document.querySelectorAll(".year-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const year = this.getAttribute("data-year");
            selectYear(year);
        });
    });
}

// Open Login Modal when Login Button is Clicked
document.getElementById("loginBtn")?.addEventListener("click", openLoginModal);

// Close Modal when Close Button is Clicked
document.getElementById("closeModal")?.addEventListener("click", closeLoginModal);

// Login on Submit Button Click
document.getElementById("loginSubmit")?.addEventListener("click", login);
