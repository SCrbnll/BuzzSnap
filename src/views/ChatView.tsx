import React, { useEffect, useState } from "react";
import ApiManager from "@/context/apiCalls";
import { Chats, Message } from "@/services/api/types";
import ChatBox from "@/components/chats/ChatBox";
import ChatSidebar from "@/components/chats/ChatSidebar";

const ChatView: React.FC = () => {
  const [chats, setChats] = useState<Chats[]>([]); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeChat, setActiveChat] = useState<number | null>(null);  
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);  

  const apiManager = new ApiManager(); 
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}"); 

  const fetchChats = async (userId: number) => {
    try {
      const chatsData = await apiManager.getChatsByUserId(userId); 
      setChats(chatsData);  
      setLoading(false); 
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

  useEffect(() => {
    const userLocalStorage = localStorage.getItem("user");
    if (userLocalStorage) {
      const userId = JSON.parse(userLocalStorage).id;
      fetchChats(userId); 
    }
  }, []);
  
  const handleChatClick = (chatId: number) => {
    setActiveChat(chatId); 
    fetchMessages(chatId)
    setIsContentVisible(true); 
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsContentVisible(false);
      setActiveChat(null); 
 
    }
  };

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
