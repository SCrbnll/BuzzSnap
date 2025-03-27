import React, { useEffect, useState } from "react";
import logo from "/SCrbnll.png";
import ApiManager from "@/context/apiCalls";
import { Chats } from "@/services/api/types";

const ChatView: React.FC = () => {
  const [chats, setChats] = useState<Chats[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [activeChat, setActiveChat] = useState<number | null>(null);  
  const [isContentVisible, setIsContentVisible] = useState<boolean>(false);  

  const apiManager = new ApiManager();  

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

  useEffect(() => {
    const userLocalStorage = localStorage.getItem("user");
    if (userLocalStorage) {
      const userId = JSON.parse(userLocalStorage).id;
      fetchChats(userId); 
    }
  }, []);

  const handleChatClick = (chatId: number) => {
    setActiveChat(chatId); 
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

  const styles: { [key: string]: React.CSSProperties } = {
    aside: {
      width: "325px",
    },
    logo: {
      width: "35px",
      borderRadius: "50%",
    },
    chatList: {
      padding: "10px 0px 0px 30px",
      overflowY: "auto",
      marginBottom: "100px",
      scrollbarWidth: "none",
    },
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
    content: {
      width: "80%",
      marginTop: "10px",
      borderRadius: "10px",
      marginBottom: "100px",
      backgroundColor: "#8A8A8A",
    },
  };

  return (
    <div className="d-flex vh-100 gap-3">
      <aside style={styles.aside} className="d-flex flex-column vh-100">
      <div style={styles.chatList}>
          {loading ? (
            <p>Cargando chats...</p>  
          ) : (
            chats.map((chat) => {
              const otherUser = JSON.parse(localStorage.getItem("user")!).id === chat.user1.id
                ? chat.user2
                : chat.user1;

              const isActive = activeChat === chat.id ? "active" : ""; 

              return (
                <div
                  key={chat.id}
                  style={styles.chat}
                  className={`mb-3 gap-3 chat-card ${isActive}`} 
                  onClick={() => handleChatClick(chat.id)} 
                >
                  <img src={logo} alt="Icono" style={styles.logo} />
                  <p style={styles.chatText}>{otherUser.name}</p> 
                </div>
              );
            })
          )}
        </div>
      </aside>

      {isContentVisible && (
        <div style={styles.content}>
          <p>Contenido aquí</p>
        </div>
      )}
    </div>
  );
};

export default ChatView;
