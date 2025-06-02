import ContactNav from "@/components/contact/ContactNav";
import FriendList from "@/components/contact/FriendList";
import FriendSearchInput from "@/components/contact/FriendSearchInput";
import UserInfoModal from "@/components/users/UserInfoModal";
import ApiManager from "@/context/apiCalls";
import LocalStorageCalls from "@/context/localStorageCalls";
import {
  AppDispatch,
  RootState,
  setCurrentChatUserId,
  syncAllData,
} from "@/context/store";
import { Friend } from "@/services/api/types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "@/components/NotificationProvider";
import SocketCalls from "@/context/socketCalls";
import TokenUtils from "@/utils/TokenUtils";

const ContactView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const friends = useSelector((state: RootState) => state.app.friends);
  const apiCalls = new ApiManager();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("activos");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pendingFriends, setPendingFriends] = useState<Friend[]>([]);
  const [searchMessage, setSearchMessage] = useState<string>("");

  const storedUser = LocalStorageCalls.getStorageUser();
  const data = storedUser ? TokenUtils.decodeToken(storedUser) : null;
  const currentUser = TokenUtils.mapJwtPayloadToUser(data!);

  useEffect(() => {
    dispatch(syncAllData());
  }, [dispatch]);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 576);

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchPendingFriends = async () => {
      if (activeFilter === "solicitudes") {
        try {
          const pendingFriends = await apiCalls.getFriendsPending(
            currentUser.id
          );
          setPendingFriends(pendingFriends);
        } catch (error) {
          notifyError("Error al obtener solicitudes pendientes");
        }
      }
    };
    fetchPendingFriends();
  }, [activeFilter, currentUser.id]);

  const filteredFriends =
    activeFilter === "solicitudes"
      ? pendingFriends
      : friends.filter((friend) => {
          const friendInfo =
            friend.friend.id === currentUser.id ? friend.user : friend.friend;
          switch (activeFilter) {
            case "activos":
              return (
                friendInfo.lastLogin === null && friend.status === "accepted"
              );
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
      if (
        friends.find(
          (friend) => friend.friend.id === user.id || friend.user.id === user.id
        )
      )
        return (
          setSearchMessage(`El usuario <b>${searchTerm}</b> ya es tu amigo`),
          setSearchTerm("")
        );
      if (user) {
        const friendRequest: Friend = {
          user: currentUser,
          friend: user,
          status: "pending",
        };
        await apiCalls.addFriend(friendRequest);
        notifySuccess(`Solicitud de amistad enviada a ${searchTerm}`);
        setSearchMessage(`Solicitud de amistad enviada a ${searchTerm}`);
        SocketCalls.syncData();
      } else {
        notifyError(`Usuario no encontrado`);
        setSearchMessage(`Usuario no encontrado`);
        setSearchTerm("");
      }
      setSearchTerm("");
    } catch (error) {
      setSearchTerm("");
      notifyError(`Error al buscar usuario o enviar solicitud al usuario`);
      setSearchMessage(`Error al buscar usuario o enviar solicitud al usuario`);
    }
  };

  const accepFriendRequest = async (friendId: number) => {
    if (processing) return;
    setProcessing(true);
    try {
      await apiCalls.acceptFriendRequest(friendId);
      setPendingFriends(
        pendingFriends.filter((friend) => friend.id !== friendId)
      );
      SocketCalls.syncData();
    } catch (error) {
      notifyError("Error al aceptar solicitud de amistad");
    } finally {
      setProcessing(false);
    }
  };

  const rejectFriendRequest = async (friendId: number) => {
    if (processing) return;
    setProcessing(true);

    try {
      await apiCalls.rejectFriendRequest(friendId);
      setPendingFriends(pendingFriends.filter(f => f.id !== friendId));
      SocketCalls.syncData();
    } catch (error) {
      notifyError("Error al rechazar solicitud de amistad");
    } finally {
      setProcessing(false);
    }
  };

  const deleteFriend = async (userId: number) => {
    try {
      const confirmDelete = confirm(
        "¿Estás seguro de que deseas eliminar a este amigo?"
      );
      if (!confirmDelete) return;

      const friendRecord = friends.find(
        (f) =>
          (f.user.id === currentUser.id && f.friend.id === userId) ||
          (f.friend.id === currentUser.id && f.user.id === userId)
      );

      if (!friendRecord) {
        notifyError("No se encontró el registro de amistad");
        return;
      }

      await apiCalls.deleteFriend(friendRecord.id!);
      SocketCalls.syncData();
      setModalOpen(false);
    } catch (error) {
      notifyError("Error al eliminar amigo");
    }
  };

  const handleOpenModal = (friend: any) => {
    const userInfo =
      friend.friend.id === currentUser.id ? friend.user : friend.friend;
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

  const handleSendMessage = async (userId: number) => {
    const exist = await apiCalls.checkChat(currentUser.id, userId);
    if (exist) {
      dispatch(setCurrentChatUserId(userId));
      navigate("/home/chats");
      return;
    }
    await apiCalls.createChat(currentUser.id, userId);
    dispatch(setCurrentChatUserId(userId));
    navigate("/home/chats");
  };

  const styles: { [key: string]: React.CSSProperties } = {
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
    <div style={{ padding: isMobile ? "0px" : "0 40px" }}>
      <ContactNav
        isMobile={isMobile}
        activeFilter={activeFilter}
        handleFilterChange={handleFilterChange}
        handleShowInput={handleShowInput}
      />
      <div style={styles.contentWrapper} className="contentWrapper">
        <div style={styles.content}>
          {showInput ? (
            <FriendSearchInput
              isMobile={isMobile}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              searchMessage={searchMessage}
            />
          ) : (
            <FriendList
              friends={filteredFriends}
              userId={currentUser.id}
              activeFilter={activeFilter}
              onAcceptClick={accepFriendRequest}
              onRejectClick={rejectFriendRequest}
              onSendMessage={handleSendMessage}
              onOptionsClick={handleOpenModal}
            />
          )}
        </div>
      </div>
      {selectedUser && (
        <UserInfoModal
          show={modalOpen}
          handleClose={handleCloseModal}
          user={selectedUser}
          onSendMessage={() => handleSendMessage(selectedUser.id)}
          onDeleteClick={() => {
            deleteFriend(selectedUser.id);
          }}
        />
      )}
    </div>
  );
};

export default ContactView;
