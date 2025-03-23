package scg.buzzsnap.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import scg.buzzsnap.model.Friends;

public interface FriendsRepository extends JpaRepository<Friends, Integer> {
	
	@Query("SELECT f FROM Friends f WHERE f.user.id = :user")
	List<Friends> findByUserId(@Param("user") Integer user);

}
