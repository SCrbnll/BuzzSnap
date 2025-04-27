import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/services/api/types";
import MessageBubble from "@/components/chats/MessageBubble";
import SocketCalls from "@/context/socketCalls";
import ApiManager from "@/context/apiCalls";

interface ChatBoxProps {
  messages: Message[];
  currentUserId: number;
  chatId: number | null;
  groupId: number | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, currentUserId, chatId, groupId }) => {
  const [messageTerm, setMessageTerm] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const apiCalls = new ApiManager();

  const handleSend = async () => {
    const sender = await apiCalls.getUser(currentUserId);
    let group
    let chat
    if(chatId === null){
      group = await apiCalls.getGroup(groupId!);
    } else {
      chat = await apiCalls.getChatById(chatId!);
    }

    if (!messageTerm.trim()) return;
    console.log("Enviando mensaje:", messageTerm);
     const message = {
      sender: sender,
      chat: chat,
      group: group,
      content: messageTerm,
    };

    // Enviar el mensaje al servidor
    // apiCalls.addMessage(message);

    // Usar SocketCalls para enviar el mensaje
    SocketCalls.sendMessage(message); // Enviar el mensaje

    // Limpiar el campo de entrada
    setMessageTerm("");
  };

  useEffect(() => {
    if (containerRef.current) {
      const c = containerRef.current;
      c.scrollTo({
        top: c.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      width: "80%",
      margin: "10px auto",
      display: "flex",
      flexDirection: "column",
      height: "calc(100% - 100px)", 
      overflow: "hidden",
    },
    messagesContainer: {
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      scrollbarWidth: "thin",
    },
    inputContainer: {
      padding: "10px 20px",
      borderTop: "1px solid #ccc",
    },
    input: {
      width: "100%",
      padding: "10px 15px",
      borderRadius: "50px",
      border: "1px solid #ccc",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box",
    },
  };

  return (
    <div style={styles.wrapper} className="chat-box">
      <div style={styles.messagesContainer} ref={containerRef}>
        {messages.length === 0 ? (
          <p>No hay mensajes</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              currentUserId={currentUserId}
            />
          ))
        )}
        <div />
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={messageTerm}
          onChange={(e) => setMessageTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={styles.input}
          className="chat-box-input-text"
        />
      </div>
    </div>
  );
};

export default ChatBox;
