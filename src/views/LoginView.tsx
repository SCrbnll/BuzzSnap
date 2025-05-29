import React, { useState } from "react";
import logo from "/buzzsnap-logo.png";
import background from "/background.jpg";
import { useNavigate } from "react-router-dom";
import { useApiManager } from "@/layouts/ApiContext";
import { notifyPromise } from "@/components/NotificationProvider";
import LocalStorageCalls from "@/context/localStorageCalls";
import TokenUtils from "@/utils/TokenUtils";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const apiManager = useApiManager();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const authData = await notifyPromise(
      () => apiManager.login(username, password),
      {
        loading: "Iniciando sesión...",
        success: (data: any) => {
          const userData = TokenUtils.decodeToken(data.token);
          const displayName = userData?.display_name || "usuario";
          
          // Guarda en localStorage
          LocalStorageCalls.setStorageUser(data);

          return `Bienvenido, ${displayName}!`;
        },
        error: "Credenciales incorrectas o error en el servidor.",
      }
    );

    if (authData) {
      navigate("/home");
    }
  };

  return (
    <div className="d-flex flex-column align-items-start justify-content-center vh-100" 
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", padding: "250px" }}
    >
      <img src={logo} alt="Buzzsnap Logo" style={{ width: "350px" }} className="mb-5" />
      <h1 className="mb-4">Inicio de sesión</h1>

      <form style={{ width: "350px" }} onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input 
            type="email" 
            className="form-control input-login"
            placeholder="Introduzca su usuario" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input 
            type="password" 
            className="form-control input-login" 
            placeholder="Introduzca su contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>

        <button type="submit" className="btn w-100 button-login">
          Entrar
        </button>

        <p className="mt-3">
          ¿No tienes una cuenta? <a href="/register" className="text-primary">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
