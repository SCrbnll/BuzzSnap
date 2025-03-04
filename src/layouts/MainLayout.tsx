import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadGroups } from "@/context/store";  // Asegúrate de importar correctamente
import { RootState, AppDispatch } from "@/context/store";  // Asegúrate de importar AppDispatch

import logo from "/buzzsnap-recorte.png";
import sv from "/SCrbnll.png";

import "bootstrap-icons/font/bootstrap-icons.css";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();  // Asegúrate de usar el tipo correcto de dispatch
  const groups = useSelector((state: RootState) => state.app.groups);  // Accede a los grupos desde el store

  useEffect(() => {
    dispatch(loadGroups()); 
  }, [dispatch]);

  const handleButtonClick = () => {
    alert("¡Botón presionado!");
  };

  const handleGroupClick = (groupId: string) => {
    alert(`¡Grupo ${groupId} con nombre ${groups.find(group => group.id === groupId)?.name} presionado!`); 
  };

  const styles: { [key: string]: React.CSSProperties } = {
    aside: {
      backgroundColor: "#8A8A8A",
      width: "90px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100vh",
      padding: "10px",
    },
    logo: {
      width: "50px",
      borderRadius: "25%",
      cursor: "pointer",
    },
    button: {
      backgroundColor: "#FFFFFF",
      borderColor: "#000000",
      borderRadius: "25%",
      justifyContent: "center",
      width: "50px",
      height: "50px",
      cursor: "pointer",
    },
    profile: {
      width: "50px",
      height: "50px",
      cursor: "pointer",
      border: "2px solid white",
      borderRadius: "50%",
      marginTop: "auto",
    },
    iconList: {
      flex: 1,
      overflowY: "auto",
      width: "100%",
      marginBottom: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      scrollbarWidth: "none", 
    },
    separator: {
      width: "50%",
      border: "1px solid white",
      margin: "10px 0",
    },
  };
  

  return (
    <div className="d-flex vh-100">
      <aside style={styles.aside}>
        <p style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>BuzzSnap</p>
        <img src={logo} alt="Buzzsnap Logo" style={styles.logo} />

        <hr style={styles.separator} />

        <div style={styles.iconList}>
        {groups.length > 0 ? (
            groups.map((group) => (
              <img
                key={group.id}
                src={group.image_url || sv} 
                alt={group.name}
                style={styles.logo}
                className="mb-2"
                onClick={() => handleGroupClick(group.id || "")}
              />
            ))
          ) : (
            <p>No hay grupos disponibles</p>  // Mensaje si no hay grupos
          )}
          <button style={styles.button} onClick={handleButtonClick} className="mb-2">
            <i className="bi bi-plus" style={{ fontSize: "30px" }}></i>
          </button>
        </div>

          <img onClick={handleButtonClick} src={sv} alt="Perfil" style={styles.profile} />
      </aside>

      <div style={{ flex: 1, padding: "20px" }}>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
