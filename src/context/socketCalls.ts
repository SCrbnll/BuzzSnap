import { io, Socket } from "socket.io-client";

export default class SocketCalls {
  private static socket: Socket | null = null;
  private static socketUrl: string = import.meta.env.VITE_SOCKET_URL; 

  // Conectar al WebSocket
  static connect(userId: string): void {
    if (!this.socket) {
      this.socket = io(this.socketUrl, {
        transports: ["websocket"],
        query: { userId }, // Pasamos el userId como query
      });

      this.socket.on("connect", () => {
        console.log("Conectado al servidor WebSocket");
      });

      // Manejar mensajes entrantes
      this.socket.on("new_private_message", (message: any) => {
        console.log("Nuevo mensaje recibido:", message);
      });

      this.socket.on("disconnect", () => {
        console.log("Desconectado del servidor WebSocket");
      });
    }
  }

  // Desconectar del WebSocket
  static disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Desconectado del WebSocket");
    }
  }

  // Enviar un mensaje al servidor WebSocket
  static sendMessage(message: any): void {
    if (this.socket) {
      this.socket.emit("private_message", message);
    } else {
      console.error("No se pudo enviar el mensaje. No está conectado al WebSocket.");
    }
  }

  // Escuchar un evento en particular
  static on(event: string, callback: any): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.error("No está conectado al WebSocket.");
    }
  }
}
