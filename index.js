import { Server } from "socket.io";
import axios from "axios";
import { config } from "dotenv";
config();

const io = new Server();

let connectedUsers = [];

io.on("connection", (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);

  // ➕ Registrar usuario
  socket.on("user_connected", async ({ userId, displayName }) => {
    connectedUsers.push({ socketId: socket.id, userId, displayName });
    console.log(`✅ Usuario conectado: ${displayName} (ID: ${userId}, Socket: ${socket.id})`);
    await axios.put(`${process.env.API_BASE_URL}/users/connection/${userId}`, null, { headers: { 'Content-Type': 'application/json' } });
    logConnectedUsers();
  });

  // 🧩 Unirse a una sala (chatId)
  socket.on("join_chat", (chatId) => {
    const roomName = `chat_${chatId}`;
    socket.join(roomName);
    console.log(`👥 Socket ${socket.id} se unió a la sala ${roomName}`);
  });

  // 🧩 Unirse a una sala de grupo
  socket.on("join_group", (groupId) => {
    const roomName = `group_${groupId}`;
    socket.join(roomName);
    console.log(`👥 Socket ${socket.id} se unió al grupo ${roomName}`);
  });

  // 📩 Manejo de mensaje privado
  socket.on("private_message", async ({ sender, chat, group, content, message_type = 'text' }) => {
    try {
      if (!chat) throw new Error("El mensaje debe pertenecer a un chat.");

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

      const recipientId = (chat.user1.id === sender.id) ? chat.user2.id : chat.user1.id;
      const recipientSocket = connectedUsers.find(u => u.userId === recipientId);

      if (recipientSocket) {
        io.to(recipientSocket.socketId).emit("notify_user", {
          recipientId,
          senderId: sender.id,
          chatId: chat.id,
          groupId: null,
          messageId: savedMessage.id,
          senderName: sender.displayName,
          preview: content,
        });
      
        console.log(`🔔 Notificación enviada a usuario ${recipientId} desde ${sender.id} en chat ${chat.id}`);
      }
      

    } catch (error) {
      console.error("❌ Error al guardar mensaje:", error.response?.data || error.message);
      socket.emit("error_saving_message", { error: error.message });
    }
  });

  // 📩 Manejo de mensaje de grupo
  socket.on("group_message", async ({ sender, chat, group, content, message_type = 'text' }) => {
    try {
      if (!group) throw new Error("El mensaje de grupo debe incluir un objeto 'group'.");

      const roomName = `group_${group.id}`;

      if (!socket.rooms.has(roomName)) {
        socket.join(roomName);
        console.log(`⚙️ Socket ${socket.id} unido automáticamente a ${roomName}`);
      }

      // 🗄️ Guardar mensaje en base de datos
      const response = await axios.post(`${process.env.API_BASE_URL}/messages`, {
        sender,
        chat,
        group,
        content,
        message_type,
      });

      const savedMessage = response.data;

      // 📡 Emitir a todos en la sala del grupo
      io.to(roomName).emit("new_group_message", savedMessage);
      console.log(`📨 Mensaje enviado en grupo ${roomName}`);

      const responseGroup = await axios.get(`${process.env.API_BASE_URL}/groupmembers/group/${group.id}`);
      const groupUsers = responseGroup.data; 

      groupUsers.forEach((member) => {
        const user = member.user; 
        if (user.id === sender.id) return;

        const recipientSocket = connectedUsers.find(u => u.userId === user.id);
        if (recipientSocket) {
          io.to(recipientSocket.socketId).emit("notify_user", {
            recipientId: user.id,
            senderId: sender.id,
            chatId: null,
            groupId: group.id,
            messageId: savedMessage.id,
            senderName: sender.displayName,
            preview: content,
          });
          console.log(`🔔 Notificación enviada a usuario ${user.id} en grupo ${group.id}`);
        }
      });
    } catch (error) {
      console.error("❌ Error al guardar mensaje de grupo:", error.response?.data || error.message);
      socket.emit("error_saving_group_message", { error: error.message });
    }
  });


  // 🔌 Desconexión
  socket.on("disconnect", async () => {
    const user = connectedUsers.find(u => u.socketId === socket.id);
    if (user) {
      console.log(`🔴 Usuario desconectado: ${user.displayName} (ID: ${user.userId}, Socket: ${socket.id})`);
      await axios.put(`${process.env.API_BASE_URL}/users/connection/${user.userId}`, new Date(), { headers: { 'Content-Type': 'application/json' } });
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
