import { io, Socket } from "socket.io-client";
import { Message } from "@/services/api/types";
import LocalStorageCalls from "./localStorageCalls";

export default class SocketCalls {
  private static socket: Socket | null = null;
  private static socketUrl: string = import.meta.env.VITE_SOCKET_URL;
  private static token: string = LocalStorageCalls.getAccessToken()!;

  // Conectar al WebSocket
  static connect(userId: number, displayName: string): void {
    if (!this.socket) {
      this.socket = io(this.socketUrl, {
        transports: ["websocket"],
        path: "/socket",
      });

      this.socket.on("connect", () => {
        console.log("✅ Conectado al WebSocket");
        this.socket?.emit("user_connected", { token: this.token, userId, displayName: displayName }); // Emitimos user conectado
      });

      this.socket.on("disconnect", () => {
        console.log("🔌 Desconectado del WebSocket");
      });

      this.socket.on("connect_error", (err) => {
        console.error("Error al conectar con el WebSocket:", err);
      });
    }
  }

  // Desconectar del WebSocket
  static disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("🔌 Socket desconectado manualmente");
    }
  }

  // Enviar un mensaje al servidor WebSocket
  static sendPrivateMessage(message: Message): void {
    if (this.socket) {
      this.socket.emit("private_message", {
        token: this.token,
        ...message,
        message_type: message.message_type || "text",
      });
    } else {
      console.error("❌ No conectado al WebSocket.");
    }
  }

  // Enviar un mensaje al servidor WebSocket
  static sendGroupMessage(message: Message): void {
    if (this.socket) {
      this.socket.emit("group_message", {
        token: this.token,
        ...message,
        message_type: message.message_type || "text",
      });
    } else {
      console.error("❌ No conectado al WebSocket.");
    }
  }

  static joinChat(chatId: number): void {
    if (this.socket) {
      this.socket.emit("join_chat", chatId);
    }
  }

  static joinGroup(chatId: number): void {
    if (this.socket) {
      this.socket.emit("join_group", chatId);
    }
  }

  static syncData(): void {
    if (this.socket) {
      this.socket.emit("trigger_update");
    }
  }

  static sendEmailChange(email: string, username: string) {
    if (this.socket) {
      this.socket.emit("send_email_change", { email, username });
    }
  }

  static sendPasswordChange(email: string, username: string) {
    if (this.socket) {
      this.socket.emit("send_password_reset", { email, username });
    }
  }

  // Escuchar un evento específico (ej. "new_private_message")
  static on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.error("❌ No conectado al WebSocket.");
    }
  }

  // Dejar de escuchar un evento (opcional, para limpieza)
  static off(event: string): void {
    this.socket?.off(event);
  }
}
