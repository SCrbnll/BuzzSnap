import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ColorButton from "./ColorButton";
import ApiManager from "@/context/apiCalls";
import LocalStorageCalls from "@/context/localStorageCalls";
import { notifyError } from "../NotificationProvider";
import SocketCalls from "@/context/socketCalls";
import TokenUtils from "@/utils/TokenUtils";

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
  const storedUser = LocalStorageCalls.getStorageUser()
  ? JSON.parse(LocalStorageCalls.getStorageUser()!)
  : null;

  const decodedUser = storedUser ? TokenUtils.decodeToken(storedUser.token) : null;

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [userName, setUserName] = useState(decodedUser!.name);
  const [userDescription, setUserDescription] = useState(
    decodedUser!.description || ""
  );
  const [avatarUrl, setAvatarUrl] = useState(decodedUser!.avatar_url);
  const apiCalls = new ApiManager();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDescription(e.target.value);
  };

  const saveUser = async () => {
  try {
    const user = TokenUtils.mapJwtPayloadToUser(decodedUser!);
    const userDb = await apiCalls.getUser(user.id);
    const userUpdated = await apiCalls.updateUser({
      ...userDb!,
      name: userName,
      description: userDescription
    })
    const response = await apiCalls.updateToken(userUpdated);
    if ("error" in response) {
      throw new Error(response.error);
    }
    const { token, refreshToken } = response;
    LocalStorageCalls.setStorageUser({ token, refreshToken });

    setIsEditingName(false);
    setIsEditingDescription(false);
    SocketCalls.syncData();
  } catch (error) {
    notifyError("Error al guardar el usuario");
  }
};


  const changeColor = async (color: string) => {
    try {
      const user = await apiCalls.updateColor(decodedUser!.id, color);
      document.body.setAttribute("data-theme", color);
      const response = await apiCalls.updateToken(user);
      if ("error" in response) {
        throw new Error(response.error);
      }
      const { token, refreshToken } = response;
      LocalStorageCalls.setStorageUser({ token, refreshToken });
      SocketCalls.syncData();

    } catch (error) {
      notifyError("Error al cambiar color");
    }
  };

  const hideEmail = (email: string) => {
    const [username, domain] = email.split("@");
    const hiddenUsername = username.slice(0, 3) + "***";
    return hiddenUsername + "@" + domain;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO : Por implementar en S3 AWS
    console.log(e)
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Ajustes</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h5 className="mb-3" style={{ fontSize: "16px" }}>
          MY PROFILE
        </h5>
        <div className="d-flex align-items-center ms-5">
          <div className="text-center me-3 position-relative">
            <img
              src={avatarUrl}
              alt={decodedUser!.name}
              className="rounded-circle"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />

            {/* Botón de cambiar imagen */}
            <label
              htmlFor="avatarUpload"
              className="position-absolute bg-dark rounded-circle d-flex justify-content-center align-items-center"
              style={{
                bottom: 0,
                right: 0,
                width: "30px",
                height: "30px",
                cursor: "pointer",
                border: "2px solid white",
              }}
            >
              <i
                className="bi bi-camera-fill text-white"
                style={{ fontSize: "16px" }}
              ></i>
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log("Imagen seleccionada:", file);
                    handleImageChange(e);
                  }
                }}
                style={{ display: "none" }}
              />
            </label>
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
                <h5
                  className="mb-1"
                  onDoubleClick={() => {
                    setIsEditingName(true);
                    setIsEditingDescription(false);
                  }}
                >
                  {userName}
                </h5>
              )}

              {!isEditingName ? (
                <i
                  className="bi bi-pencil text-primary fs-4"
                  onClick={() => {
                    setIsEditingName(true);
                    setIsEditingDescription(true);
                  }}
                ></i>
              ) : (
                <div className="d-flex flex-row gap-3">
                  <i
                    className="bi bi-check fs-4"
                    style={{ color: "green", cursor: "pointer" }}
                    onClick={saveUser}
                  ></i>
                  <i
                    className="bi bi-x fs-4"
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => {
                      setIsEditingName(false);
                      setIsEditingDescription(false);
                    }}
                  ></i>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              {isEditingDescription ? (
                <input
                  type="text"
                  value={userDescription}
                  onChange={handleDescriptionChange}
                  style={{
                    border: "1px solid #7f7f7f",
                    outline: "none",
                    color: "white",
                    backgroundColor: "transparent",
                    fontSize: "14px",
                    width: "400px",
                  }}
                />
              ) : (
                <p
                  className="mb-1"
                  onDoubleClick={() => {
                    setIsEditingName(true);
                    setIsEditingDescription(true);
                  }}
                  style={{
                    maxWidth: "300px",  
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis",
                  }}
                  title={userDescription}
                >
                  {userDescription}
                </p>
              )}
            </div>
            <p className="mb-1">{hideEmail(decodedUser!.email)}</p>
          </div>
        </div>

        <h5 className="mt-4 mb-3" style={{ fontSize: "16px" }}>
          APPEARANCE
        </h5>
        <div className="d-flex ms-5 gap-3">
          <ColorButton color="purple" onClick={() => changeColor("purple")} />
          <ColorButton color="green" onClick={() => changeColor("green")} />
          <ColorButton color="blue" onClick={() => changeColor("blue")} />
        </div>

        <h5 className="mt-4 mb-3" style={{ fontSize: "16px" }}>
          ACCESSIBILITY
        </h5>
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
