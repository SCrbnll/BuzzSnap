import React from "react";
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
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
