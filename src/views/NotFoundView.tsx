import React from 'react';
import image404 from "@/assets/images/404.png";
import background from "@/assets/images/background.jpg";

const NotFound: React.FC = () => {

  const styles = {
    container: {
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    logo : {
      width: "350px"
    },
    button : {
      backgroundColor: "#FFA600",
      color: "#000000",
      width: "150px"
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100" style={styles.container}>
      <img src={image404} alt="Buzzsnap Logo" style={styles.logo} />
      <h1 className="mb-4">La pagina que buscas no existe</h1>
      <button onClick={() => window.history.back()} className="btn" style={styles.button}>Volver atrás</button>
      
    </div>
  );
};

export default NotFound;

