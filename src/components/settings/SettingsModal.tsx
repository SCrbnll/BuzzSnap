import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ColorButton from "./ColorButton";

interface UserInfoModalProps {
  show: boolean;
  handleClose: () => void;
  onChangeEmail?: () => void;
  onChangePassword?: () => void;
  onLogOut?: () => void;
}

const SettingsModal: React.FC<UserInfoModalProps> = ({
  show,
  handleClose,
  onChangeEmail,
  onChangePassword,
  onLogOut,
}) => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState(user.name);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const saveUser = () => {
    // TODO : Implementar llamada API guardar User
    setIsEditingName(false);
  };

  const changeColor = (color: string) => {
    document.body.setAttribute("data-theme", color);
    // TODO : Implementar llamada API guardar User
  }

  const hideEmail = (email: string) => {
    const [username, domain] = email.split("@");
    const hiddenUsername = username.slice(0, 3) + "***";
    return hiddenUsername + "@" + domain;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Ajustes</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h5 className="mb-3" style={{ fontSize: "16px" }}>MY PROFILE</h5>
        <div className="d-flex align-items-center ms-5">
          <div className="text-center me-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="rounded-circle"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between">
              {isEditingName ? (
                <input
                  type="text"
                  value={userName}
                  onChange={handleNameChange}
                  style={{
                    border: "1px solid #7f7f7f",
                    outline: "none",  
                    color: "white",
                    backgroundColor: "transparent",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                />
              ) : (
                <h5 className="mb-1" onDoubleClick={() => setIsEditingName(true)}>{userName}</h5>
              )}

              {!isEditingName ? (
                <div className="d-flex flex-row gap-3">
                  <i className="bi bi-pencil text-primary fs-4" onClick={() => setIsEditingName(true)}></i>
                </div>
              ) : (
                <div className="d-flex flex-row gap-3">
                  <i className="bi bi-check fs-4" style={{ color: "green", cursor: "pointer" }} onClick={saveUser}></i>
                  <i className="bi bi-x fs-4" style={{ color: "red", cursor: "pointer" }} onClick={() => setIsEditingName(false)}></i>
                </div>
              )}

            </div>
            {user.description && <p className="mb-1">{user.description}</p>}
            <p className="mb-1">{hideEmail(user.email)}</p>
          </div>
        </div>

        <h5 className="mt-4 mb-3" style={{ fontSize: "16px" }}>APPEARANCE</h5>
        <div className="d-flex ms-5 gap-3">
          <ColorButton color="purple" onClick={() => changeColor("purple")}/>
          <ColorButton color="green" onClick={() => changeColor("green")} />
          <ColorButton color="blue" onClick={() => changeColor("blue")}/>
        </div>

        <h5 className="mt-4 mb-3" style={{ fontSize: "16px" }}>ACCESSIBILITY</h5>
        <div className="d-flex ms-5 gap-3">
          {onChangeEmail && (
            <Button className="button-modal" onClick={onChangeEmail}>
              <i className="bi bi-envelope"></i> Cambiar Email
            </Button>
          )}
          {onChangePassword && (
            <Button className="button-modal" onClick={onChangePassword}>
              <i className="bi bi-key"></i> Cambiar Contraseña
            </Button>
          )}
          {onLogOut && (
            <Button className="button-modal" onClick={onLogOut}>
              <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsModal;
