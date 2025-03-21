// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// ====== Firebase Configuration ======
const firebaseConfig = {
    apiKey: "AIzaSyDJZYPHzaWbQm328L8SXDzvH52X5XB-vJw",
    authDomain: "signin-5a455.firebaseapp.com",
    projectId: "signin-5a455",
    storageBucket: "signin-5a455.appspot.com",
    messagingSenderId: "605090661173",
    appId: "1:605090661173:web:123456abcd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ====== Modal Functions ======
// Open Login Modal
window.openLoginModal = function () {
    const modal = document.getElementById("loginModal");
    if (modal) {
        modal.classList.add("show");
    }
};

// Close Login Modal
window.closeLoginModal = function () {
    const modal = document.getElementById("loginModal");
    if (modal) {
        modal.classList.remove("show");
    }
};

// ====== Firebase Login Function ======
window.login = function () {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const message = document.getElementById("message");

    if (!email || !password) {
        if (message) {
            message.innerHTML = "❗️ Please enter email and password!";
            message.className = "message error show";
        }
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if (message) {
                message.innerHTML = "✅ Login successful! Redirecting...";
                message.className = "message success show";
            }
            localStorage.setItem("isLoggedIn", "true"); // Store login status

            setTimeout(() => {
                window.location.href = "dept.html"; // Redirect after successful login
            }, 1500);
        })
        .catch((error) => {
            if (message) {
                message.innerHTML = "❌ Invalid email or password!";
                message.className = "message error show";
            }
        });
};

// ====== Profile Dropdown ======
window.toggleProfileDropdown = function () {
    const dropdown = document.getElementById("dropdownContent");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
};

// Close Dropdown when clicking outside
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

// ====== Department Navigation Function ======
window.navigateToYear = function (department) {
    if (department) {
        localStorage.setItem("selectedDepartment", department); // Save selected department
        window.location.href = `year.html?dept=${department}`; // Redirect to year selection page
    } else {
        alert("❗️ Please select a department first!");
    }
};

// ====== Year Navigation to Student List ======
window.navigateToStudentPage = function (year) {
    const department = localStorage.getItem("selectedDepartment");
    if (department) {
        window.location.href = `studentportal.html?dept=${department}&year=${year}`;
    } else {
        alert("❗️ Please select a department first before choosing a year!");
    }
};

// ====== Fetch Student Data from Firebase ======
window.fetchDepartmentData = function (department, year) {
    const dbRef = ref(database, `department/${department}/${year}/students_namelist`);

    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                displayStudentList(snapshot.val()); // Display data if available
            } else {
                document.getElementById("studentList").innerHTML = "<p>⚠️ No data available.</p>";
            }
        })
        .catch((error) => {
            console.error("❗️ Error fetching data:", error);
        });
};

// ====== Display Student List Function ======
function displayStudentList(data) {
    const studentListContainer = document.getElementById("studentList");
    studentListContainer.innerHTML = "";

    if (data) {
        Object.keys(data).forEach((student) => {
            const studentData = data[student]?.student_data || {};
            const studentCard = `
                <div class="student-card">
                    <h3>${student}</h3>
                    <p>Roll No: ${studentData?.roll_no || "N/A"}</p>
                    <p>Department: ${studentData?.department || "N/A"}</p>
                    <p>Year: ${studentData?.year || "N/A"}</p>
                </div>
            `;
            studentListContainer.innerHTML += studentCard;
        });
    } else {
        studentListContainer.innerHTML = "<p>⚠️ No student data available.</p>";
    }
}

// ====== Auto Open Modal when Login Button is Clicked ======
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", openLoginModal);
}

// ====== Close Modal when Close Button is Clicked ======
const closeModalBtn = document.getElementById("closeModal");
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeLoginModal);
}

// ====== Login on Submit Button Click ======
const loginSubmitBtn = document.getElementById("loginSubmit");
if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", login);
}
