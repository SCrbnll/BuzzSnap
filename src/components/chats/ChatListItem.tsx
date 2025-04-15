import React from "react";
import { Chats } from "@/services/api/types";
import logo from "/SCrbnll.png";

type Props = {
  chat: Chats;
  currentUserId: number;
  isActive: boolean;
  onClick: () => void;
};

const ChatListItem: React.FC<Props> = ({
  chat,
  currentUserId,
  isActive,
  onClick,
}) => {
  const otherUser =
    chat.user1.id === currentUserId ? chat.user2 : chat.user1;

  const styles: { [key: string]: React.CSSProperties } = {
    chat: {
      padding: "10px",
      cursor: "pointer",
      borderRadius: "10px",
      paddingLeft: "20px",
      display: "flex",
      alignItems: "center",
    },
    chatText: {
      margin: 0,
      flex: 1,
    },
    logo: {
      width: "35px",
      borderRadius: "50%",
    },
  };

  return (
    <div
      style={styles.chat}
      className={`mb-3 gap-3 chat-card ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <img src={logo} alt="Icono" style={styles.logo} />
      <p style={styles.chatText}>{otherUser.name}</p>
    </div>
  );
};

export default ChatListItem;
