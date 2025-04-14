import React from "react";
import { Message } from "@/services/api/types";

interface Props {
  message: Message;
  currentUserId: number;
}

const MessageBubble: React.FC<Props> = ({ message, currentUserId }) => {
  const isSender = message.sender.id === currentUserId;

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const styles: { [key: string]: React.CSSProperties } = {
    wrapper: {
      display: "flex",
      flexDirection: isSender ? "row-reverse" : "row",
      alignItems: "flex-start",
      marginBottom: "15px",
      gap: "15px", 
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
    },
    bubbleWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: isSender ? "flex-end" : "flex-start",
      maxWidth: "500px",
    },
    displayName: {
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "#888",
      marginBottom: "3px",
      textAlign: isSender ? "right" : "left",
      width: "100%",
    },
    bubble: {
      padding: "10px",
      borderRadius: "15px",
      textAlign: "left",
      wordWrap: "break-word",
      maxWidth: "100%",
    },
    content: {
      margin: "5px 0",
    },
    time: {
      fontSize: "0.75rem",
      color: "#000000",
    },
  };

  return (
    <div style={styles.wrapper}>
      <img
        src={message.sender.avatarUrl}
        alt={message.sender.displayName}
        style={styles.avatar}
      />

      <div style={styles.bubbleWrapper}>
        <strong style={styles.displayName}>{message.sender.displayName}</strong>
        <div style={styles.bubble} className="chat-box-message">
          <p style={styles.content}>{message.content}</p>
          <small style={styles.time}>{formattedTime}</small>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
