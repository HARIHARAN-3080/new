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
    const dropdown = document.getElementById("dropdownMenu");
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

// Department Navigation Function
window.navigateToYear = function (department) {
    // Save department to localStorage
    localStorage.setItem("selectedDepartment", department);
    // Redirect to year.html
    location.href = "year.html";
};

// ✅ New Function: Navigate to Student Portal with Department & Year
window.navigateToStudentPage = function (year) {
    const selectedDept = localStorage.getItem("selectedDepartment");
    if (selectedDept) {
        window.location.href = `studentportal.html?dept=${selectedDept}&year=${year}`;
    } else {
        alert("Please select a department first!");
    }
};

// Fetch department data from Firebase
window.fetchDepartmentData = function (department, year) {
    const dbRef = ref(database, `department/${department}/${year}/students_namelist`);

    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(`Data for ${department} - ${year}`, snapshot.val());
                displayStudentList(snapshot.val()); // Display data on the page
            } else {
                console.log(`No data found for ${department} - ${year}`);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
};

// Display Student List Function
function displayStudentList(data) {
    const studentListContainer = document.getElementById("studentList");
    if (studentListContainer) {
        studentListContainer.innerHTML = "";

        if (data) {
            Object.keys(data).forEach((student) => {
                const studentData = data[student].student_data || {};
                const studentCard = `
                    <div class="student-card">
                        <h3>${student}</h3>
                        <p>Roll No: ${studentData.roll_no || "N/A"}</p>
                        <p>Department: ${studentData.department || "N/A"}</p>
                        <p>Year: ${studentData.year || "N/A"}</p>
                    </div>
                `;
                studentListContainer.innerHTML += studentCard;
            });
        } else {
            studentListContainer.innerHTML = "<p>No student data available.</p>";
        }
    }
}

// ✅ New Feature: Navigate to Year Page for Specific Department
window.redirectToYear = function (department) {
    localStorage.setItem("selectedDepartment", department);
    window.location.href = `../${department}/year.html`;
};

// ✅ Handle Year Page Button Clicks to Navigate to Student Page
document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("click", function () {
        const year = this.getAttribute("data-year");
        navigateToStudentPage(year);
    });
});

// Open Login Modal when Login Button is Clicked
document.getElementById("loginBtn")?.addEventListener("click", openLoginModal);

// Close Modal when Close Button is Clicked
document.getElementById("closeModal")?.addEventListener("click", closeLoginModal);

// Login on Submit Button Click
document.getElementById("loginSubmit")?.addEventListener("click", login);
