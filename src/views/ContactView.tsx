import React, { useEffect, useState } from "react";
import ApiManager from "@/context/apiCalls";
import { Friend } from "@/services/api/types";

const ContactView: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const apiManager = new ApiManager();
                const friendList = await apiManager.getFriends();
                setFriends(friendList);
                console.log("Amigos del usuario:", friendList);
            } catch (error) {
                console.error("Error al obtener los amigos:", error);
            }
        };

        fetchFriends();
    }, []);

    const styles: { [key: string]: React.CSSProperties } = {
        separator: {
            width: "100%",
            margin: "15px auto",
        },
        nav: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "0 10px",
            marginTop: "50px",
        },
        button: {
            backgroundColor: "#ccc",
            width: "100px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
        },
        buttonActive: {
            backgroundColor: "#FFA600",
        },
        buttonsContainer: {
            display: "flex",
            flex: 1,
            gap: "10px",
        },
        addButton: {
            marginLeft: "auto",
        },
        contentWrapper: {
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch", 
            paddingRight: "10px", 
            maxHeight: "750px", 
            position: "relative",
            scrollbarWidth: "none", 
            msOverflowStyle: "none", 
        },
        contentWrapperWebkit: {
            flex: 1,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch", 
            paddingRight: "10px", 
            maxHeight: "750px", 
            position: "relative",
            scrollbarWidth: "none",
            msOverflowStyle: "none", 
        },
        content: {
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            padding: "0 10px",
        },
        friendCard: {
            backgroundColor: "#8A8A8A",
            padding: "10px",
            display: "flex",
            borderRadius: "8px",
        },
        friendInfo: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: 1,
        },
        avatar: {
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            marginLeft: "30px",
        },
        textContainer: {
            marginLeft: "20px",
        },
        friendName: {
            margin: 0,
            fontWeight: "bold",
        },
        friendDescription: {
            margin: 0,
            fontSize: "12px",
        },
        buttonContainer: {
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginRight: "20px",
        },
        icon: {
            fontSize: "20px",
            cursor: "pointer",
        },
    };

    return (
        <div style={{ padding: "0 40px" }}>
            <nav style={styles.nav} className="d-flex flex-row align-items-center">
                <div style={styles.buttonsContainer}>
                    <button style={{ ...styles.button, ...styles.buttonActive }}>
                        Activos
                    </button>
                    <button style={styles.button}>Todos</button>
                    <button style={styles.button}>Solicitudes</button>
                </div>
                <button style={{ ...styles.button, ...styles.addButton }}>
                    Añadir
                </button>
            </nav>
            <hr style={styles.separator} />

            <div style={styles.contentWrapper} className="contentWrapper">
                <div style={styles.content}>
                    {friends.map((friend) => (
                        <div key={friend.id} style={styles.friendCard}>
                            <div style={styles.friendInfo}>
                                <img
                                    src={friend.user.avatarUrl}
                                    alt={friend.user.name}
                                    style={styles.avatar}
                                />
                                <div style={styles.textContainer}>
                                    <p style={styles.friendName}>{friend.user.name}</p>
                                    <p style={styles.friendDescription}>{friend.user.description}</p>
                                </div>
                            </div>
                            <div style={styles.buttonContainer}>
                                <i className="bi bi-chat-dots" style={styles.icon} onClick={() => alert("Enviar mensaje")}/>
                                <i className="bi bi-three-dots-vertical" style={styles.icon} onClick={() => alert("Opciones")} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactView;
