import React, { useState } from "react";
import { Modal, Button, Image } from "react-bootstrap";
import { Group } from "@/services/api/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import UserInfoModal from "./../users/UserInfoModal"; 
import { notifySuccess } from "../NotificationProvider";

interface GroupModalProps {
  show: boolean;
  handleClose: () => void;
  group: Group;
  currentUserId: number;
  onLeftGroup?: () => void;
  onEditGroup?: () => void;
  onInviteGroup?: () => void;
}

const GroupModal: React.FC<GroupModalProps> = ({
  show,
  handleClose,
  group,
  currentUserId,
  onLeftGroup,
  onEditGroup,
  onInviteGroup,
}) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const createdAtDate = new Date(group.createdAt!);
  const createdAtRelative = formatDistanceToNow(createdAtDate, {
    addSuffix: true,
    locale: es,
  });

  const handleInviteClick = () => {
    navigator.clipboard.writeText(group.inviteCode || "");
    notifySuccess("Código de invitación copiado al portapapeles");
    if (onInviteGroup) onInviteGroup();
  };

  const handleUserInfoClick = () => {
    if (group.creator) {
      setSelectedUser(group.creator);
      setShowUserModal(true);
    }
  };

  const isAdmin = group.creator?.id === currentUserId;

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{group.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex align-items-center">
            <div className="me-3">
              <img
                src={group.imageUrl}
                alt={group.name}
                className="rounded-circle"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>

            <div>
              {group.description && <p><b>Descripción:</b> {group.description}</p>}

              {group.creator && (
                <p>
                  <b>Creado por:</b>{" "}
                  <Button
                    variant="light"
                    className="d-inline-flex align-items-center p-1"
                    onClick={handleUserInfoClick}
                    style={{ border: "1px solid #ccc", borderRadius: "1rem" }}
                  >
                    <Image
                      src={group.creator.avatarUrl}
                      roundedCircle
                      width={30}
                      height={30}
                      className="me-2"
                    />
                    <span>{group.creator.name}</span>
                  </Button>
                </p>
              )}

              {group.inviteCode && (
                <p>
                  <b>Código de invitación:</b> <code>{group.inviteCode}</code>
                </p>
              )}

              <div className="tooltip-container">
                <p>
                  <b>Creado hace:</b>{" "}
                  <code className="fw-bold">{createdAtRelative}</code>
                </p>
                <span className="custom-tooltip">Fecha exacta: {createdAtDate.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-center">
          {onLeftGroup && (
            <Button className="button-modal" onClick={onLeftGroup}>
              <i className="bi bi-box-arrow-right"></i> Abandonar Grupo
            </Button>
          )}
          {isAdmin && onEditGroup && (
            <Button className="button-modal" onClick={onEditGroup}>
              <i className="bi bi-pencil"></i> Editar Grupo
            </Button>
          )}
          {group.inviteCode && (
            <Button className="button-modal" onClick={handleInviteClick}>
              <i className="bi bi-person-plus"></i> Invitar
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {selectedUser && (
        <UserInfoModal
          show={showUserModal}
          handleClose={() => setShowUserModal(false)}
          user={selectedUser}
        />
      )}

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
            background-color: rgba(0, 0, 0, 0.9);
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
    </>
  );
};

export default GroupModal;
