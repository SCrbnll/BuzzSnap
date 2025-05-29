package scg.buzzsnap.controller;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import scg.buzzsnap.model.Chats;
import scg.buzzsnap.model.Friends;
import scg.buzzsnap.model.Users;
import scg.buzzsnap.service.FriendsService;

@RestController
@RequestMapping("/friends")
public class FriendsController {
	@Autowired
	FriendsService friendsService;

	@GetMapping("")
	public List<Friends> list() {
		return friendsService.listAllFriends();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Friends> get(@PathVariable Integer id) {
		try {
			Friends usr = friendsService.getFriend(id);
			return new ResponseEntity<Friends>(usr, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Friends>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/user/{userId}")
	public List<Friends> getByUser (@PathVariable Integer userId) {
		return friendsService.getFriendsByUserId(userId);	
	}
	
	@GetMapping("/pending/{friendId}")
	public List<Friends> getPending (@PathVariable Integer friendId) {
		return friendsService.findByFriendIdPending(friendId);	
	}
	
	
	@PostMapping("/create")
	public ResponseEntity<Friends> add(@RequestBody Friends friend) {
		int user1Id = friend.getUser().getId();
		int user2Id = friend.getFriend().getId();
		String usersOrder = (user1Id < user2Id) 
                ? user1Id + "-" + user2Id 
                : user2Id + "-" + user1Id;
		Optional<Friends> existingFriends = friendsService.getFriendsBetweenUsers(usersOrder);
		if (existingFriends.isPresent()) {
			Friends friendData = existingFriends.get();
			if ("canceled".equals(friendData.getStatus())) {
			    friendData.setStatus("pending");
			    friendsService.saveFriend(friendData);
			    return new ResponseEntity<>(friendData, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(existingFriends.get(), HttpStatus.OK);				
			}
		}
		
		Friends frndsNuevo = friendsService.saveFriend(friend);
		return new ResponseEntity<>(frndsNuevo, HttpStatus.CREATED);
	}
	
	@PutMapping("/accept/{id}")
	public ResponseEntity<Friends> accept (@PathVariable Integer id) {
		try {
			Friends actualfrnds = friendsService.getFriend(id);
			actualfrnds.setStatus("accepted");
			friendsService.saveFriend(actualfrnds);
			return new ResponseEntity<Friends>(HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Friends>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PutMapping("/reject/{id}")
	public ResponseEntity<Friends> reject (@PathVariable Integer id) {
		try {
			friendsService.deleteFriend(id);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (EmptyResultDataAccessException e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
		
	@DeleteMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Integer id) {
		try {
			friendsService.deleteFriend(id);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (EmptyResultDataAccessException e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

}
