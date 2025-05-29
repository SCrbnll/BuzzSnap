package scg.buzzsnap.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import scg.buzzsnap.model.Groups;

public interface GroupsRepository extends JpaRepository<Groups, Integer> {
		
    @Query("SELECT g FROM Groups g WHERE g.creator.id = :createdBy")
    List<Groups> findByCreatedBy(@Param("createdBy") int createdBy);
    
    @Query("SELECT g FROM Groups g WHERE g.inviteCode = :inviteCode")
    Groups getByInviteCode(@Param("inviteCode") String inviteCode);

}
