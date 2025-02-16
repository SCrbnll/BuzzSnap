import React from "react";
import logo from "/SCrbnll.png";

const ChatView: React.FC = () => {
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
      backgroundColor: "#8A8A8A",
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
          {[...Array(14)].map((_, i) => (
            <div key={i} style={styles.chat} className="mb-3 gap-3">
              <img src={logo} alt="Icono" style={styles.logo} />
              <p style={styles.chatText}>test</p>
            </div>
          ))}
        </div>
      </aside>

      <div style={styles.content}>
        <p>Contenido aquí</p>
      </div>
    </div>
  );
};

export default ChatView;
