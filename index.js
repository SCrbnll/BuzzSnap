import { Server } from "socket.io";
import axios from "axios";
import { config } from "dotenv";
import { Resend } from "resend";
config();

const io = new Server({ path: "/socket" });
const resend = new Resend(process.env.RESEND_KEY);
const BACKGROUND_IMAGE = 'https://raw.githubusercontent.com/SCrbnll/BuzzSnap/refs/heads/main/src/assets/images/background.jpg';
const LOGO_IMAGE = 'https://raw.githubusercontent.com/SCrbnll/BuzzSnap/refs/heads/main/public/buzzsnap-logo.png';
const URL_EMAIL = 'http://buzzsnap.samuelcg.com/change-email';
const URL_PASSWORD = 'http://buzzsnap.samuelcg.com/change-password';

let connectedUsers = [];

io.on("connection", (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);

  // ➕ Registrar usuario
  socket.on("user_connected", async ({ token, userId, displayName }) => {
    connectedUsers.push({ socketId: socket.id, userId, displayName });
    console.log(
      `✅ Usuario conectado: ${displayName} (ID: ${userId}, Socket: ${socket.id})`
    );
    await axios.put(
      `${process.env.API_BASE_URL}/users/connection/${userId}`,
      null,
      { headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`} }
    );
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
  socket.on("private_message", async ({ token, sender, chat, group, content, message_type = "text" }) => {
      try {
        if (!chat) throw new Error("El mensaje debe pertenecer a un chat.");

        // 🛠️ Formatear sala (usamos sólo chat por ahora)
        const roomName = chat ? `chat_${chat.id}` : null;

        // 🔧 Unirse a sala si no está ya
        if (roomName && !socket.rooms.has(roomName)) {
          socket.join(roomName);
          console.log(
            `⚙️ Socket ${socket.id} unido automáticamente a ${roomName}`
          );
        }

        // 🗄️ Guardar mensaje en la base de datos
        const response = await axios.post(
          `${process.env.API_BASE_URL}/messages`,
          {
            sender,
            chat,
            group,
            content,
            message_type,
          }, 
          { headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`} }
        );

        const savedMessage = response.data;

        // 📡 Emitir a todos en la sala
        if (roomName) {
          io.to(roomName).emit("new_private_message", savedMessage);
          console.log(
            `📨 Mensaje enviado en sala ${roomName} (ID chat: ${chat.id})`
          );
        }

        const recipientId =
          chat.user1.id === sender.id ? chat.user2.id : chat.user1.id;
        const recipientSocket = connectedUsers.find(
          (u) => u.userId === recipientId
        );

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

          console.log(
            `🔔 Notificación enviada a usuario ${recipientId} desde ${sender.id} en chat ${chat.id}`
          );
        }
      } catch (error) {
        console.error(
          "❌ Error al guardar mensaje:",
          error.response?.data || error.message
        );
        socket.emit("error_saving_message", { error: error.message });
      }
    }
  );

  // 📩 Manejo de mensaje de grupo
  socket.on("group_message", async ({ token, sender, chat, group, content, message_type = "text" }) => {
      try {
        if (!group)
          throw new Error(
            "El mensaje de grupo debe incluir un objeto 'group'."
          );

        const roomName = `group_${group.id}`;

        if (!socket.rooms.has(roomName)) {
          socket.join(roomName);
          console.log(
            `⚙️ Socket ${socket.id} unido automáticamente a ${roomName}`
          );
        }

        // 🗄️ Guardar mensaje en base de datos
        const response = await axios.post(
          `${process.env.API_BASE_URL}/messages`,
          {
            sender,
            chat,
            group,
            content,
            message_type,
          }, 
          { headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`} }
        );

        const savedMessage = response.data;

        // 📡 Emitir a todos en la sala del grupo
        io.to(roomName).emit("new_group_message", savedMessage);
        console.log(`📨 Mensaje enviado en grupo ${roomName}`);

        const responseGroup = await axios.get(
          `${process.env.API_BASE_URL}/groupmembers/group/${group.id}`, 
          { headers: { "Content-Type": "application/json" , "Authorization": `Bearer ${token}`} }
        );
        const groupUsers = responseGroup.data;

        groupUsers.forEach((member) => {
          const user = member.user;
          if (user.id === sender.id) return;

          const recipientSocket = connectedUsers.find(
            (u) => u.userId === user.id
          );
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
            console.log(
              `🔔 Notificación enviada a usuario ${user.id} en grupo ${group.id}`
            );
          }
        });
      } catch (error) {
        console.error(
          "❌ Error al guardar mensaje de grupo:",
          error.response?.data || error.message
        );
        socket.emit("error_saving_group_message", { error: error.message });
      }
    }
  );

  socket.on("trigger_update", () => {
    io.emit("sync_data_notify");
  });

  // 🔌 Desconexión
  socket.on("disconnect", async () => {
    const user = connectedUsers.find((u) => u.socketId === socket.id);
    if (user) {
      console.log(
        `🔴 Usuario desconectado: ${user.displayName} (ID: ${user.userId}, Socket: ${socket.id})`
      );
      await axios.put(
        `${process.env.API_BASE_URL}/users/connection/${user.userId}`,
        new Date(),
        { headers: { "Content-Type": "application/json" } }
      );
      connectedUsers = connectedUsers.filter((u) => u.socketId !== socket.id);
    } else {
      console.log(
        `🔴 Socket desconectado sin usuario registrado: ${socket.id}`
      );
    }
    logConnectedUsers();
  });

  socket.on("send_email_change", async ({ email, username }) => {
    try {
      const html = emailResetEmailBody(username);
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Buzzsnap: Cambiar dirección de correo",
        html,
      });

      console.log(`✅ Email de cambio de correo enviado a ${email}`);
      socket.emit("email_change_sent", { success: true });
    } catch (error) {
      console.error("❌ Error al enviar email de cambio de correo:", error);
      socket.emit("email_change_sent", {
        success: false,
        error: error.message,
      });
    }
  });

  socket.on("send_password_reset", async ({ email, username }) => {
    try {
      const html = passwordResetEmailBody(username);
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Buzzsnap: Restablecer contraseña",
        html,
      });

      console.log(
        `✅ Email de restablecimiento de contraseña enviado a ${email}`
      );
      socket.emit("password_reset_sent", { success: true });
    } catch (error) {
      console.error("❌ Error al enviar email de contraseña:", error);
      socket.emit("password_reset_sent", {
        success: false,
        error: error.message,
      });
    }
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

function emailResetEmailBody(username) {
  return `
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image: url('${BACKGROUND_IMAGE}'); background-size: cover; background-position: center; padding: 40px 0;">
            <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif; color: #e2e2e2; border-radius: 20px;">
                <tr>
                    <td align="center" style="padding: 20px;">
                    <img src="${LOGO_IMAGE}" alt="Buzzsnap Logo" style="max-width: 200px; height: auto;" />
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 30px 20px 30px; font-size: 16px; line-height: 1.5;">
                    <p>
                        Se ha solicitado cambiar su dirección de correo electrónico asociada a la cuenta <strong>@${username}</strong>. Si esta acción la ha solicitado usted como propietario de la cuenta, haga clic en el botón de abajo para proceder con el cambio.
                    </p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding-bottom: 30px;">
                    <a href="${URL_EMAIL}" target="_blank" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                        Cambiar dirección de correo
                    </a>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        `;
}

function passwordResetEmailBody(username) {
  return `
        <table width="100%" cellpadding="0" cellspacing="0" border="0"style="background-image: url('${BACKGROUND_IMAGE}'); background-size: cover; background-position: center; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif; color: #e2e2e2; border-radius: 20px;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                                <img src="${LOGO_IMAGE}" alt="Buzzsnap Logo" style="max-width: 200px; height: auto;" />
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 30px 20px 30px; font-size: 16px; line-height: 1.5;">
                                <p>
                                    Se ha solicitado restablecer la contraseña de la cuenta asociada al usuario <strong>@${username}</strong>. 
                                    Si usted ha solicitado este cambio, haga clic en el botón de abajo para crear una nueva contraseña.
                                    <br><br>
                                    Si no ha sido usted, puede ignorar este mensaje de forma segura.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding-bottom: 30px;">
                                <a href="${URL_PASSWORD}" target="_blank" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                                    Restablecer contraseña
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `;
}
