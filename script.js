const emoji = new EmojiConvertor();
emoji.replace_mode = 'unified';
emoji.allow_native = true;

const adminUsers = ["user1"];

const users = {
  user1: {
    name: "💙 Kullanıcı1",
    avatar: "https://i.pravatar.cc/36?img=1",
    color: "#2196f3"
  },
  user2: {
    name: "💚 Kullanıcı2",
    avatar: "https://i.pravatar.cc/36?img=2",
    color: "#4caf50"
  },
  user3: {
    name: "💖 Kullanıcı3",
    avatar: "https://i.pravatar.cc/36?img=3",
    color: "#e91e63"
  }
};

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const chatBox = document.getElementById("chat-box");
  const userKey = document.getElementById("username").value;
  const room = document.getElementById("room").value;
  const message = messageInput.value.trim();
  const sound = document.getElementById("messageSound");

  if (message === "") return;

  const user = users[userKey];
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const parsedMessage = emoji.replace_colons(message);
  const isAdmin = adminUsers.includes(userKey);

  const messageHTML = `
    <div class="message" data-user="${userKey}">
      <img src="${user.avatar}" class="avatar" />
      <div class="text" style="background-color:${user.color}">
        ${parsedMessage}
        <div class="meta">${user.name} • ${time}</div>
        ${isAdmin ? `
          <div class="admin-actions">
            <button onclick="muteUser('${userKey}')">🔇 Sustur</button>
            <button onclick="banUser('${userKey}')">🚫 Banla</button>
            <button onclick="deleteOwnMessage(this)">❌ Sil</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  socket.emit("chat message", {
    html: messageHTML,
    userKey: userKey,
    room: room
  });

  messageInput.value = "";
  sound.play();
}

function receiveMessage(data) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += data.html;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function muteUser(userKey) {
  socket.emit("mute user", userKey);
}

function banUser(userKey) {
  socket.emit("ban user", userKey);
}

function deleteOwnMessage(button) {
  const messageDiv = button.closest(".message");
  if (messageDiv) messageDiv.remove();
}

let isMusicPlaying = false;
function toggleMusic() {
  const music = document.getElementById("bgMusic");
  isMusicPlaying ? music.pause() : music.play();
  isMusicPlaying = !isMusicPlaying;
}

// Oda dinleme
window.addEventListener("load", () => {
  const room = document.getElementById("room").value;
  socket.emit("join room", room);
});

document.getElementById("room").addEventListener("change", () => {
  const room = document.getElementById("room").value;
  socket.emit("join room", room);
  document.getElementById("chat-box").innerHTML = ""; // oda değişince mesajları temizle
});
 messageDiv.remove();
}