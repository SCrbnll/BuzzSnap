import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const HomeView: React.FC = () => {
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
          <NavLink to="/home/chats" className="nav-link" style={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
              Chats
          </NavLink>
          <hr style={styles.separatorVertical} />
          <NavLink  to="/home/contactos" className="nav-link" style={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
              Contactos
          </NavLink>
          <i className="mx-3 ms-auto bi bi-gear" style={{ fontSize: "20px", cursor: "pointer" }} />
        </ul>
      </nav>
      <hr style={styles.separator} />
      
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default HomeView;
