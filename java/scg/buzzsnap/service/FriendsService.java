package scg.buzzsnap.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import scg.buzzsnap.model.Friends;
import scg.buzzsnap.repository.FriendsRepository;

@Service
@Transactional
public class FriendsService {
	@Autowired
	private FriendsRepository friendsRepository;	

	public FriendsService() {
	}
	public List<Friends> listAllFriends() {
		return friendsRepository.findAll();
	}
	public Friends getFriend(Integer id) {
		return friendsRepository.findById(id).get();
	}
	public Friends saveFriend(Friends usr) {
		return friendsRepository.save(usr);
	}
	public void deleteFriend(Integer id) {
		friendsRepository.deleteById(id);
	}
	public List<Friends> getFriendsByUserId(Integer userId) {
		return friendsRepository.findByUserId(userId);
	}

}
