import React from "react";
import { Message } from "@/services/api/types";
import MessageBubble from "@/components/chats/MessageBubble";

interface ChatBoxProps {
  messages: Message[];
  currentUserId: number;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, currentUserId }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    content: {
      width: "80%",
      marginTop: "10px",
      borderRadius: "10px",
      marginBottom: "100px",
      overflowY: "auto",
      scrollbarWidth: "none",
      padding: "20px",
    },
  };

  return (
    <div style={styles.content} className="chat-box">
      {messages.length === 0 ? (
        <p>No hay mensajes</p>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUserId={currentUserId} />
        ))
      )}
    </div>
  );
};

export default ChatBox;
