import { io, Socket } from "socket.io-client";
import { Message } from "@/services/api/types";

export default class SocketCalls {
  private static socket: Socket | null = null;
  private static socketUrl: string = import.meta.env.VITE_SOCKET_URL;

  // Conectar al WebSocket
  static connect(userId: number, displayName: string): void {
    if (!this.socket) {
      this.socket = io(this.socketUrl, {
        transports: ["websocket"],
      });

      this.socket.on("connect", () => {
        console.log("✅ Conectado al WebSocket");
        this.socket?.emit("user_connected", { userId, displayName: displayName }); // Emitimos user conectado
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
