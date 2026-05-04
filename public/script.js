const API = "/users";

const form = document.getElementById("userForm");
const userList = document.getElementById("userList");
const alertBox = document.getElementById("alertBox");
const loader = document.getElementById("loader");

function showLoader(show) {
    loader.classList.toggle("hidden", !show);
}

function showAlert(message, type = "success") {
    alertBox.innerHTML = `<div class="alert ${type}">${message}</div>`;
    setTimeout(() => alertBox.innerHTML = "", 3000);
}

async function fetchUsers() {
    showLoader(true);
    const res = await fetch(API);
    const users = await res.json();
    showLoader(false);

    userList.innerHTML = "";

    users.forEach(user => {
        const card = document.createElement("div");
        card.className = "user-card";

        card.innerHTML = `
            <div class="user-info">
                <strong>${user.first_name} ${user.last_name}</strong><br>
                ${user.email}<br>
                ${user.gender}<br>
                ${user.job_title || "N/A"}
            </div>
            <div class="actions">
                <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;

        userList.appendChild(card);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("userId").value;
    const data = {
        first_name: first_name.value.trim(),
        last_name: last_name.value.trim(),
        email: email.value.trim(),
        gender: gender.value.trim(),
        job_title: job_title.value.trim()
    };

    if (!data.first_name || !data.last_name || !data.email) {
        return showAlert("Please fill required fields", "error");
    }

    showLoader(true);

    if (id) {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        showAlert("User updated successfully");
    } else {
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        showAlert("User created successfully");
    }

    form.reset();
    document.getElementById("userId").value = "";
    fetchUsers();
});

async function editUser(id) {
    const res = await fetch(`${API}/${id}`);
    const user = await res.json();

    document.getElementById("userId").value = user.id;
    first_name.value = user.first_name;
    last_name.value = user.last_name;
    email.value = user.email;
    gender.value = user.gender;
    job_title.value = user.job_title;
}

async function deleteUser(id) {
    if (!confirm("Are you sure?")) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    showAlert("User deleted successfully");
    fetchUsers();
}

fetchUsers();