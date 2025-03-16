package scg.buzzsnap.controller;

import java.util.List;
import java.util.NoSuchElementException;

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

import scg.buzzsnap.model.Friends;
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
	
	
	@PostMapping("")
	public ResponseEntity<Integer> add(@RequestBody Friends frnds) {
		Friends frndsNuevo = friendsService.saveFriend(frnds);
		return new ResponseEntity<>(frndsNuevo.getId(), HttpStatus.CREATED);
	}
	
	@PutMapping("/changestatus/{id}/{status}")
	public ResponseEntity<Friends> update (@PathVariable Integer id, @PathVariable String status) {
		try {
			Friends actualfrnds = friendsService.getFriend(id);
			actualfrnds.setStatus(status);
			friendsService.saveFriend(actualfrnds);
			return new ResponseEntity<Friends>(HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Friends>(HttpStatus.NOT_FOUND);
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
