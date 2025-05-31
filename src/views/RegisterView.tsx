import React, { useState } from "react";
import logo from "/buzzsnap-logo.png";
import background from "/background.jpg";
import { useNavigate } from "react-router-dom";
import ApiManager from "@/context/apiCalls";
import { notifyPromise } from "@/components/NotificationProvider";
import TokenUtils from "@/utils/TokenUtils";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const apiCalls = new ApiManager();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const authData = await notifyPromise(
      () => apiCalls.register({ name, email, password }),
      {
        loading: "Registrando...",
        success: (data: any) => {
          const userData = TokenUtils.decodeToken(data.token);
          const displayName = userData?.display_name || "usuario";
          return `Bienvenido, ${displayName}!`;
        },
        error: "Error al registrar",
      }
    )
    if (authData) {
      navigate("/home");
    }
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
  };

  return (
    <div className="d-flex flex-column align-items-end justify-content-center vh-100" style={styles.container}>
      <img src={logo} alt="Buzzsnap Logo" style={styles.logo} className="mb-4" />
      <h1 className="mb-3">Registrar cuenta</h1>

      <form style={styles.form} onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input 
            type="text" 
            id="username" 
            className="form-control input-login" 
            placeholder="Introduzca su usuario" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            id="email" 
            className="form-control input-login" 
            placeholder="Introduzca su email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            className="form-control input-login" 
            placeholder="Introduzca su contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required />
        </div>

        <button type="submit" className="btn w-100 button-login">Crear cuenta</button>

        <p className="mt-3">
          ¿Ya una cuenta? <a href="/login" className="text-primary">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
