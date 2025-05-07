import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ApiManager from "@/context/apiCalls";
import LocalStorageCalls from "@/context/localStorageCalls";
import { notifyError, notifySuccess } from "../NotificationProvider";

interface Props {
  show: boolean;
  handleClose: () => void;
  onGroupCreated?: () => void; // callback si se quiere actualizar lista fuera
}

const CreateGroupModal: React.FC<Props> = ({ show, handleClose, onGroupCreated }) => {
  const currentUser = JSON.parse(LocalStorageCalls.getStorageUser()!);
  const apiCalls = new ApiManager();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!groupName || !inviteCode) {
      notifyError("Nombre e inviteCode son obligatorios");
      return;
    }

    // TODO: comprobar si el código de invitación ya existe (crear endpoint)
    // const exists = await api.checkInviteCodeExists(inviteCode);
    // if (exists) {
    //   notifyError("Este código de invitación ya está en uso.");
    //   return;
    // }

    const newGroup = {
      name: groupName,
      description,
      inviteCode,
      creator: currentUser,
    };

    try {
      setLoading(true);
        const newGroupId = await apiCalls.addGroup(newGroup);
        const group = await apiCalls.getGroup(newGroupId!);
        const now = new Date().toISOString();
        await apiCalls.addGroupMember({
            user: currentUser,
            group: group,
            role: "admin",
            joinedAt: now,
        });
      
      notifySuccess("Grupo creado con éxito");
      if (onGroupCreated) onGroupCreated();
      handleClose();
      resetForm();
    } catch (error) {
      notifyError("Error al crear el grupo");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    setInviteCode("");
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crear nuevo grupo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="groupName" className="mb-3">
            <Form.Label>Nombre del grupo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe el nombre de grupo que deseas crear"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Escribe una breve descripción del grupo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="inviteCode" className="mb-3">
            <Form.Label>Código de invitación (único)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe el código de invitación"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            />
            <Form.Text className="text-muted">
              Este código será necesario para que otros usuarios se unan.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creando..." : "Crear grupo"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateGroupModal;
