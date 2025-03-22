import FriendCard from "@/components/friends/FriendCard";
import UserInfoModal from "@/components/users/UserInfoModal";
import { AppDispatch, RootState, syncAllData } from "@/context/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ContactView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const friends = useSelector((state: RootState) => state.app.friends);

  const [activeFilter, setActiveFilter] = useState<string>("activos");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);


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

  const handleOpenModal = (friend: any) => {
    setSelectedUser(friend.friend);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

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
      width: "100px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
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
            className={`button ${activeFilter === "activos" ? "button-active-filter" : ""}`}
            style={styles.button}
            onClick={() => setActiveFilter("activos")}
          >
            Activos
          </button>
          <button
            className={`button ${activeFilter === "todos" ? "button-active-filter" : ""}`}
            style={styles.button}
            onClick={() => setActiveFilter("todos")}
          >
            Todos
          </button>
          <button
            className={`button ${activeFilter === "solicitudes" ? "button-active-filter" : ""}`}
            style={styles.button}
            onClick={() => setActiveFilter("solicitudes")}
          >
            Solicitudes
          </button>
        </div>

        <button className="button" style={{ ...styles.button, ...styles.addButton }}>
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
                activeFilter !== "solicitudes" ? () => handleOpenModal(friend) : undefined
              }
              onSendMessage={
                activeFilter !== "solicitudes" ? () => alert("Enviar mensaje") : undefined
              }
            />
          ))}
        </div>
      </div>
      {selectedUser && (
        <UserInfoModal
          show={modalOpen}
          handleClose={handleCloseModal}
          user={selectedUser}
          onSendMessage={() => alert(`Enviar mensaje a ${selectedUser.name}`)}
          onRequestClick={() => alert(`Solicitar conexión con ${selectedUser.name}`)}
          onDeleteClick={() => alert(`Eliminar a ${selectedUser.name}`)}
        />
      )}
    </div>
  );
};

export default ContactView;
