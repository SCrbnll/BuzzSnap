import React, { useState } from "react";
import logo from "/buzzsnap-logo.png";
import background from "/background.jpg";
import { useNavigate } from "react-router-dom";
import { useApiManager } from "@/layouts/ApiContext";
import { notifyError, notifyPromise } from "@/components/NotificationProvider";
import TokenUtils from "@/utils/TokenUtils";
import { User } from "@/services/api/types";

const ChangeEmail: React.FC = () => {
  const navigate = useNavigate();
  const apiManager = useApiManager();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [userData, setUserData] = useState<any>(null);
  const [newEmail, setNewEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const authData = await notifyPromise(
      () => apiManager.login(username, password),
      {
        loading: "Iniciando sesión...",
        success: () => `Autenticado con éxito`,
        error: "Credenciales incorrectas o error en el servidor.",
      }
    );

    if (authData) {
      setUserData(authData);
      const { token } = authData as { token: string; refreshToken: string };
      const decodedData = TokenUtils.decodeToken(token);
      setOldEmail(decodedData!.email);
    }
  };

  const handleChangeEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    const decodedUser = TokenUtils.decodeToken(userData.token);
    const user = TokenUtils.mapJwtPayloadToUser(decodedUser!);
    const userDb = await apiManager.getUser(user.id);
    let userUpdated: User;
    try {
      userUpdated = await apiManager.updateUser({
        ...userDb!,
        email: newEmail,
      });
    } catch (error) {
      notifyError("El correo que intenta usar ya está vinculado a otra cuenta de BuzzSnap");
      return;
    }

    const authData = await notifyPromise(
      () => apiManager.updateToken(userUpdated),
      {
        loading: "Actualizando correo...",
        success: () => `Correo actualizado con éxito`,
        error: "No se pudo actualizar el correo",
      }
    );

    if (authData) {
      navigate("/login");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        padding: "50px",
      }}
    >
      <div className="d-flex" style={{ maxWidth: "800px", width: "100%" }}>
        <div style={{ width: "50%" }} className="pe-4 border-end">
          <img
            src={logo}
            alt="Buzzsnap Logo"
            style={{ width: "350px" }}
            className="mb-5"
          />
          <h2>Inicio de sesión</h2>
          <p>Debemos autenticarte para continuar</p>

          <form style={{ width: "350px" }} onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Correo</label>
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
              Autenticar
            </button>
          </form>
        </div>

        {userData && (
          <div style={{ width: "50%" }} className="ps-4">
            <h2>Cambiar correo</h2>
            <form onSubmit={handleChangeEmail}>
              <div className="mb-3">
                <label className="form-label">Correo actual</label>
                <input
                  type="email"
                  className="form-control"
                  value={oldEmail}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nuevo correo</label>
                <input
                  type="email"
                  className="form-control"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                Cambiar correo
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeEmail;
