/* DEFAULT ADMIN */
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([
        { email: "admin@campusiq.com", password: "admin123", role: "admin" }
    ]));
}

let users = JSON.parse(localStorage.getItem("users"));
let students = JSON.parse(localStorage.getItem("students")) || [];
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
let issues = JSON.parse(localStorage.getItem("issues")) || [];

let chartInstance = null;

/* AUTH */
function signup() {
    const email = signupUser.value;
    const pass = signupPass.value;
    const role = signupRole.value;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) return alert("Invalid email");
    if (users.some(u => u.email === email)) return alert("User exists");

    users.push({ email, password: pass, role });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created");
    signupUser.value = signupPass.value = "";
}

function login() {
    const user = users.find(u => u.email === loginUser.value && u.password === loginPass.value);
    if (!user) return alert("Invalid credentials");

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location = "dashboard.html";
}

function togglePassword(id) {
    const f = document.getElementById(id);
    f.type = f.type === "password" ? "text" : "password";
}

function toggleForgot() {
    forgotBox.classList.toggle("hidden");
}

function resetPassword() {
    const user = users.find(u => u.email === forgotEmail.value);
    if (!user) return alert("Email not found");
    user.password = "123456";
    localStorage.setItem("users", JSON.stringify(users));
    alert("Password reset to 123456");
}

/* DASHBOARD */
function initDashboard() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return window.location = "index.html";

    if (user.role !== "admin") {
        const um = document.getElementById("usersMenu");
        if (um) um.style.display = "none";
    }

    loadCounts();
    renderChart();
    renderStudentTable();
    renderUsers();
}

function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

function addStudent() {
    students.push({
        name: sname.value,
        dept: dept.value,
        year: year.value
    });
    localStorage.setItem("students", JSON.stringify(students));

    sname.value = dept.value = year.value = "";
    loadCounts();
    renderChart();
    renderStudentTable();
}

function renderStudentTable() {
    const body = document.getElementById("studentTableBody");
    if (!body) return;

    body.innerHTML = "";
    students.forEach((s, i) => {
        body.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${s.name}</td>
                <td>${s.dept}</td>
                <td>${s.year}</td>
            </tr>`;
    });
}

function addFeedback() {
    feedbacks.push(feedbackInput.value);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    feedbackInput.value = "";
    loadCounts();
    renderChart();
}

function addIssue() {
    issues.push(issueInput.value);
    localStorage.setItem("issues", JSON.stringify(issues));
    issueInput.value = "";
    loadCounts();
    renderChart();
}

function renderUsers() {
    if (!userList) return;
    userList.innerHTML = "";
    users.forEach(u => userList.innerHTML += `<li>${u.email} (${u.role})</li>`);
}

function loadCounts() {
    sc.innerText = students.length;
    fc.innerText = feedbacks.length;
    ic.innerText = issues.length;
}

function renderChart() {
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(chart, {
        type: "bar",
        data: {
            labels: ["Students", "Feedback", "Issues"],
            datasets: [{
                data: [students.length, feedbacks.length, issues.length],
                backgroundColor: ["#2c7be5", "#00b894", "#e17055"]
            }]
        }
    });
}

function toggleDark() {
    document.documentElement.classList.toggle("dark");
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location = "index.html";
}
