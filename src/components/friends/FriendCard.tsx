import React from "react";

interface FriendCardProps {
  friend: any;
  onSendMessage?: () => void; 
  onOptionsClick?: () => void;
  onAcceptClick?: () => void;
  onDeleteClick?: () => void;
  isActive?: boolean; 
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onSendMessage,
  onOptionsClick,
  onAcceptClick,
  onDeleteClick,
  isActive,
}) => {
  const styles: { [key: string]: React.CSSProperties } = {
    friendCard: {
      padding: "10px",
      display: "flex",
      borderRadius: "8px",
      alignItems: "center",
      position: "relative" as "relative", 
    },
    friendInfo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flex: 1,
    },
    avatarWrapper: {
      position: "relative" as "relative", 
    },
    avatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      marginLeft: "30px",
    },
    statusIndicator: {
      position: "absolute" as "absolute", 
      bottom: "0px",
      right: "0px",
      width: "15px",
      height: "15px",
      borderRadius: "50%",
      border: isActive ? "3px solid #8A8A8A" : "3px solid #8A8A8A",
      backgroundColor: isActive ? "green" : "black",
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
    <div style={styles.friendCard} className="friend-card">
      <div style={styles.friendInfo}>
        <div style={styles.avatarWrapper}>
          <img
            src={friend.avatarUrl}
            alt={friend.name}
            style={styles.avatar}
          />
          <div style={styles.statusIndicator} />
        </div>
        <div style={styles.textContainer}>
          <p style={styles.friendName}>{friend.name}</p>
          <p style={styles.friendDescription}>{friend.description}</p>
        </div>
      </div>

      <div style={styles.buttonContainer}>
        {onSendMessage && (
          <i
            className="bi bi-chat-dots"
            style={styles.icon}
            onClick={onSendMessage}
          />
        )}
        {onOptionsClick && (
          <i
            className="bi bi-three-dots-vertical"
            style={styles.icon}
            onClick={onOptionsClick}
          />
        )}
        {onAcceptClick && (
          <i
            className="bi bi-check-circle"
            style={styles.icon}
            onClick={onAcceptClick}
          />
        )}
        {onDeleteClick && (
          <i
            className="bi bi-x-circle"
            style={styles.icon}
            onClick={onDeleteClick}
          />
        )}
      </div>
    </div>
  );
};

export default FriendCard;
