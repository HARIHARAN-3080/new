// Import Firebase Modules
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
const database = getDatabase(app); // Access Realtime Database

// Modal Functions
const loginModal = document.getElementById("loginModal");

// Open Modal
/*window.openLoginModal = function () {
    loginModal?.classList.add("show");
};*/
const openmode=document.getElementById("loginBtn");
openmode.onclick=()=>{
    document.getElementById("loginform").style.display="block";
}

// Close Modal
/*window.closeLoginModal = function () {
    loginModal?.classList.remove("show");
};*/

const closemode=document.getElementById("logoutbtn");
closemode.onclick=()=>{
    document.getElementById("loginform").style.display="none";
}

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

window.redirectToYear = function (department) {
    localStorage.setItem("selectedDepartment", department);
    window.location.href = `${department}/year.html`;
};

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

// --- Merged Student Portal Code Below ---

// Correct Firebase Reference
const studentsRef = ref(database, "department/year-1/students_namelist");

// Load Students from Firebase
function loadStudents() {
    onValue(studentsRef, (snapshot) => {
        document.getElementById('studentsSection').innerHTML = '<button class="add-student-btn" onclick="showForm()">Add Student</button>';
        if (snapshot.exists()) {
            const students = snapshot.val();
            Object.keys(students).forEach((studentName) => {
                createStudentCard(students[studentName], studentName);
            });
        }
    });
}

// Create Student Card
function createStudentCard(student, studentName) {
    const studentCard = document.createElement('div');
    studentCard.classList.add('student-card');

    const profileImg = document.createElement('img');
    profileImg.src = student.profileImage || 'https://via.placeholder.com/50';
    profileImg.classList.add('profile-img');
    studentCard.appendChild(profileImg);

    const studentNameDiv = document.createElement('div');
    studentNameDiv.textContent = student.name;
    studentCard.appendChild(studentNameDiv);

    studentCard.onclick = function () {
        showProfile(student, studentName);
    };

    document.getElementById('studentsSection').appendChild(studentCard);
}

// Show Student Form
window.showForm = function () {
    document.getElementById('popupForm').style.display = 'flex';
    document.getElementById('popupOverlay').style.display = 'block';
    document.getElementById('studentForm').reset();
}

// Close Form
window.closeForm = function () {
    document.getElementById('popupForm').style.display = 'none';
    document.getElementById('popupOverlay').style.display = 'none';
}

// ✅ Wrap Form Submission Handler in DOMContentLoaded to Prevent Null Errors
document.addEventListener("DOMContentLoaded", function () {
    const studentForm = document.getElementById("studentForm");
    if (studentForm) {
        studentForm.onsubmit = function (e) {
            e.preventDefault();

            const fileInput = document.getElementById('profileImageUpload');
            const reader = new FileReader();

            reader.onload = function (event) {
                const studentName = document.getElementById('studentName').value;
                const studentDataRef = ref(database, `department/year-1/students_namelist/${studentName}`);

                const student = {
                    name: studentName,
                    email: document.getElementById('studentEmail').value,
                    registernumber: document.getElementById('registerNumber').value,
                    mobileNumber: document.getElementById('mobileNumber').value,
                    nativePlace: document.getElementById('nativePlace').value,
                    address: document.getElementById('address').value,
                    collegeName: document.getElementById('collegeName').value,
                    department: document.getElementById('department').value,
                    year: document.getElementById('year').value,
                    section: document.getElementById('section').value,
                    resumeLink: document.getElementById('resumeLink').value,
                    profileImage: event.target.result,
                };

                // Save student data to correct path
                set(studentDataRef, student).then(() => {
                    loadStudents();
                    closeForm();
                });
            };

            reader.readAsDataURL(fileInput.files[0]);
        };
    }
});

// Show Student Profile
window.showProfile = function (student, studentName) {
    document.getElementById('profileDetails').innerHTML = `
        <div class="profile-card">
            <div class="profile-img-frame">
                <img src="${student.profileImage || 'https://via.placeholder.com/100'}" alt="Profile Image">
            </div>
            <h2>${student.name}</h2>
            <div class="profile-info">
                <p><strong>Register Number:</strong> ${student.registernumber}</p>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Mobile Number:</strong> ${student.mobileNumber}</p>
                <p><strong>Native Place:</strong> ${student.nativePlace}</p>
                <p><strong>Address:</strong> ${student.address}</p>
                <p><strong>College:</strong> ${student.collegeName}</p>
                <p><strong>Department:</strong> ${student.department}</p>
                <p><strong>Year:</strong> ${student.year}</p>
                <p><strong>Section:</strong> ${student.section}</p>
                <p><strong>Resume Link:</strong> <a href="${student.resumeLink}" target="_blank">View Resume</a></p>
            </div>
        </div>
    `;
}

// Load Students on Page Load
window.onload = loadStudents;
