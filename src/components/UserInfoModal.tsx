import React from "react";
import { Modal, Button } from "react-bootstrap";

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
  return (
    <Modal show={show} onHide={handleClose} centered >
      <Modal.Header closeButton>
        <Modal.Title>Información del Usuario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex align-items-center">
          {/* Imagen del usuario */}
          <div className="me-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="rounded-circle"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>

          {/* Información del usuario */}
          <div>
            <h5 className="mb-1">{user.name}</h5>
            {user.description && <p className="text-muted">{user.description}</p>}
            {user.email && <p className="text-muted">{user.email}</p>}
            {user.lastLogin && <p className="text-muted">{user.lastLogin}</p>}
            {user.createdAt && <p className="text-muted">{user.createdAt}</p>}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-center">
        {onSendMessage && (
          <Button variant="primary" onClick={onSendMessage}>
            <i className="bi bi-chat-dots"></i> Mensaje
          </Button>
        )}
        {onRequestClick && (
          <Button variant="warning" onClick={onRequestClick}>
            <i className="bi bi-person-plus"></i> Solicitar
          </Button>
        )}
        {onDeleteClick && (
          <Button variant="danger" onClick={onDeleteClick}>
            <i className="bi bi-trash"></i> Eliminar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UserInfoModal;
