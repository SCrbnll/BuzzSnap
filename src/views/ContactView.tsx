import FriendCard from "@/components/friends/FriendCard";
import UserInfoModal from "@/components/users/UserInfoModal";
import ApiManager from "@/context/apiCalls";
import { AppDispatch, RootState, syncAllData } from "@/context/store";
import { Friend } from "@/services/api/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ContactView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const friends = useSelector((state: RootState) => state.app.friends);
  const apiCalls = new ApiManager();

  const [activeFilter, setActiveFilter] = useState<string>("activos");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    dispatch(syncAllData());
  }, [dispatch]);

  const userFromLocalStorage = JSON.parse(localStorage.getItem("user") || "{}");

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

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const user = await apiCalls.getUserByDisplayName(searchTerm.trim());
      if (user) {
        const friendRequest: Friend = {
          user: userFromLocalStorage, 
          friend: user,
          status: "pending",
          createdAt: new Date().toISOString(), 
        };
        await apiCalls.addFriend(friendRequest);
        alert(`Solicitud de amistad enviada a ${user.display_name}`);
      } else {
        alert("Usuario no encontrado");
      }
    } catch (error) {
      alert("Error al buscar usuario o enviar solicitud");
    }
  };
  

  const handleOpenModal = (friend: any) => {
    setSelectedUser(friend.friend);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setShowInput(false);
  };

  const handleShowInput = () => {
    setShowInput(true);
    setActiveFilter("");
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
    input: {
      width: "90%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      color: "white",
      backgroundColor: "transparent",
      fontSize: "16px",
      fontWeight: "bold",
    },
    confirmButton: {
      width: "100px",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
      color: "white",
      marginLeft: "10px",
      opacity: searchTerm.trim() ? 1 : 0.5,
      pointerEvents: searchTerm.trim() ? "auto" : "none",
    }
  };

  return (
    <div style={{ padding: "0 40px" }}>
      <nav style={styles.nav} className="d-flex flex-row align-items-center">
        <div style={styles.buttonsContainer}>
          <button
            className={`button ${
              activeFilter === "activos" ? "button-active-filter" : ""
            }`}
            style={styles.button}
            onClick={() => handleFilterChange("activos")}
          >
            Activos
          </button>
          <button
            className={`button ${
              activeFilter === "todos" ? "button-active-filter" : ""
            }`}
            style={styles.button}
            onClick={() => handleFilterChange("todos")}
          >
            Todos
          </button>
          <button
            className={`button ${
              activeFilter === "solicitudes" ? "button-active-filter" : ""
            }`}
            style={styles.button}
            onClick={() => handleFilterChange("solicitudes")}
          >
            Solicitudes
          </button>
        </div>

        <button
          className="button"
          style={{ ...styles.button, ...styles.addButton }}
          onClick={handleShowInput}
        >
          Añadir
        </button>
      </nav>
      <hr style={styles.separator} />

      <div style={styles.contentWrapper} className="contentWrapper">
        <div style={styles.content}>
          {showInput ? (
            <div style={{ padding: "10px" }}>
              <input
                type="text"
                placeholder="Buscar usuario por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                style={styles.input}
              />
              <button
                className="button button-active-filter"
                style={{ ...styles.button, ...styles.addButton, ...styles.confirmButton }}
                onClick={handleSearch}
                disabled={!searchTerm.trim()}
              >
                Buscar
              </button>
            </div>
          ) : (
            <>
              {filteredFriends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  isActive={!friend.friend.lastLogin}
                  onDeleteClick={
                    activeFilter === "solicitudes"
                      ? () => alert("Eliminar solicitud")
                      : undefined
                  }
                  onOptionsClick={
                    activeFilter !== "solicitudes"
                      ? () => handleOpenModal(friend)
                      : undefined
                  }
                  onSendMessage={
                    activeFilter !== "solicitudes"
                      ? () => alert("Enviar mensaje")
                      : undefined
                  }
                />
              ))}
            </>
          )}
        </div>
      </div>
      {selectedUser && (
        <UserInfoModal
          show={modalOpen}
          handleClose={handleCloseModal}
          user={selectedUser}
          onSendMessage={() => alert(`Enviar mensaje a ${selectedUser.name}`)}
          onRequestClick={() =>
            alert(`Solicitar conexión con ${selectedUser.name}`)
          }
          onDeleteClick={() => alert(`Eliminar a ${selectedUser.name}`)}
        />
      )}
    </div>
  );
};

export default ContactView;
