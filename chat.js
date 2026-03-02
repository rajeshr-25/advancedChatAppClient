const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

// WebSocket URL
const WS_URL = `wss://websocketserverlivechat-1.onrender.com?token=${token}`;
let socket = new WebSocket(WS_URL);

// DOM elements
const msgInput = document.getElementById("msgInput");
const messagesDiv = document.getElementById("messages");
const typingDiv = document.getElementById("typing");
const onlineUsersList = document.getElementById("onlineUsers");

socket.onopen = () => console.log("Connected WebSocket");

socket.onmessage = (e) => {
    const data = JSON.parse(e.data);

    // ---- Online Users ----
    if (data.type === "online_users") {
        onlineUsersList.innerHTML = "";
        for (let id in data.users) {
            const li = document.createElement("li");
            li.innerText = data.users[id];
            onlineUsersList.appendChild(li);
        }
    }

    // ---- Message ----
    if (data.type === "message") {
        const div = document.createElement("div");
        div.classList.add("message");

        div.classList.add(
            data.msg.userId === parseJwt(token).userId ? "me" : "other"
        );

        div.innerHTML = `<strong>${data.msg.username}</strong><br>${data.msg.text}`;
        messagesDiv.appendChild(div);

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // ---- Typing ----
    if (data.type === "typing") {
        typingDiv.innerText = `${data.username} is typing...`;
        setTimeout(() => typingDiv.innerText = "", 1000);
    }
};

// Send message
function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;

    socket.send(JSON.stringify({
        type: "message",
        roomId: "global",
        text
    }));

    msgInput.value = "";
}

// Typing indicator
msgInput.addEventListener("input", () => {
    socket.send(JSON.stringify({
        type: "typing",
        roomId: "global"
    }));
});

// Decode JWT
function parseJwt(t) {
    return JSON.parse(atob(t.split('.')[1]));
}