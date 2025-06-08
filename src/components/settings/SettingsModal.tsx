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
  const storedUser = LocalStorageCalls.getStorageUser() ? JSON.parse(LocalStorageCalls.getStorageUser()!) : null;
  const decodedUser = storedUser ? TokenUtils.decodeToken(storedUser.token) : null;
  const predefinedAvatars: string[] = ['/pfp/anakin.jpg', '/pfp/boba.jpg', '/pfp/chewbacca.jpg', '/pfp/clon1.jpg',  '/pfp/clon2.jpg',  '/pfp/darth-vader.jpg',  '/pfp/dooku.jpg',  '/pfp/grievous.jpg',  '/pfp/obiwan.jpg',  '/pfp/padme.jpg',  '/pfp/r2d2.jpg'];

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [userName, setUserName] = useState(decodedUser!.name);
  const [userDescription, setUserDescription] = useState(
    decodedUser!.description || ""
  );
  const [avatarUrl] = useState(decodedUser!.avatar_url);
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
        description: userDescription,
      });
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

  const updateAvatar = async (avatarUrl: string) => {
    try {
      const user = TokenUtils.mapJwtPayloadToUser(decodedUser!);
      const userDb = await apiCalls.getUser(user.id);
      const userUpdated = await apiCalls.updateUser({
        ...userDb!,
        avatarUrl: avatarUrl,
      });
      const response = await apiCalls.updateToken(userUpdated);
      if ("error" in response) {
        throw new Error(response.error);
      }
      const { token, refreshToken } = response;
      LocalStorageCalls.setStorageUser({ token, refreshToken });
      SocketCalls.syncData();
      setShowAvatarModal(false);
      window.location.reload();
    } catch (error) {
      notifyError("Error al guardar el usuario");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Ajustes</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <h5 className="mb-3" style={{ fontSize: "16px" }}>
            MY PROFILE
          </h5>

          <div className="d-flex flex-column flex-md-row align-items-center gap-3">
            <div className="position-relative text-center">
              <img
                src={avatarUrl}
                alt={decodedUser!.name}
                className="rounded-circle"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
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
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div className="flex-grow-1 w-100">
              <div className="d-flex justify-content-between align-items-start">
                {isEditingName ? (
                  <input
                    type="text"
                    value={userName}
                    onChange={handleNameChange}
                    className="form-control bg-transparent text-white fw-bold"
                    style={{ fontSize: "18px" }}
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
                    style={{ cursor: "pointer" }}
                  ></i>
                ) : (
                  <div className="d-flex gap-3">
                    <i
                      className="bi bi-check fs-4 text-success"
                      onClick={saveUser}
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="bi bi-x fs-4 text-danger"
                      onClick={() => {
                        setIsEditingName(false);
                        setIsEditingDescription(false);
                      }}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                )}
              </div>

              <div>
                {isEditingDescription ? (
                  <input
                    type="text"
                    value={userDescription}
                    onChange={handleDescriptionChange}
                    className="form-control bg-transparent text-white"
                    style={{ fontSize: "14px" }}
                  />
                ) : (
                  <p
                    className="mb-1"
                    onDoubleClick={() => {
                      setIsEditingName(true);
                      setIsEditingDescription(true);
                    }}
                    style={{
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
          <div className="d-flex flex-wrap gap-3">
            <ColorButton color="purple" onClick={() => changeColor("purple")} />
            <ColorButton color="green" onClick={() => changeColor("green")} />
            <ColorButton color="blue" onClick={() => changeColor("blue")} />
          </div>

          <h5 className="mt-4 mb-3" style={{ fontSize: "16px" }}>
            ACCESSIBILITY
          </h5>
          <div className="d-flex flex-wrap gap-3">
            {onChangeEmail && (
              <Button
                className="button-modal w-100 w-md-auto"
                onClick={onChangeEmail}
              >
                <i className="bi bi-envelope"></i> Cambiar Email
              </Button>
            )}
            {onChangePassword && (
              <Button
                className="button-modal w-100 w-md-auto"
                onClick={onChangePassword}
              >
                <i className="bi bi-key"></i> Cambiar Contraseña
              </Button>
            )}
            {onLogOut && (
              <Button className="button-modal w-100 w-md-auto" onClick={onLogOut}>
                <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
              </Button>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)} centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Selecciona un avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {predefinedAvatars.map((src) => (
              <img
                key={src}
                src={src}
                alt="avatar"
                className="rounded-circle"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: avatarUrl === src ? "3px solid #007bff" : "2px solid white",
                }}
                onClick={() => updateAvatar(src)}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SettingsModal;
