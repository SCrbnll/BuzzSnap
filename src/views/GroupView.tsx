import React, { useEffect, useState } from "react";
import logo from "/SCrbnll.png";
import { useParams } from "react-router-dom";
import ApiManager from "@/context/apiCalls";
import { Group, Message } from "@/services/api/types";
import GroupModal from "@/components/groups/GroupModal";
import { notifyError } from "@/components/NotificationProvider";
import ChatBox from "@/components/chats/ChatBox";
import LocalStorageCalls from "@/context/localStorageCalls";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setCurrentGroupUserId } from "@/context/store";
import SocketCalls from "@/context/socketCalls";

const GroupView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = React.useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const apiCalls = new ApiManager();
  const currentUser = JSON.parse(LocalStorageCalls.getStorageUser() || "{}");
  const dispatch = useDispatch();
  const currentGroupUserId = useSelector(
    (state: RootState) => state.app.currentGroupUserId
  );

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
      backgroundColor: "#8A8A8A",
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
              <div style={styles.chat} className="mb-3 gap-3">
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
          onLeftGroup={() => alert(`Has abandonado el grupo: ${group.name}`)}
          onEditGroup={() => alert(`Editando grupo: ${group.name}`)}
          onInviteGroup={() =>
            alert(`Invitando usuarios al grupo: ${group.name}`)
          }
        />
      )}
    </div>
  );
};

export default GroupView;
