import React, {  useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import SettingsModal from "@/components/settings/SettingsModal";
import LocalStorageCalls from "@/context/localStorageCalls";

const HomeView: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();  

  const handleOpenModal = () => setModalOpen(true); 
  const handleCloseModal = () => setModalOpen(false); 

  const handleLogout = () => {
    LocalStorageCalls.removeStorageUser();
    navigate('/login')
  }  

  const styles = {
    nav: {
      fontSize: "18px",
    },
    separatorVertical: {
      width: "2px",
      height: "15px",
      backgroundColor: "white",
      margin: "0px 15px",
    },
    separator: {
      width: "100%",
    },
    activeLink: {
      textDecoration: "underline",
      color: "#FFFFFF",
    },
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
            className="mx-3 ms-auto bi bi-gear"
            style={{ fontSize: "20px", cursor: "pointer" }}
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
        onChangeEmail={() => alert(`Cambiar email`)}
        onChangePassword={() => alert(`Cambiar password`)}
        onLogOut={() => handleLogout()}
      />
    </div>
  );
};

export default HomeView;
