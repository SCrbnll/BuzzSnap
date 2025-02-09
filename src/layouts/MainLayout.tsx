import React from "react";
import logo from "/buzzsnap-recorte.png";
import sv from "/SCrbnll.png"

import "bootstrap-icons/font/bootstrap-icons.css";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const handleButtonClick = () => {
    alert("¡Botón presionado!");
  };

  const styles = {
    aside : {
      backgroundColor: "#8A8A8A",
      width: "90px"
    },
    logo : {
      width: "50px",
      borderRadius: "25%",
    },
    button: {
      backgroundColor: "#FFFFFF",
      borderColor: "#000000",
      borderRadius: "25%",
      justifyContent: "center",
      width: "50px",
      height: "50px",
      cursor: "pointer"    
    }
  };

  return (
    <div className="d-flex vh-100">
      <aside style={styles.aside} className="d-flex flex-column align-items-center">
        <p style={{fontSize: "12px", fontWeight: "bold", marginBottom: "5px"}}>BuzzSnap</p>
          <img src={logo} alt="Buzzsnap Logo" style={styles.logo} />
          <hr style={{ width: "50%", border: "1px solid white", margin: "10px 0" }} />          
          <img src={sv} alt="Buzzsnap Logo" style={styles.logo} />
          <button style={styles.button} onClick={handleButtonClick} className="mt-2">
            <i className="bi bi-plus" style={{ fontSize: "30px" }}></i>
          </button>
        
      </aside>

      <div style={{ flex: 1, padding: "20px" }}>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
