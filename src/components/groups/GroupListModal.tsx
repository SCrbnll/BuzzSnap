import { FC, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Collapse, Image } from 'react-bootstrap';
import {  User } from '@/services/api/types';
import UserInfoModal from '../users/UserInfoModal';

interface GroupListModalProps {
    show: boolean;
    onClose: () => void;
    users: User[];
  }

const GroupListModal: FC<GroupListModalProps> = ({ show, onClose, users }) => {
  const [showOnline, setShowOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const onlineUsers = users.filter(user => user.lastLogin === null);
  const offlineUsers = users.filter(user => user.lastLogin !== null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleUserInfoClose = () => {
    setSelectedUser(null);
  };

  return (
    <>
    <Modal show={show} onHide={onClose}  size="lg" centered>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Miembros del grupo</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <div className="mb-3">
          <Button
            variant="outline-success"
            onClick={() => setShowOnline(!showOnline)}
            aria-controls="online-users"
            aria-expanded={showOnline}
            className="w-100 text-start"
          >
            🟢 Online ({onlineUsers.length})
          </Button>
          <Collapse in={showOnline}>
            <div id="online-users" className="mt-2">
              {onlineUsers.map(user => (
                <div key={user.id} className="d-flex align-items-center mb-2" onClick={() => handleUserClick(user)} style={{ cursor: 'pointer' }} >
                  <Image src={user.avatarUrl} roundedCircle width={40} height={40} className="me-2" />
                  <span>{user.displayName}</span>
                </div>
              ))}
              {onlineUsers.length === 0 && <small className="text-muted">No hay usuarios en línea</small>}
            </div>
          </Collapse>
        </div>

        <div>
          <Button
            variant="outline-secondary"
            onClick={() => setShowOffline(!showOffline)}
            aria-controls="offline-users"
            aria-expanded={showOffline}
            className="w-100 text-start"
          >
            ⚪ Offline ({offlineUsers.length})
          </Button>
          <Collapse in={showOffline}>
            <div id="offline-users" className="mt-2">
              {offlineUsers.map(user => (
                <div
                  key={user.id}
                  className="d-flex align-items-center mb-2 opacity-50"
                  onClick={() => handleUserClick(user)} 
                  style={{ cursor: 'pointer' }}
                >
                  <Image src={user.avatarUrl} roundedCircle width={40} height={40} className="me-2" />
                  <span>{user.displayName}</span>
                </div>
              ))}
              {offlineUsers.length === 0 && <small className="text-muted">No hay usuarios desconectados</small>}
            </div>
          </Collapse>
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>

    {selectedUser && (
        <UserInfoModal
        show={true}
        handleClose={handleUserInfoClose}
        user={selectedUser}
        />
    )}
    </>
  );
};

export default GroupListModal;
