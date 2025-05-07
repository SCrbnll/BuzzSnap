import React, { useEffect, useState } from "react";
import logo from "/SCrbnll.png";
import { useNavigate, useParams } from "react-router-dom";
import ApiManager from "@/context/apiCalls";
import { Group, Message, User } from "@/services/api/types";
import GroupModal from "@/components/groups/GroupModal";
import { notifyError } from "@/components/NotificationProvider";
import ChatBox from "@/components/chats/ChatBox";
import LocalStorageCalls from "@/context/localStorageCalls";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setCurrentGroupUserId } from "@/context/store";
import SocketCalls from "@/context/socketCalls";
import GroupListModal from "@/components/groups/GroupListModal";

const GroupView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = React.useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMembers, setModalMembers] = useState<boolean>(false);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const apiCalls = new ApiManager();
  const currentUser = JSON.parse(LocalStorageCalls.getStorageUser() || "{}");
  const dispatch = useDispatch();
  const currentGroupUserId = useSelector((state: RootState) => state.app.currentGroupUserId);

  const fetchGroup = async (groupId: number) => {
    try {
      const groupData = await apiCalls.getGroup(groupId);
      setGroup(groupData);
      fetchMessages(groupId);
      dispatch(setCurrentGroupUserId(groupId));
      
    } catch (error) {
      notifyError("Error al obtener el grupo");
    }
  };

  const fetchMessages = async (groupId: number) => {
    try {
      const messagesData = await apiCalls.getMessagesByGroupId(groupId);
      setMessages(messagesData);
    } catch (error) {
      notifyError("Error al obtener los mensajes");
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const groupMembers = await apiCalls.getGroupMembersByGroupId(group!.id!);
      const users = []
      for (const member of groupMembers) {
        const user = await apiCalls.getUser(member.user.id);
        users.push(user);
      }
      setGroupUsers(users);
    } catch (error) {
      notifyError("Error al obtener los miembros del grupo");
    }
  };

  useEffect(() => {
    const getGroupInfo = async () => {
      if (!id) return;
      const groupId = parseInt(id, 10);
      try {
        fetchGroup(groupId);
        SocketCalls.joinGroup(groupId);
      } catch (error) {
        notifyError("Error al obtener el grupo");
      }
    };
    getGroupInfo();
  }, [id]);

  useEffect(() => {
      if (!currentUser?.id) return;
  
      SocketCalls.connect(currentUser.id, currentUser.displayName);
  
      SocketCalls.on("new_group_message", async (newMessageId: number) => {
        try {
          const messageResponse = await apiCalls.getMessage(newMessageId);
          const newMessage = messageResponse;
      
          if (newMessage.group?.id === group?.id) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          } 
        } catch (error) {
          console.error("Error al obtener el mensaje completo:", error);
        }
      });
      return () => {
        SocketCalls.off("new_group_message");
      };
    }, [group?.id, currentUser?.id]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenModalMembers = () => {
    setModalMembers(true);
    fetchGroupMembers();
  };

const leftGroup = async (group: Group, currentUser: User) => {
  try {
    const members = await apiCalls.getGroupMembersByGroupId(group.id!);
    const currentMembership = members.find(
      (member) => member.user.id === currentUser.id
    );

    const isCreator = group.creator.id === currentUser.id;
    const isAdmin = currentMembership!.role === "admin";

    if (isCreator || isAdmin) {
      alert("Eres el administrador del grupo. Debes transferir la administración antes de poder salir.");
      return;
    }

    const confirmed = window.confirm("¿Estás seguro que deseas abandonar el grupo?");
    if (confirmed) {
      await apiCalls.deleteGroupMember(currentMembership!.id!);
      alert("Has abandonado el grupo con éxito.");
      navigate("/home");
    }
  } catch (error) {
    console.error("Error al intentar abandonar el grupo:", error);
    alert("Ocurrió un error al intentar abandonar el grupo.");
  }
};


  const styles: { [key: string]: React.CSSProperties } = {
    aside: {
      width: "325px",
    },
    logo: {
      width: "35px",
      borderRadius: "50%",
    },
    chatList: {
      padding: "10px 0px 0px 30px",
      overflowY: "auto",
      marginBottom: "100px",
      scrollbarWidth: "none",
    },
    chat: {
      padding: "10px",
      cursor: "pointer",
      borderRadius: "10px",
      paddingLeft: "20px",
      backgroundColor: "#D9D9D9",
      color: "black",
      display: "flex",
      alignItems: "center",
    },
    chatText: {
      margin: 0,
      flex: 1,
    },
    content: {
      width: "80%",
      marginTop: "10px",
      borderRadius: "10px",
      marginBottom: "100px",
      backgroundColor: "#8A8A8A",
    },
  };

  return (
    <div>
      <nav style={styles.nav}>
        <ul className="d-flex flex-row align-items-center gap-4">
          <p onClick={() => handleOpenModal()}> {group?.name} </p>
        </ul>
      </nav>
      <hr style={styles.separator} />
      <section>
        <div className="d-flex vh-100 gap-3">
          <aside style={styles.aside} className="d-flex flex-column vh-100">
            <div style={styles.chatList}>
              <div style={styles.chat} className="mb-3 gap-3" onClick={() => handleOpenModalMembers()}>
                <img src={logo} alt="Icono" style={styles.logo} />
                <p style={styles.chatText}>Members</p>

              </div>
            </div>
          </aside>

          <ChatBox
            messages={messages}
            currentUserId={currentUser.id}
            chatId={null}
            groupId={currentGroupUserId}
          />
        </div>
      </section>
      {group && (
        <GroupModal
          show={modalOpen}
          handleClose={handleCloseModal}
          group={group}
          onLeftGroup={() => leftGroup(group, currentUser)}
          onEditGroup={() => alert(`Editando grupo: ${group.name}`)}
          currentUserId={currentUser.id}        
        />
      )}

    <GroupListModal show={modalMembers} onClose={() => setModalMembers(false)} users={groupUsers} />

    </div>
  );
};

export default GroupView;
