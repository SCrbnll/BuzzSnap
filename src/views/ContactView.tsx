import FriendCard from "@/components/friends/FriendCard";
import { AppDispatch, RootState, syncAllData } from "@/context/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ContactView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const friends = useSelector((state: RootState) => state.app.friends);

  const [activeFilter, setActiveFilter] = useState<string>("activos");

  useEffect(() => {
    dispatch(syncAllData());
  }, [dispatch]);

  const filteredFriends = friends.filter((friend) => {
    switch (activeFilter) {
      case "activos":
        return friend.friend.lastLogin === null && friend.status === "accepted";
      case "todos":
        return friend.status === "accepted"; 
      case "solicitudes":
        return friend.status === "pending"; 
      default:
        return true;
    }
  });

  const styles: { [key: string]: React.CSSProperties } = {
    separator: {
      width: "100%",
      margin: "15px auto",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: "0 10px",
      marginTop: "50px",
    },
    button: {
      backgroundColor: "#ccc",
      width: "100px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
    },
    buttonActive: {
      backgroundColor: "#FFA600",
    },
    buttonsContainer: {
      display: "flex",
      flex: 1,
      gap: "10px",
    },
    addButton: {
      marginLeft: "auto",
    },
    contentWrapper: {
      flex: 1,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      paddingRight: "10px",
      maxHeight: "750px",
      position: "relative",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      padding: "0 10px",
    },
  };

  return (
    <div style={{ padding: "0 40px" }}>
      <nav style={styles.nav} className="d-flex flex-row align-items-center">
        <div style={styles.buttonsContainer}>
          <button
            style={{
              ...styles.button,
              ...(activeFilter === "activos" ? styles.buttonActive : {}),
            }}
            onClick={() => setActiveFilter("activos")}
          >
            Activos
          </button>
          <button
            style={{
              ...styles.button,
              ...(activeFilter === "todos" ? styles.buttonActive : {}),
            }}
            onClick={() => setActiveFilter("todos")}
          >
            Todos
          </button>
          <button
            style={{
              ...styles.button,
              ...(activeFilter === "solicitudes" ? styles.buttonActive : {}),
            }}
            onClick={() => setActiveFilter("solicitudes")}
          >
            Solicitudes
          </button>
        </div>
        <button style={{ ...styles.button, ...styles.addButton }}>
          Añadir
        </button>
      </nav>
      <hr style={styles.separator} />

      <div style={styles.contentWrapper} className="contentWrapper">
        <div style={styles.content}>
          {filteredFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              isActive={!friend.friend.lastLogin}
              onDeleteClick={
                activeFilter === "solicitudes" ? () => alert("Eliminar solicitud") : undefined
              }
              onOptionsClick={
                activeFilter !== "solicitudes" ? () => alert("Opciones") : undefined
              }
              onSendMessage={
                activeFilter !== "solicitudes" ? () => alert("Enviar mensaje") : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactView;
