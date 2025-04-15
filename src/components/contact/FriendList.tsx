import FriendCard from "@/components/friends/FriendCard";
import { Friend } from "@/services/api/types";

type FriendListProps = {
  friends: Friend[];
  userId: number;
  activeFilter: string;
  onAcceptClick?: (id: number) => void;
  onRejectClick?: (id: number) => void;
  onOptionsClick?: (friend: Friend) => void;
};

const FriendList: React.FC<FriendListProps> = ({
  friends,
  userId,
  activeFilter,
  onAcceptClick,
  onRejectClick,
  onOptionsClick,
}) => {
  return (
    <>
      {friends.map((friend) => {
        const displayUser = friend.friend.id === userId ? friend.user : friend.friend;
        const isActive = displayUser.lastLogin === null;

        return (
          <FriendCard
            key={friend.id}
            friend={displayUser}
            isActive={isActive}
            onAcceptClick={
              activeFilter === "solicitudes"
                ? () => onAcceptClick?.(friend.id!)
                : undefined
            }
            onDeleteClick={
              activeFilter === "solicitudes"
                ? () => onRejectClick?.(friend.id!)
                : undefined
            }
            onOptionsClick={
              activeFilter !== "solicitudes"
                ? () => onOptionsClick?.(friend)
                : undefined
            }
            onSendMessage={
              activeFilter !== "solicitudes"
                ? () => alert("Enviar mensaje")
                : undefined
            }
          />
        );
      })}
    </>
  );
};

export default FriendList;
