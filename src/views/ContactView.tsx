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
  const [pendingFriends, setPendingFriends] = useState<Friend[]>([]);
  const [searchMessage, setSearchMessage] = useState<string>('');

  const userFromLocalStorage = JSON.parse(localStorage.getItem("user") || "{}");
  
  useEffect(() => {
    dispatch(syncAllData());
  }, [dispatch]);

  useEffect(() => {
    const fetchPendingFriends = async () => {
      if (activeFilter === "solicitudes") {
        try {
          const pendingFriends = await apiCalls.getFriendsPending(userFromLocalStorage.id);
          setPendingFriends(pendingFriends);
        } catch (error) {
          console.error("Error al obtener solicitudes pendientes", error);
        }
      }
    };
    fetchPendingFriends();
  }, [activeFilter, userFromLocalStorage.id]);
  
  const filteredFriends = activeFilter === "solicitudes"
  ? pendingFriends
  : friends.filter((friend) => {
    const friendInfo = friend.id === userFromLocalStorage.id ? friend.friend : friend.user;

      switch (activeFilter) {
        case "activos":
          return friendInfo.lastLogin === null && friend.status === "accepted";
        case "todos":
          return friend.status === "accepted";
        default:
          return true;
      }
    });

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const user = await apiCalls.getUserByDisplayName(searchTerm.trim());
      if(friends.find((friend) => friend.friend.id === user.id || friend.user.id === user.id)) return setSearchMessage(`El usuario <b>${searchTerm}</b> ya es tu amigo`), setSearchTerm('');
      if (user) {
        const friendRequest: Friend = {
          user: userFromLocalStorage, 
          friend: user,
          status: "pending",
          };
        await apiCalls.addFriend(friendRequest);
        setSearchMessage(`Solicitud de amistad enviada a ${searchTerm}`);
      } else {
        setSearchMessage(`Usuario no encontrado`);
        setSearchTerm("");
      }
      setSearchTerm("");
    } catch (error) {
      setSearchTerm("");
      setSearchMessage(`Error al buscar usuario o enviar solicitud al usuario`);
      alert("Error al buscar usuario o enviar solicitud");
    }
  };

  const accepFriendRequest = async (friendId: number) => {
    try {
      await apiCalls.acceptFriendRequest(friendId);
      setPendingFriends(pendingFriends.filter((friend) => friend.id !== friendId));
      dispatch(syncAllData());
    } catch (error) {
      console.error("Error al aceptar solicitud de amistad", error);
    }
  };

  const rejectFriendRequest = async (friendId: number) => {
    try {
      await apiCalls.rejectFriendRequest(friendId);
      setPendingFriends(pendingFriends.filter((friend) => friend.id !== friendId));
      dispatch(syncAllData());
    } catch (error) {
      console.error("Error al rechazar solicitud de amistad", error);
    }
  };
  

  const handleOpenModal = (friend: any) => {
    const userInfo = friend.id === userFromLocalStorage.id ? friend.friend : friend.user;
    setSelectedUser(userInfo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setShowInput(false);
    setSearchMessage("");
  };

  const handleShowInput = () => {
    setShowInput(true);
    setActiveFilter("");
    setSearchMessage("");
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
              <p className="mt-2">{searchMessage}</p>
            </div>
          ) : (
            <>
              {filteredFriends.map((friend) => {
                const displayUser =
                friend.friend.id === userFromLocalStorage.id ? friend.user : friend.friend;
              const isActive = displayUser.lastLogin === null;
                return (
                  <FriendCard
                    key={friend.id}
                    friend={displayUser}
                    isActive={isActive}
                    onDeleteClick={
                      activeFilter === "solicitudes"
                        ? () => rejectFriendRequest(friend.id!)
                        : undefined
                    }
                    onAcceptClick={
                      activeFilter === "solicitudes"
                        ? () => accepFriendRequest(friend.id!)
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
                )
              }
              )}
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
