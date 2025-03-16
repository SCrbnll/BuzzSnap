package scg.buzzsnap.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import scg.buzzsnap.model.GroupMembers;

public interface GroupMembersRepository extends JpaRepository<GroupMembers, Integer> {
		
    @Query("SELECT gm FROM GroupMembers gm WHERE gm.group.id = :group")
    List<GroupMembers> findByGroup(@Param("group") int group);
    
    @Query("SELECT gm FROM GroupMembers gm WHERE gm.user.id = :user")
    List<GroupMembers> findByUser(@Param("user") int user);

}
