// ====== Import Firebase Modules ======
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// ====== Firebase Configuration ======
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ====== DOM Ready ======
document.addEventListener("DOMContentLoaded", function () {
    loadStudentData();
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
    document.getElementById("popupOverlay").style.display = "block";
    document.getElementById("popupForm").style.display = "block";
};

window.closeForm = function () {
    document.getElementById("popupOverlay").style.display = "none";
    document.getElementById("popupForm").style.display = "none";
};

// ====== Add Student Data ======
async function addStudentData() {
    const studentData = {
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("studentEmail").value.trim(),
        registerNumber: document.getElementById("registerNumber").value.trim(),
        mobileNumber: document.getElementById("mobileNumber").value.trim(),
        nativePlace: document.getElementById("nativePlace").value.trim(),
        address: document.getElementById("address").value.trim(),
        collegeName: document.getElementById("collegeName").value.trim(),
        department: document.getElementById("department").value.trim().toLowerCase(),
        year: `year-${document.getElementById("year").value.trim()}`,
        section: document.getElementById("section").value.trim(),
        resumeLink: document.getElementById("resumeLink").value.trim()
    };

    if (!studentData.name || !studentData.email || !studentData.registerNumber) {
        alert("❗️ Please fill in all required fields.");
        return;
    }

    const studentName = studentData.name.replace(/\s+/g, "_").toLowerCase();
    const studentRef = ref(database, `department/${studentData.department}/${studentData.year}/students_namelist/${studentName}/student_data`);

    try {
        await set(studentRef, studentData);
        alert("✅ Student added successfully!");
        closeForm();
        loadStudentData();
    } catch (error) {
        console.error("❗️ Error saving student:", error);
    }
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
