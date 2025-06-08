import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChatUserId, syncAllData } from "@/context/store";
import { RootState, AppDispatch } from "@/context/store";
import SettingsModal from "@/components/settings/SettingsModal";

import logo from "/buzzsnap-recorte.png";
import sv from "/SCrbnll.png";

import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import LocalStorageCalls from "@/context/localStorageCalls";
import SocketCalls from "@/context/socketCalls";
import { notifyAction } from "@/components/NotificationProvider";
import CreateGroupModal from "@/components/groups/CreateGroupModal";
import TokenUtils from "@/utils/TokenUtils";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const POLL_INTERVAL = 60000; // 1 minutos en milisegundos
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const groupMembers = useSelector(
    (state: RootState) => state.app.groupMembers
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<any>();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 576);
    checkScreenSize(); 
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const storedUser = LocalStorageCalls.getStorageUser();
    const data = storedUser ? TokenUtils.decodeToken(storedUser) : null;  
    const user = TokenUtils.mapJwtPayloadToUser(data!);  
    if (!user) {
      navigate("/login");
    } else {
      setUserInfo(user);
      SocketCalls.connect(user.id, user.displayName);
      SocketCalls.on("notify_user", (data) => {
        const activeChatId = LocalStorageCalls.getActiveChatId();
        if (data.recipientId !== user.id) return;
        if (data.chatId === null) {
          if (window.location.pathname.split("/")[2] !== data.groupId.toString()) {
            notifyAction(`Nuevo mensaje de ${data.senderName}`, data.preview, "Abrir",
              () => {
                dispatch(setCurrentChatUserId(data.recipientId));
                navigate("/groups/" + data.groupId);
              }
            );
          }
        } else {
          if (activeChatId !== data.chatId.toString()) {
            notifyAction(`Nuevo mensaje de ${data.senderName}`, data.preview, "Abrir",
              () => {
                dispatch(setCurrentChatUserId(data.recipientId));
                navigate("/home/chats");
              }
            );
          }
        }
      });

      SocketCalls.on("sync_data_notify", () => {
        dispatch(syncAllData());
      });

      console.log("🔄 Ejecutando dispatch(syncAllData())...");
      dispatch(syncAllData());

      intervalRef.current = setInterval(() => {
        console.log("⏳ Sincronización periódica...");
        dispatch(syncAllData());
      }, POLL_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        SocketCalls.disconnect();
        console.log("🛑 Deteniendo sincronización.");
        clearInterval(intervalRef.current);
      }
      SocketCalls.off("new_private_message");
    };
  }, [dispatch]);

  const handleLogout = () => {
      LocalStorageCalls.removeActiveChatId();
      LocalStorageCalls.removeStorageUser();
      navigate('/login')
    }

  const handleOpenModal = () => setShowSettingsModal(true);
  const handleCloseModal = () => setShowSettingsModal(false);
  const handleOpenCreateGroupModal = () => setShowCreateGroupModal(true);
  const handleCloseCreateGroupModal = () => setShowCreateGroupModal(false);

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      height: "100vh",
    },
    aside: {
      width: "90px",
      flexDirection: "column",
      alignItems: "center",
      height: "100vh",
      padding: "10px",
      zIndex: 1050,
      ...(isMobile
    ? {
        position: "fixed",
        top: 0,
        left: isSidebarVisible ? 0 : "-160px", 
        transition: "left 0.3s ease-in-out",
        display: "flex",
      }
    : {
        display: "flex",
        position: "relative",
      }),
    },
    title: {
      fontSize: "12px",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    logo: {
      width: "50px",
      borderRadius: "25%",
      cursor: "pointer",
    },
    hr: {
      width: "50%",
      border: "1px solid white",
      margin: "10px 0",
    },
    groupContainer: {
      flex: 1,
      overflowY: "auto",
      width: "100%",
      marginBottom: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    groupImage: {
      width: "50px",
      borderRadius: "25%",
      cursor: "pointer",
    },
    groupItem: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "10px",
    },
    groupTooltip: {
      position: "absolute",
      bottom: "-30px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "white",
      padding: "5px",
      borderRadius: "5px",
      fontSize: "12px",
      textAlign: "center",
      whiteSpace: "nowrap",
      visibility: "hidden",
      opacity: 0,
      transition: "opacity 0.3s",
    },
    groupItemHover: {
      visibility: "visible",
      opacity: 1,
    },
    button: {
      borderRadius: "25%",
      width: "50px",
      height: "50px",
      cursor: "pointer",
    },
    plusIcon: {
      fontSize: "30px",
    },
    profileImage: {
      width: "50px",
      height: "50px",
      cursor: "pointer",
      border: "2px solid white",
      borderRadius: "50%",
      marginTop: "auto",
    },
    mainContent: {
      flex: 1,
      padding: "20px",
    },
  };

  return (
    <>
      <button className="d-block d-md-none btn btn-outline-light m-2" onClick={() => setSidebarVisible(!isSidebarVisible)}
      style={{ width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
        <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
      </button>
      <div style={styles.container}>
        <aside style={styles.aside} className="aside-layout">
          <p style={styles.title}>BuzzSnap</p>
          <img
            src={logo}
            alt="Buzzsnap Logo"
            style={styles.logo}
            onClick={() => navigate("/home")}
          />

          <hr style={styles.hr} />

          <div style={styles.groupContainer}>
            {groupMembers.length > 0 ? (
              groupMembers.map((groupMember) => (
                <div
                  key={groupMember.id}
                  style={styles.groupItem}
                  className="group-item"
                >
                  <img
                    src={groupMember.group?.imageUrl || sv}
                    alt={groupMember.group?.name}
                    style={styles.groupImage}
                    onClick={() => navigate(`/groups/${groupMember.group?.id}`)}
                  />
                  <span className="group-tooltip">
                    {groupMember.group?.name}
                  </span>
                </div>
              ))
            ) : (
              <></>
            )}
            <button style={styles.button} onClick={handleOpenCreateGroupModal}>
              <i className="bi bi-plus" style={styles.plusIcon}></i>
            </button>
          </div>

          {userInfo && userInfo.avatarUrl ? (
            <div className="group-item">
              <img
                onClick={handleOpenModal}
                src={userInfo.avatarUrl}
                alt="Perfil"
                style={styles.profileImage}
              />
              <span className="group-tooltip">Ver perfil</span>
            </div>
          ) : null}
  
          <SettingsModal
            show={showSettingsModal}
            handleClose={handleCloseModal}
            onChangeEmail={() => alert(`Cambiar email`)}
            onChangePassword={() => alert(`Cambiar password`)}
            onLogOut={() => handleLogout()}
          />
        </aside>
        {isSidebarVisible && (
          <div
            onClick={() => setSidebarVisible(false)}
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              zIndex: 1000,
            }}
          />
        )}

        <div style={styles.mainContent}>
          <main>{children}</main>
        </div>
      </div>
      <CreateGroupModal
        show={showCreateGroupModal}
        handleClose={handleCloseCreateGroupModal}
        onGroupCreated={() => SocketCalls.syncData()}
        onGroupJoined={() => SocketCalls.syncData()}
      />

      <style>
        {`
            .group-tooltip {
              position: fixed;
              left: 80px; 
              background-color: rgba(0, 0, 0, 1);
              color: white;
              padding: 5px 10px;
              border-radius: 10px;
              font-size: 12px;
              text-align: center;
              white-space: nowrap;
              visibility: hidden;
              opacity: 0;
              transition: opacity 0.3s ease-in-out;
              pointer-events: none; 
              z-index: 9999;
            }

            .group-item:hover .group-tooltip {
              visibility: visible;
              opacity: 1;
            }
          `}
      </style>
    </>
  );
};

export default MainLayout;
