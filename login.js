const API_BASE = "https://advancedchatappserver.onrender.com";

async function login() {
    document.getElementById("msg").innerText = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "chat.html";
    } else {
        document.getElementById("msg").innerText = data.msg;
    }
}

async function registerUser() {
    document.getElementById("msg").innerText = "";

    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password })
    });

    const data = await res.json();
    document.getElementById("msg").innerText = data.msg;
}