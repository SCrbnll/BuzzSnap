import React, { useRef, useEffect, useState } from "react";
import { Chats } from "@/services/api/types";
import logo from "/SCrbnll.png";
import UserInfoModal from "../users/UserInfoModal";

type Props = {
  chat: Chats;
  currentUserId: number;
  isActive: boolean;
  onClick: () => void;
  menuOpen: boolean;
  menuX: number;
  menuY: number;
  onOpenMenu: (x: number, y: number) => void;
  onCloseMenu: () => void;
};

const ChatListItem: React.FC<Props> = ({
  chat,
  currentUserId,
  isActive,
  onClick,
  menuOpen,
  menuX,
  menuY,
  onOpenMenu,
  onCloseMenu,
}) => {
  const otherUser = chat.user1.id === currentUserId ? chat.user2 : chat.user1;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onCloseMenu();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onCloseMenu]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenMenu(e.clientX, e.clientY);
  };

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
     menu: {
      position: "fixed" as "fixed",
      top: menuY,
      left: menuX,
      backgroundColor: "#000",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      zIndex: 10,
      border: "1px solid #ccc",
      padding: "8px 10px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      fontSize: "0.8rem",
    },
    menuItem: {
      padding: "8px 12px",
      cursor: "pointer",
      whiteSpace: "nowrap" as "nowrap",
    },
  };

  return (
    <>
      <div
        ref={wrapperRef}
        style={styles.chat}
        className={`mb-3 gap-3 chat-card ${isActive ? "active" : ""}`}
        onClick={onClick}
        onContextMenu={handleContextMenu}
      >
        <img src={logo} alt={otherUser.name} style={styles.logo} />
        <p style={styles.chatText}>{otherUser.name}</p>
      </div>

      {menuOpen && (
        <div style={styles.menu}>
          <div className="menu-item"
            onClick={() => {
              setShowModal(true);
              onCloseMenu();
            }}
          >
            Ver perfil de {otherUser.displayName}
          </div>
        </div>
      )}

    {showModal && (
        <UserInfoModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          user={{
            avatarUrl: otherUser.avatarUrl!,
            name: otherUser.displayName,
            email: otherUser.email,
            lastLogin: otherUser.lastLogin!,
            createdAt: otherUser.createdAt,
            description: otherUser.description,
          }}
          onSendMessage={() => {}}
          onDeleteClick={() => {}}
        />
      )}
    </>
  );
};

export default ChatListItem;
