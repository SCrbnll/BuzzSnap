package scg.buzzsnap.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import scg.buzzsnap.model.Chats;

public interface ChatsRepository extends JpaRepository<Chats, Integer> {
	
	@Query("SELECT c FROM Chats c WHERE c.id = :chatId")
    Chats findById(@Param("chatId") int chatId);
	
    @Query("SELECT c FROM Chats c WHERE c.usersOrder = :usersOrder")
    Optional<Chats> findByUsersOrder(@Param("usersOrder") String usersOrder);

    @Query("SELECT c FROM Chats c WHERE c.user1.id = :userId OR c.user2.id = :userId")
    List<Chats> findChatsByUserId(@Param("userId") int userId);
}
