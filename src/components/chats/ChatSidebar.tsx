import React, { useState } from "react";
import ChatListItem from "./ChatListItem";
import { Chats } from "@/services/api/types";

type Props = {
  chats: Chats[];
  currentUserId: number;
  activeChatId: number | null;
  onChatClick: (chatId: number) => void;
  loading: boolean;
};

const ChatSidebar: React.FC<Props> = ({
  chats,
  currentUserId,
  activeChatId,
  onChatClick,
  loading,
}) => {
  const [menuState, setMenuState] = useState<{
    chatId: number | null;
    x: number;
    y: number;
  }>({ chatId: null, x: 0, y: 0 });

  const handleOpenMenu = (chatId: number, x: number, y: number) => {
    setMenuState({ chatId, x, y });
  };

  const handleCloseMenu = () => {
    setMenuState({ chatId: null, x: 0, y: 0 });
  };

  const styles: { [key: string]: React.CSSProperties } = {
    aside: {
      width: "325px",
    },
    chatList: {
      padding: "10px 0px 0px 30px",
      overflowY: "auto",
      marginBottom: "100px",
      scrollbarWidth: "none",
    },
  };

  return (
    <aside style={styles.aside} className="d-flex flex-column vh-100">
      <div style={styles.chatList}>
        {loading ? (
          <p>Cargando chats...</p>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              currentUserId={currentUserId}
              isActive={chat.id === activeChatId}
              onClick={() => onChatClick(chat.id)}
              menuOpen={menuState.chatId === chat.id}
              menuX={menuState.x}
              menuY={menuState.y}
              onOpenMenu={(x: number, y: number) => handleOpenMenu(chat.id, x, y)}
              onCloseMenu={handleCloseMenu}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
