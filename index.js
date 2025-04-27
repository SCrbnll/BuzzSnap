import { Server } from "socket.io";
import axios from "axios";
import { config } from "dotenv";
config();

const io = new Server();

// Lista de usuarios conectados (socketId <=> userId)
let connectedUsers = [];

// Chats activos (podrías mapear chatId a sockets participantes si quieres)
let privateChats = [];


io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  // ➡️ Cuando un usuario inicia sesión
  socket.on("user_connected", (userId) => {
    connectedUsers.push({ socketId: socket.id, userId });
    console.log(`Usuario ${userId} conectado con socket ${socket.id}`);
  });

  // ➡️ Cuando un usuario envía un mensaje privado
  socket.on("private_message", async ({ chatId, senderId, receiverId, content, messageType }) => {
    try {
      // Llamada a tu API REST para guardar el mensaje
      const response = await axios.post(`${process.env.API_BASE_URL}/messages`, {
        senderId,
        chatId,
        receiverId, // opcional si lo necesitas en tu API
        content,
        messageType,
      });

      const savedMessage = response.data; // Suponiendo que la API te devuelve el mensaje guardado

      console.log(`Mensaje guardado a través de API. ID: ${savedMessage.id}`);

      // Emitir el mensaje al receptor si está conectado
      const receiver = connectedUsers.find((u) => u.userId === receiverId);
      if (receiver) {
        io.to(receiver.socketId).emit("new_private_message", savedMessage);
      }

      // Emitir también al emisor
      socket.emit("new_private_message", savedMessage);

    } catch (error) {
      console.error("Error al guardar mensaje vía API:", error.response?.data || error.message);
      socket.emit("error_saving_message", { error: error.message });
    }
  });

  // ➡️ Cuando un usuario se desconecta
  socket.on("disconnect", () => {
    connectedUsers = connectedUsers.filter(u => u.socketId !== socket.id);
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

io.listen(3000);
