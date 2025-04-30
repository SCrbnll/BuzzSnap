import { Server } from "socket.io";
import axios from "axios";
import { config } from "dotenv";
config();

const io = new Server();

let connectedUsers = [];

io.on("connection", (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);

  // ➕ Registrar usuario
  socket.on("user_connected", ({ userId, displayName }) => {
    connectedUsers.push({ socketId: socket.id, userId, displayName });
    console.log(`✅ Usuario conectado: ${displayName} (ID: ${userId}, Socket: ${socket.id})`);
    logConnectedUsers();
  });

  // 🧩 Unirse a una sala (chatId)
  socket.on("join_chat", (chatId) => {
    const roomName = `chat_${chatId}`;
    socket.join(roomName);
    console.log(`👥 Socket ${socket.id} se unió a la sala ${roomName}`);
  });

  // 📩 Manejo de mensaje privado
  socket.on("private_message", async ({ sender, chat, group, content, message_type = 'text' }) => {
    try {
      if (!chat && !group) throw new Error("El mensaje debe pertenecer a un chat o grupo.");

      // 🛠️ Formatear sala (usamos sólo chat por ahora)
      const roomName = chat ? `chat_${chat.id}` : null;

      // 🔧 Unirse a sala si no está ya
      if (roomName && !socket.rooms.has(roomName)) {
        socket.join(roomName);
        console.log(`⚙️ Socket ${socket.id} unido automáticamente a ${roomName}`);
      }

      // 🗄️ Guardar mensaje en la base de datos
      const response = await axios.post(`${process.env.API_BASE_URL}/messages`, {
        sender,
        chat,
        group,
        content,
        message_type
      });

      const savedMessage = response.data;

      // 📡 Emitir a todos en la sala
      if (roomName) {
        io.to(roomName).emit("new_private_message", savedMessage);
        console.log(`📨 Mensaje enviado en sala ${roomName} (ID chat: ${chat.id})`);
      }

    } catch (error) {
      console.error("❌ Error al guardar mensaje:", error.response?.data || error.message);
      socket.emit("error_saving_message", { error: error.message });
    }
  });

  // 🔌 Desconexión
  socket.on("disconnect", () => {
    const user = connectedUsers.find(u => u.socketId === socket.id);
    if (user) {
      console.log(`🔴 Usuario desconectado: ${user.displayName} (ID: ${user.userId}, Socket: ${socket.id})`);
      connectedUsers = connectedUsers.filter(u => u.socketId !== socket.id);
    } else {
      console.log(`🔴 Socket desconectado sin usuario registrado: ${socket.id}`);
    }
    logConnectedUsers();
  });
});

io.listen(3000);

// 🧾 Mostrar usuarios conectados
function logConnectedUsers() {
  console.log(`\n👤 Usuarios conectados (${connectedUsers.length}):`);
  connectedUsers.forEach((u) =>
    console.log(` - ${u.displayName} (ID: ${u.userId}, Socket: ${u.socketId})`)
  );
  console.log("====================================\n");
}
