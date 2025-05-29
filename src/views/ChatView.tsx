import React, { useEffect, useState } from "react";
import ApiManager from "@/context/apiCalls";
import { Chats, Message } from "@/services/api/types";
import ChatBox from "@/components/chats/ChatBox";
import ChatSidebar from "@/components/chats/ChatSidebar";
import LocalStorageCalls from "@/context/localStorageCalls";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState, syncAllData } from "@/context/store";
import { setCurrentChatUserId } from "@/context/store";
import { notifyError } from "@/components/NotificationProvider";
import SocketCalls from "@/context/socketCalls";
import TokenUtils from "@/utils/TokenUtils";


const ChatView: React.FC = () => {
  const [chats, setChats] = useState<Chats[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);

  const apiManager = new ApiManager();
  const storedUser = LocalStorageCalls.getStorageUser();
  const data = storedUser ? TokenUtils.decodeToken(storedUser) : null;  
  const currentUser = TokenUtils.mapJwtPayloadToUser(data!); 

  const dispatch = useDispatch<AppDispatch>();
  const currentChatUserId = useSelector((state: RootState) => state.app.currentChatUserId);
  const lastSyncedAt = useSelector((state: RootState) => state.app.lastSyncedAt);

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
          LocalStorageCalls.setActiveChatId(foundChat.id.toString());
        } 
        dispatch(setCurrentChatUserId(null)); 
      }
    } catch (error) {
      notifyError("Error al obtener los chats");
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      const messagesData = await apiManager.getMessagesByChatId(chatId);
      setMessages(messagesData);
    } catch (error) {
      notifyError("Error al obtener los mensajes");
    }
  };

  const handleChatClick = (chatId: number) => {
    setActiveChat(chatId);
    fetchMessages(chatId);
    SocketCalls.joinChat(chatId);
    setIsContentVisible(true);
    LocalStorageCalls.setActiveChatId(chatId.toString());

  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsContentVisible(false);
      LocalStorageCalls.removeActiveChatId();
      setActiveChat(null);
      setMessages([]);
    }
  };

   useEffect(() => {
      dispatch(syncAllData());
    }, [dispatch]);

    useEffect(() => {
    if (lastSyncedAt && chats.length > 0) {
      fetchChats(currentUser.id); 
    }
  }, [lastSyncedAt]);

  useEffect(() => {
    const storedUser = LocalStorageCalls.getStorageUser();
    const data = storedUser ? TokenUtils.decodeToken(storedUser) : null;  
    const currentUser = TokenUtils.mapJwtPayloadToUser(data!); 
    if (currentUser) {
      const userId = currentUser.id;
      fetchChats(userId);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    SocketCalls.connect(currentUser.id, currentUser.displayName);

    SocketCalls.on("new_private_message", async (newMessageId: number) => {
      try {
        const messageResponse = await apiManager.getMessage(newMessageId);
        const newMessage = messageResponse;
    
        if (newMessage.chat?.id === activeChat) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } 
      } catch (error) {
        console.error("Error al obtener el mensaje completo:", error);
      }
    });
    return () => {
      SocketCalls.off("new_private_message");
    };
  }, [activeChat, currentUser?.id]);
  
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
        <ChatBox 
          messages={messages} 
          currentUserId={currentUser.id} 
          chatId={activeChat} 
          groupId={null} 
        />
      )}
    </div>
  );
};

export default ChatView;
