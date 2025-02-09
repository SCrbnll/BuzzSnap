import React from "react";
import logo from "/buzzsnap-logo.png";
import background from "../assets/images/background.jpg";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    
    navigate("/home");
  };

  const styles = {
    container: {
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "250px",
    },
    logo : {
      width: "350px"
    },
    form : {
      width: "350px",
    },
    input: {
      backgroundColor: "#FFEBC6",
    },
    button : {
      backgroundColor: "#FFA600",
      color: "#000000"
    }
  };

  return (
    <div className="d-flex flex-column align-items-start justify-content-center vh-100" style={styles.container}>
      <img src={logo} alt="Buzzsnap Logo" style={styles.logo} className="mb-5" />
      <h1 className="mb-4">Inicio de sesión</h1>

      <form style={styles.form} onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input type="text" id="username" className="form-control" style={styles.input} placeholder="Introduzca su usuario" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" id="password" className="form-control" style={styles.input} placeholder="Introduzca su contraseña" required />
        </div>

        <button type="submit" className="btn w-100" style={styles.button}>Entrar</button>

        <p className="mt-3">
          ¿No tienes una cuenta? <a href="/register" className="text-primary">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
