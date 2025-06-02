import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import SettingsModal from "@/components/settings/SettingsModal";
import LocalStorageCalls from "@/context/localStorageCalls";
import SocketCalls from "@/context/socketCalls";
import {
  notifyErrorDescription,
  notifySuccessDescription,
} from "@/components/NotificationProvider";
import TokenUtils from "@/utils/TokenUtils";

const HomeView: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 576);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    LocalStorageCalls.removeActiveChatId();
    LocalStorageCalls.removeStorageUser();
    navigate("/login");
  };

  const userData = () => {
    const storedUser = LocalStorageCalls.getStorageUser();
    const data = storedUser ? TokenUtils.decodeToken(storedUser) : null;
    const currentUser = TokenUtils.mapJwtPayloadToUser(data!);
    return currentUser;
  };

  const sendEmailChangeEmail = () => {
    const user = userData();
    SocketCalls.sendEmailChange(user.email, user.displayName);
    SocketCalls.on("email_change_sent", (data) => {
      if (data.success)
        notifySuccessDescription(
          "📨 Email enviado correctamente",
          "Revisa tu bandeja de entrada"
        );
      else notifyErrorDescription("❌ Error", data.error);
    });
  };

  const sendPasswordChangeEmail = () => {
    const user = userData();
    SocketCalls.sendPasswordChange(user.email, user.displayName);
    SocketCalls.on("password_reset_sent", (data) => {
      if (data.success)
        notifySuccessDescription(
          "📨 Email enviado correctamente",
          "Revisa tu bandeja de entrada"
        );
      else notifyErrorDescription("❌ Error", data.error);
    });
  };

  const styles = {
    nav: {
      fontSize: "18px",
      marginTop: isMobile ? "-65px" : "0",
      marginLeft: isMobile ? "3rem" : "0",
    },
    separatorVertical: {
      width: "2px",
      height: "15px",
      backgroundColor: "white",
      margin: "0px 15px",
    },
    separator: {
      width: "100%",
      marginTop: isMobile ? "30px" : "0",
    },
    activeLink: {
      textDecoration: "underline",
      color: "#FFFFFF",
    },
    icon: {
      fontSize: "20px",
      cursor: "pointer",
      marginLeft: isMobile ? "20px" : "auto",   
      marginRight: isMobile ? "" : "1rem",  
    }
  };

  return (
    <div>
      <nav style={styles.nav}>
        <ul className="d-flex flex-row align-items-center gap-4">
          <NavLink
            to="/home/chats"
            className="nav-link"
            style={({ isActive }) => (isActive ? styles.activeLink : undefined)}
          >
            Chats
          </NavLink>
          <hr style={styles.separatorVertical} />
          <NavLink
            to="/home/contacts"
            className="nav-link"
            style={({ isActive }) => (isActive ? styles.activeLink : undefined)}
          >
            Contactos
          </NavLink>
          <i
            className="bi bi-gear"
            style={styles.icon}
            onClick={handleOpenModal}
          />
        </ul>
      </nav>
      <hr style={styles.separator} />

      <section>
        <Outlet />
      </section>
      <SettingsModal
        show={modalOpen}
        handleClose={handleCloseModal}
        onChangeEmail={() => sendEmailChangeEmail()}
        onChangePassword={() => sendPasswordChangeEmail()}
        onLogOut={() => handleLogout()}
      />
    </div>
  );
};

export default HomeView;
