import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import ApiManager from "@/context/apiCalls";
import LocalStorageCalls from "@/context/localStorageCalls";
import { notifyError, notifySuccess } from "../NotificationProvider";
import TokenUtils from "@/utils/TokenUtils";

interface Props {
  show: boolean;
  handleClose: () => void;
  onGroupCreated?: () => void;
  onGroupJoined?: () => void;
}

const CreateOrJoinGroupModal: React.FC<Props> = ({ show, handleClose, onGroupCreated, onGroupJoined }) => {
  const storedUser = LocalStorageCalls.getStorageUser() ? JSON.parse(LocalStorageCalls.getStorageUser()!) : null;
  const decodedUser = storedUser ? TokenUtils.decodeToken(storedUser.token) : null;
  const user = decodedUser ? TokenUtils.mapJwtPayloadToUser(decodedUser) : null;
  const apiCalls = new ApiManager();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName || !inviteCode) {
      notifyError("Nombre e inviteCode son obligatorios");
      return;
    }

    const newGroup = {
      name: groupName,
      description,
      inviteCode,
      creator: user!,
    };

    try {
      setLoading(true);
      const newGroupId = await apiCalls.addGroup(newGroup);
      const group = await apiCalls.getGroup(newGroupId!);
      const now = new Date().toISOString();

      await apiCalls.addGroupMember({
        user: user!,
        group: group,
        role: "admin",
        joinedAt: now,
      });

      notifySuccess("Grupo creado con éxito");
      onGroupCreated?.();
      handleClose();
      resetForm();
    } catch (error) {
      notifyError("Error al crear el grupo");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) {
      notifyError("Debes ingresar un código de invitación");
      return;
    }

    try {
      setLoading(true);
      const group = await apiCalls.getGroupByInviteCode(joinCode);

      if (!group) {
        notifyError("Código de invitación no válido");
        return;
      }

      const now = new Date().toISOString();

      await apiCalls.addGroupMember({
        user: user!,
        group,
        role: "member",
        joinedAt: now,
      });

      notifySuccess("Te has unido al grupo correctamente");
      onGroupJoined?.();
      handleClose();
      resetForm();
    } catch (error) {
      notifyError("No se pudo unir al grupo");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGroupName("");
    setDescription("");
    setInviteCode("");
    setJoinCode("");
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Únete o crea un grupo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Card className="p-3">
              <h5>Unirse a un grupo</h5>
              <Form>
                <Form.Group controlId="joinCode" className="mb-3">
                  <Form.Label>Código de invitación</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Introduce el código de invitación"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleJoinGroup} disabled={loading}>
                  {loading ? "Uniéndose..." : "Unirse"}
                </Button>
              </Form>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-3">
              <h5>Crear un nuevo grupo</h5>
              <Form>
                <Form.Group controlId="groupName" className="mb-3">
                  <Form.Label>Nombre del grupo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Escribe el nombre del grupo"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Descripción del grupo"
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
                </Form.Group>

                <Button variant="success" onClick={handleCreateGroup} disabled={loading}>
                  {loading ? "Creando..." : "Crear grupo"}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default CreateOrJoinGroupModal;
