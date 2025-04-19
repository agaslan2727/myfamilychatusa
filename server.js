const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));

const mutedUsers = new Set();
const bannedUsers = new Set();

io.on("connection", (socket) => {
  console.log("Yeni kullanıcı bağlandı");

  socket.on("join room", (room) => {
    socket.join(room);
  });

  socket.on("chat message", (msg) => {
    if (bannedUsers.has(msg.userKey)) {
      socket.emit("chat message", {
        html: `<div class="message"><div class="text" style="background-color:#333;">❌ Sohbetten banlandınız.</div></div>`
      });
      return;
    }

    if (mutedUsers.has(msg.userKey)) {
      socket.emit("chat message", {
        html: `<div class="message"><div class="text" style="background-color:#666;">🔇 Susturuldunuz, mesaj gönderemezsiniz.</div></div>`
      });
      return;
    }

    if (msg.room) {
      io.to(msg.room).emit("chat message", msg);
    } else {
      io.emit("chat message", msg);
    }
  });

  socket.on("mute user", (userKey) => {
    mutedUsers.add(userKey);
    console.log(`${userKey} susturuldu`);
  });

  socket.on("ban user", (userKey) => {
    bannedUsers.add(userKey);
    console.log(`${userKey} banlandı`);
    socket.disconnect(true);
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı");
  });
});

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
