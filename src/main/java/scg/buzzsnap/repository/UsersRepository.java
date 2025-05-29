package scg.buzzsnap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import scg.buzzsnap.model.Users;

public interface UsersRepository extends JpaRepository<Users, Integer> {
	
	@Query("SELECT u FROM Users u WHERE u.email = :email AND u.closed = false")
	Users findByEmail(@Param("email") String email);
	
    @Query("SELECT u FROM Users u WHERE u.id = :usuarioId AND u.closed = false")
    Users findById(@Param("usuarioId") int usuarioId);
    
    @Query("SELECT u FROM Users u WHERE u.displayName = :displayName AND u.closed = false")
    Users findByDisplayName(@Param("displayName") String displayName);
}
