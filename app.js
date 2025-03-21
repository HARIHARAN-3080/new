// ====== Import Firebase Modules ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// ====== Firebase Configuration ======
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
const database = getDatabase(app);

// ====== DOMContentLoaded to Ensure DOM is Ready ======
document.addEventListener("DOMContentLoaded", function () {
    loadStudentData(); // Automatically load data on page load

    // Add event listener to student form
    const studentForm = document.getElementById("studentForm");
    if (studentForm) {
        studentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await addStudentData();
        });
    }
});

// ====== Show and Close Add Student Form ======
window.showForm = function () {
    const overlay = document.getElementById("popupOverlay");
    const form = document.getElementById("popupForm");

    if (overlay && form) {
        overlay.style.display = "block";
        form.style.display = "block";
    } else {
        console.error("❗️ Popup overlay or form not found.");
    }
};

window.closeForm = function () {
    const overlay = document.getElementById("popupOverlay");
    const form = document.getElementById("popupForm");

    if (overlay && form) {
        overlay.style.display = "none";
        form.style.display = "none";
    } else {
        console.error("❗️ Popup overlay or form not found.");
    }
};

// ====== Add Student Data ======
async function addStudentData() {
    const studentData = {
        name: document.getElementById("studentName").value,
        email: document.getElementById("studentEmail").value,
        registerNumber: document.getElementById("registerNumber").value,
        mobileNumber: document.getElementById("mobileNumber").value,
        nativePlace: document.getElementById("nativePlace").value,
        address: document.getElementById("address").value,
        collegeName: document.getElementById("collegeName").value,
        department: document.getElementById("department").value,
        year: document.getElementById("year").value,
        section: document.getElementById("section").value,
        resumeLink: document.getElementById("resumeLink").value,
    };

    // Validate Form Input
    if (!studentData.name || !studentData.email || !studentData.registerNumber) {
        alert("❗️ Please fill in all required fields.");
        return;
    }

    const department = studentData.department.toLowerCase();
    const year = `year-${studentData.year}`;
    const studentName = studentData.name.replace(/\s+/g, "_").toLowerCase();

    // Path: department/year/students_namelist/student_name/student_data
    const studentRef = ref(database, `department/${department}/${year}/students_namelist/${studentName}/student_data`);

    await set(studentRef, studentData)
        .then(() => {
            alert("✅ Student added successfully!");
            closeForm();
            location.reload();
        })
        .catch((error) => {
            console.error("❗️ Error saving student:", error);
        });
}

// ====== Fetch Student Data for Display ======
window.loadStudentData = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const department = urlParams.get("dept");
    const year = urlParams.get("year");

    if (!department || !year) {
        console.error("❗️ Department or Year missing in URL!");
        return;
    }

    const studentListRef = ref(database, `department/${department}/${year}/students_namelist`);

    get(studentListRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                displayStudentList(snapshot.val());
            } else {
                document.getElementById("studentList").innerHTML = "<p>⚠️ No data available.</p>";
            }
        })
        .catch((error) => {
            console.error("❗️ Error fetching data:", error);
        });
};

// ====== Display Student List ======
function displayStudentList(data) {
    const studentListContainer = document.getElementById("studentList");
    studentListContainer.innerHTML = "";

    if (data) {
        Object.keys(data).forEach((student) => {
            const studentData = data[student]?.student_data || {};
            const studentCard = `
                <div class="student-card" onclick="showStudentProfile('${student}')">
                    <h3>${studentData.name}</h3>
                    <p>${studentData.department} - Year ${studentData.year}</p>
                </div>
            `;
            studentListContainer.innerHTML += studentCard;
        });
    } else {
        studentListContainer.innerHTML = "<p>⚠️ No student data available.</p>";
    }
}

// ====== Show Student Profile on Click ======
window.showStudentProfile = function (student) {
    const urlParams = new URLSearchParams(window.location.search);
    const department = urlParams.get("dept");
    const year = urlParams.get("year");

    const studentRef = ref(database, `department/${department}/${year}/students_namelist/${student}/student_data`);

    get(studentRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                displayProfileDetails(snapshot.val());
            } else {
                alert("⚠️ Student data not found!");
            }
        })
        .catch((error) => {
            console.error("❗️ Error fetching student profile:", error);
        });
};

// ====== Display Profile Details ======
function displayProfileDetails(studentData) {
    const profileDetails = `
        <div class="profile-card">
            <h2>${studentData.name}</h2>
            <p>Email: ${studentData.email}</p>
            <p>Register Number: ${studentData.registerNumber}</p>
            <p>Mobile: ${studentData.mobileNumber}</p>
            <p>Native Place: ${studentData.nativePlace}</p>
            <p>Address: ${studentData.address}</p>
            <p>College: ${studentData.collegeName}</p>
            <p>Department: ${studentData.department}</p>
            <p>Year: ${studentData.year}</p>
            <p>Section: ${studentData.section}</p>
            <p><a href="${studentData.resumeLink}" target="_blank">View Resume</a></p>
        </div>
    `;
    document.getElementById("profileDetails").innerHTML = profileDetails;
}

// ====== Auto Load Student Data on Page Load ======
window.onload = function () {
    loadStudentData();
};
