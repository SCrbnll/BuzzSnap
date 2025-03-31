import { Group } from "@/services/api/types";
import React from "react";
import { Modal, Button } from "react-bootstrap";

interface GroupModalProps {
  show: boolean;
  handleClose: () => void;
  group: Group;
  onLeftGroup?: () => void;
  onEditGroup?: () => void;
  onInviteGroup?: () => void;
}

const GroupModal: React.FC<GroupModalProps> = ({
  show,
  handleClose,
  group,
  onLeftGroup,
  onEditGroup,
  onInviteGroup,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>{group.name} </Modal.Title>
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
            {group.description && <p><b>Description: </b> {group.description}</p>}
            {group.creator && <p><b>Created By: </b>{group.creator.name}</p>}
            {group.inviteCode && <p><b>Invite Code: </b>{group.inviteCode}</p>}
            {group.createdAt && <p><b>Created At: </b>{group.createdAt}</p>}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-center">
        {onLeftGroup && (
          <Button className="button-modal" onClick={onLeftGroup}>
            <i className="bi bi-box-arrow-right"></i> Abandonar Grupo
          </Button>
        )}
        {onEditGroup && (
          <Button className="button-modal" onClick={onEditGroup}>
            <i className="bi bi-pencil"></i> Editar Grupo
          </Button>
        )}
        {onInviteGroup && (
          <Button className="button-modal" onClick={onInviteGroup}>
            <i className="bi bi-person"></i> Invitar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default GroupModal;
