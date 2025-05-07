import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ApiManager from "@/context/apiCalls";
import { notifySuccess, notifyError } from "../NotificationProvider";
import { Group, User } from "@/services/api/types";

interface GroupSettingsModalProps {
  show: boolean;
  handleClose: () => void;
  group: Group;
  members: User[];
  onSave?: () => void;
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
  show,
  handleClose,
  group,
  members,
  onSave,
}) => {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || "");
  const [creatorId, setCreatorId] = useState<number>(group.creator.id);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const apiCalls = new ApiManager();

  useEffect(() => {
    setName(group.name);
    setDescription(group.description || "");
    setCreatorId(group.creator.id);
    setImageFile(null);
  }, [group]);

  const handleSave = async () => {
    try {
      // Aquí podrías incluir lógica futura de subida a AWS S3
      const selectedUser = members.find((member) => member.id === creatorId)


      const updatedGroup: Group = {
        ...group,
        name,
        description,
        creator: selectedUser ? selectedUser : group.creator,
        // imageUrl: ..., // cuando tengas S3
      };

      await apiCalls.updateGroup(updatedGroup);
      notifySuccess("Grupo actualizado correctamente");

      if (onSave) onSave();
      handleClose();
    } catch (error) {
      console.error(error);
      notifyError("Error al actualizar el grupo");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Imagen seleccionada:", file);
      setImageFile(file);
      // TODO: subir a S3 y setear la nueva imageUrl
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
            <div className="d-flex align-items-center gap-3">
              <img
                src={group.imageUrl}
                alt="Group"
                style={{ width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover" }}
              />
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
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
