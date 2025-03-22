//Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

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
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");
    const loginModal = document.getElementById("loginModal");
    const logoutBtn = document.getElementById("logoutbtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            console.log("Login button clicked");
            loginModal?.classList.add("show");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            console.log("Logout button clicked");
            loginModal?.classList.remove("show");
        });
    }
});

// Firebase Login Function
window.login = function () {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const message = document.getElementById("message");

    if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                message.innerHTML = "Login successful! Redirecting...";
                message.className = "message success show";
                setTimeout(() => {
                    window.location.href = "dept.html";
                }, 1500);
            })
            .catch(() => {
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
    document.getElementById("dropdownContent")?.classList.toggle("show");
};

window.onclick = function (event) {
    if (!event.target.matches(".profile-img")) {
        document.querySelectorAll(".dropdown-content.show").forEach((dropdown) => {
            dropdown.classList.remove("show");
        });
    }
};

// Year Selection Functions
window.redirectToYear = function (department) {
    localStorage.setItem("selectedDepartment", department);
    window.location.href = `${department}/year.html`;
};

window.selectYear = function (year) {
    const selectedDept = localStorage.getItem("selectedDepartment");
    if (selectedDept) {
        window.location.href = `../studentportal.html?dept=${selectedDept}&year=${year}`;
    } else {
        alert("Please select a department first!");
    }
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".year-btn").forEach((button) => {
        button.addEventListener("click", function () {
            selectYear(this.getAttribute("data-year"));
        });
    });
});

// Load Students from Firebase
window.loadStudents = function () {
    const selectedDept = localStorage.getItem("selectedDepartment");
    const selectedYear = localStorage.getItem("selectedYear");
    if (!selectedDept || !selectedYear) return;
    
    const studentsRef = ref(database, `departments/${selectedDept}/year-${selectedYear}/students_namelist`);
    
    onValue(studentsRef, (snapshot) => {
        document.getElementById('studentsSection').innerHTML = '<button class="add-student-btn" onclick="showForm()">Add Student</button>';
        if (snapshot.exists()) {
            Object.entries(snapshot.val()).forEach(([key, student]) => createStudentCard(student, key));
        }
    });
};

function createStudentCard(student, studentName) {
    const studentCard = document.createElement('div');
    studentCard.classList.add('student-card');
    studentCard.innerHTML = `
        <img src="${student.profileImage || 'https://via.placeholder.com/50'}" class="profile-img" />
        <div>${student.name}</div>
    `;
    studentCard.onclick = () => showProfile(student, studentName);
    document.getElementById('studentsSection').appendChild(studentCard);
}

window.showForm = function () {
    document.getElementById('popupForm').style.display = 'flex';
    document.getElementById('popupOverlay').style.display = 'block';
    document.getElementById('studentForm').reset();
}

window.closeForm = function () {
    document.getElementById('popupForm').style.display = 'none';
    document.getElementById('popupOverlay').style.display = 'none';
}

document.getElementById('studentForm').onsubmit = function (e) {
    e.preventDefault();
    const fileInput = document.getElementById('profileImageUpload');
    const reader = new FileReader();

    reader.onload = function (event) {
        const studentName = document.getElementById('studentName').value;
        const selectedDept = document.getElementById('department').value;
        const selectedYear = document.getElementById('year').value;
        const studentRef = ref(database, `departments/${selectedDept}/year-${selectedYear}/students_namelist/${studentName}`);

        const student = {
            name: studentName,
            email: document.getElementById('studentEmail').value,
            registernumber: document.getElementById('registerNumber').value,
            mobileNumber: document.getElementById('mobileNumber').value,
            nativePlace: document.getElementById('nativePlace').value,
            address: document.getElementById('address').value,
            collegeName: document.getElementById('collegeName').value,
            department: selectedDept,
            year: selectedYear,
            section: document.getElementById('section').value,
            resumeLink: document.getElementById('resumeLink').value,
            profileImage: event.target.result,
        };

        set(studentRef, student).then(() => {
            loadStudents();
            closeForm();
        });
    };

    reader.readAsDataURL(fileInput.files[0]);
}

window.onload = loadStudents;



