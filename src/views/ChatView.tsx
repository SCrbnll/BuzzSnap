import React, { useEffect, useState } from "react";
import ApiManager from "@/context/apiCalls";
import { Chats, Message } from "@/services/api/types";
import ChatBox from "@/components/chats/ChatBox";
import ChatSidebar from "@/components/chats/ChatSidebar";
import LocalStorageCalls from "@/context/localStorageCalls";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/context/store";
import { setCurrentChatUserId } from "@/context/store";

const ChatView: React.FC = () => {
  const [chats, setChats] = useState<Chats[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  const apiManager = new ApiManager();
  const currentUser = JSON.parse(LocalStorageCalls.getStorageUser() || "{}");

  const dispatch = useDispatch();
  const currentChatUserId = useSelector((state: RootState) => state.app.currentChatUserId);

  const fetchChats = async (userId: number) => {
    try {
      const chatsData = await apiManager.getChatsByUserId(userId);
      setChats(chatsData);
      setLoading(false);

      if (currentChatUserId) {
        const foundChat = chatsData.find((chat) =>
        (chat.user1.id === currentChatUserId || chat.user2.id === currentChatUserId)
        );

        if (foundChat) {
          setActiveChat(foundChat.id);
          fetchMessages(foundChat.id);
          setIsContentVisible(true);
        }
        dispatch(setCurrentChatUserId(null)); 
      }
    } catch (error) {
      console.error("Error al obtener los chats", error);
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      const messagesData = await apiManager.getMessagesByChatId(chatId);
      setMessages(messagesData);
    } catch (error) {
      console.error("Error al obtener los mensajes", error);
    }
  };

  const handleChatClick = (chatId: number) => {
    setActiveChat(chatId);
    fetchMessages(chatId);
    setIsContentVisible(true);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsContentVisible(false);
      setActiveChat(null);
      setMessages([]);
    }
  };

  useEffect(() => {
    const userLocalStorage = LocalStorageCalls.getStorageUser();
    if (userLocalStorage) {
      const userId = JSON.parse(userLocalStorage).id;
      fetchChats(userId);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="d-flex vh-100 gap-3">
      <ChatSidebar
        chats={chats}
        currentUserId={currentUser.id}
        activeChatId={activeChat}
        onChatClick={handleChatClick}
        loading={loading}
      />
      {isContentVisible && (
        <ChatBox messages={messages} currentUserId={currentUser.id} />
      )}
    </div>
  );
};

export default ChatView;
