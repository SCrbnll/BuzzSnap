import React, { useState } from "react";
import UserInfoModal from "@/components/users/UserInfoModal";

interface Props {
  message: any;
  currentUserId: number;
}

const MessageBubble: React.FC<Props> = ({ message, currentUserId }) => {
  const isSender = message.sender.id === currentUserId;
  const [showModal, setShowModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const createdAt = new Date(message.createdAt);
  const now = new Date();

  const isSameDay =
    createdAt.getFullYear() === now.getFullYear() &&
    createdAt.getMonth() === now.getMonth() &&
    createdAt.getDate() === now.getDate();

  const formattedTime = isSameDay
    ? createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : createdAt.toLocaleString([], {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
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
      position: "relative",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      cursor: isSender ? "default" : "pointer",
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
      maxWidth: "300px",
      margin: "5px 0",
    },
    time: {
      fontSize: "0.75rem",
      color: "#000000",
    },
    tooltip: {
      position: "absolute",
      top: "-10px",
      left: isSender ? "auto" : "50px",
      right: isSender ? "50px" : "auto",
      backgroundColor: "#000",
      border: "1px solid #ccc",
      padding: "5px 10px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer",
      zIndex: 10,
      whiteSpace: "nowrap",
      fontSize: "0.8rem",
    },
  };

  const handleAvatarClick = () => {
    if (!isSender) setShowModal(true);
  };

  return (
    <div style={styles.wrapper}>
      <div style={{ position: "relative" }}>
        {!isSender && showTooltip && (
          <div style={styles.tooltip} onClick={handleAvatarClick}>
            Ver perfil de {message.sender.displayName}
          </div>
        )}
        <img
          src={message.sender.avatarUrl}
          alt={message.sender.displayName}
          style={styles.avatar}
          onClick={handleAvatarClick}
          onMouseEnter={() => !isSender && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
      </div>

      <div style={styles.bubbleWrapper}>
        <strong style={styles.displayName}>{message.sender.displayName}</strong>
        <div style={styles.bubble} className="chat-box-message">
          <p style={styles.content}>{message.content}</p>
          <small style={styles.time}>{formattedTime}</small>
        </div>
      </div>

      {showModal && (
        <UserInfoModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          user={{ ...message.sender, avatarUrl: message.sender.avatarUrl! }}
          onSendMessage={() => {}}
          onDeleteClick={() => {}}
        />
      )}
    </div>
  );
};

export default MessageBubble;
