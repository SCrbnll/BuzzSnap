package scg.buzzsnap.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import scg.buzzsnap.model.Friends;

public interface FriendsRepository extends JpaRepository<Friends, Integer> {
	
	@Query("SELECT f FROM Friends f WHERE f.usersOrder = :usersOrder")
	Optional<Friends> findByUsersOrder(@Param("usersOrder") String usersOrder);
	
	@Query("SELECT f FROM Friends f WHERE (f.user.id = :user OR f.friend.id = :user) AND f.status = 'accepted' AND (f.user.closed = false OR f.friend.closed = false)")
	List<Friends> findByUserId(@Param("user") Integer user);
	
	@Query("SELECT f FROM Friends f WHERE f.friend.id = :friend AND f.status = 'pending'")
	List<Friends> findByFriendIdPending(@Param("friend") Integer friend);

}
