import React from "react";

type ContactNavProps = {
  activeFilter: string;
  handleFilterChange: (filter: string) => void;
  handleShowInput: () => void;
};

const ContactNav: React.FC<ContactNavProps> = ({
  activeFilter,
  handleFilterChange,
  handleShowInput,
}) => {
  const styles: { [key: string]: React.CSSProperties } = {
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
    separator: {
      width: "100%",
      margin: "15px auto",
    },
  };

  return (
    <>
      <nav style={styles.nav} className="d-flex flex-row align-items-center">
        <div style={styles.buttonsContainer}>
          <button
            className={`button ${activeFilter === "activos" ? "button-active-filter" : ""}`}
            style={styles.button}
            onClick={() => handleFilterChange("activos")}
          >
            Activos
          </button>
          <button
            className={`button ${activeFilter === "todos" ? "button-active-filter" : ""}`}
            style={styles.button}
            onClick={() => handleFilterChange("todos")}
          >
            Todos
          </button>
          <button
            className={`button ${activeFilter === "solicitudes" ? "button-active-filter" : ""}`}
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
    </>
  );
};

export default ContactNav;
