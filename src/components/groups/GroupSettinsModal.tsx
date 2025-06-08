import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ApiManager from "@/context/apiCalls";
import { notifySuccess, notifyError } from "../NotificationProvider";
import { Group, User } from "@/services/api/types";
import { AppDispatch, syncAllData } from "@/context/store";
import { useDispatch } from "react-redux";
import SocketCalls from "@/context/socketCalls";

interface GroupSettingsModalProps {
  show: boolean;
  handleClose: () => void;
  group: Group;
  members: User[];
  onGroupUpdated?: () => void;
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
  show,
  handleClose,
  group,
  members,
  onGroupUpdated
}) => {
  const predefinedGroupImages: string[] = ['/groups/sith.png', '/groups/resistance.png'];
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || "");
  const [creatorId, setCreatorId] = useState<number>(group.creator.id);
  const [selectedImage, setSelectedImage] = useState<string>(group.imageUrl || predefinedGroupImages[0]);
  const apiCalls = new ApiManager();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
  setName(group.name);
  setDescription(group.description || "");
  setCreatorId(group.creator.id);
  setSelectedImage(group.imageUrl || predefinedGroupImages[0]);
}, [group]);


  const handleSave = async () => {
    try {
      const selectedUser = members.find((member) => member.id === creatorId)
     const updatedGroup: Group = {
        ...group,
        name,
        description,
        creator: selectedUser || group.creator,
        imageUrl: selectedImage,
      };
      if(selectedUser) {
        const groupMembers = await apiCalls.getGroupMembersByGroupId(group!.id!);
        const currentMembership = groupMembers.find((member) => member.user.id === selectedUser.id);
        const lastCreatorMembership = groupMembers.find((member) => member.user.id === group.creator.id);
        await apiCalls.updateGroupMember(currentMembership?.id!, "admin");
        await apiCalls.updateGroupMember(lastCreatorMembership!.id!, "member");
      }
      
      await apiCalls.updateGroup(updatedGroup);
      notifySuccess("Grupo actualizado correctamente");
      dispatch(syncAllData());
      if(onGroupUpdated) onGroupUpdated();
      SocketCalls.syncData();
      handleClose();
    } catch (error) {
      console.error(error);
      notifyError("Error al actualizar el grupo");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Grupo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del grupo</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del grupo"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del grupo"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagen del grupo</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              {predefinedGroupImages.map((img) => (
              <div
                key={img}
                onClick={() => setSelectedImage(img)}
                style={{
                  border: selectedImage === img ? "3px solid #0d6efd" : "2px solid transparent",
                  borderRadius: "10px",
                  padding: "5px",
                  backgroundColor: selectedImage === img ? "#e9f2ff" : "#f8f9fa",
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer"
                }}
              >
                <img
                  src={img}
                  alt="group"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "6px"
                  }}
                />
              </div>
            ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Transferir rol de administrador</Form.Label>
            <Form.Select
                value={creatorId}
                onChange={(e) => setCreatorId(Number(e.target.value))}
                >
                {members.map((member) => (
                    <option key={member.id} value={member.id}>
                    {member.displayName || `Usuario ${member.name}`}
                    </option>
                ))}
            </Form.Select>

          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupSettingsModal;
