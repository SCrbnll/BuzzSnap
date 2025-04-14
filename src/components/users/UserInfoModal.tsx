import React from "react";
import { Modal, Button } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface UserInfoModalProps {
  show: boolean;
  handleClose: () => void;
  user: {
    avatarUrl: string;
    name: string;
    description?: string;
    email: string;
    lastLogin: string;
    createdAt: string;
  };
  onSendMessage?: () => void;
  onDeleteClick?: () => void;
  onRequestClick?: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({
  show,
  handleClose,
  user,
  onSendMessage,
  onDeleteClick,
  onRequestClick,
}) => {
  const lastLoginDate = new Date(user.lastLogin);
  const createdAtDate = new Date(user.createdAt);

  const lastLoginRelative = formatDistanceToNow(lastLoginDate, { addSuffix: true, locale: es });
  const createdAtRelative = formatDistanceToNow(createdAtDate, { addSuffix: true, locale: es });

  return (
    <Modal show={show} onHide={handleClose} centered>
      <style>
        {`
          .tooltip-container {
            position: relative;
            display: inline-block;
          }

          .custom-tooltip {
            position: absolute;
            top: 50%;
            left: 105%;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 1);
            color: white;
            padding: 5px 10px;
            border-radius: 10px;
            font-size: 12px;
            white-space: nowrap;
            visibility: hidden;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none;
            z-index: 9999;
          }

          .tooltip-container:hover .custom-tooltip {
            visibility: visible;
            opacity: 1;
          }
        `}
      </style>

      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Información del Usuario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex align-items-center">
          <div className="me-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="rounded-circle"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>

          <div>
            <h5 className="mb-1">{user.name}</h5>
            {user.description && <p>{user.description}</p>}

            <div className="tooltip-container">
              <p>Conectado <code className="fw-bold">{lastLoginRelative}</code></p>
              <span className="custom-tooltip">Último login: {lastLoginDate.toLocaleString()}</span>
            </div>

            <div className="tooltip-container">
            <p>Cuenta creada hace <code className="fw-bold">{createdAtRelative}</code></p>
            <span className="custom-tooltip">Creada: {createdAtDate.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-center">
        {onSendMessage && (
          <Button className="button-modal" onClick={onSendMessage}>
            <i className="bi bi-chat-dots"></i> Mensaje
          </Button>
        )}
        {onRequestClick && (
          <Button className="button-modal" onClick={onRequestClick}>
            <i className="bi bi-person-plus"></i> Solicitar
          </Button>
        )}
        {onDeleteClick && (
          <Button className="button-modal" onClick={onDeleteClick}>
            <i className="bi bi-trash"></i> Eliminar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserInfoModal;
