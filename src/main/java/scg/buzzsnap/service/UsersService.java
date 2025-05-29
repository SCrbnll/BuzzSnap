package scg.buzzsnap.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import scg.buzzsnap.model.Users;
import scg.buzzsnap.repository.UsersRepository;

@Service
@Transactional
public class UsersService {
	@Autowired
	private UsersRepository usersRepository;	

	public UsersService() {
	}
	public List<Users> listAllUsers() {
		return usersRepository.findAll();
	}
	public Users getUser(Integer id) {
		return usersRepository.findById(id).get();
	}
	public Users saveUser(Users usr) {
		return usersRepository.save(usr);
	}
	public void deleteUser(Integer id) {
		usersRepository.deleteById(id);
	}
	public Users getUserByEmail(String email) {
		return usersRepository.findByEmail(email);
	}
	public Users getUserByDisplayName(String displayName) {
		return usersRepository.findByDisplayName(displayName);
	}

}
