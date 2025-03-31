import React, { useEffect, useState } from "react";
import logo from "/SCrbnll.png";
import { useParams } from "react-router-dom";
import ApiManager from "@/context/apiCalls";
import { Group } from "@/services/api/types";
import GroupModal from "@/components/groups/GroupModal";

const GroupView: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const [group, setGroup] = React.useState<Group | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const apiCalls = new ApiManager();

    useEffect(() => {
        const getGroupInfo = async () => {
          if (!id) return; 
    
          const groupId = parseInt(id, 10); 
          try {
            const response = await apiCalls.getGroup(groupId); 
            setGroup(response);
          } catch (error) {
            console.error("Error al obtener el grupo:", error);
          }
        };
    
        getGroupInfo();
      }, [id]);

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
          <i className="mx-3 ms-auto bi bi-gear" style={{ fontSize: "20px", cursor: "pointer" }} />
        
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

        <div style={styles.content}>
            <p>Contenido aquí</p>
        </div>
        </div>

      </section>
      {group && (
        <GroupModal
          show={modalOpen}
          handleClose={handleCloseModal}
          group={group}
          onLeftGroup={() => alert(`Has abandonado el grupo: ${group.name}`)}
          onEditGroup={() => alert(`Editando grupo: ${group.name}`)}
          onInviteGroup={() => alert(`Invitando usuarios al grupo: ${group.name}`)}
        />
      )}
    </div>
  );
};

export default GroupView;
