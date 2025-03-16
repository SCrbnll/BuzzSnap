package scg.buzzsnap.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import scg.buzzsnap.model.Messages;

public interface MessagesRepository extends JpaRepository<Messages, Integer> {
	
	@Query("SELECT m FROM Messages m WHERE m.sender.id = :sender")
	List<Messages> findBySender(@Param("sender") int sender);
	
	@Query("SELECT m FROM Messages m WHERE m.group.id = :group")
	List<Messages> findByGroup(@Param("group") int group);

}
