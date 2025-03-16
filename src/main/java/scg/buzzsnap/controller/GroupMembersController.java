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

import scg.buzzsnap.model.GroupMembers;
import scg.buzzsnap.service.GroupMembersService;

@RestController
@RequestMapping("/groupmembers")
public class GroupMembersController {
	@Autowired
	GroupMembersService groupMembersService;

	@GetMapping("")
	public List<GroupMembers> list() {
		return groupMembersService.listAllGroupMembers();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<GroupMembers> get(@PathVariable Integer id) {
		try {
			GroupMembers usr = groupMembersService.getGroupMembers(id);
			return new ResponseEntity<GroupMembers>(usr, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<GroupMembers>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/user/{userId}")
	public List<GroupMembers> getByUser (@PathVariable Integer userId) {
		return groupMembersService.getGroupMembersByUser(userId);	
	}
	
	@GetMapping("/group/{groupId}")
	public List<GroupMembers> getByGroup (@PathVariable Integer groupId) {
		return groupMembersService.getGroupMembersByGroup(groupId);	
	}
	
	
	@PostMapping("")
	public ResponseEntity<Integer> add(@RequestBody GroupMembers grp) {
		GroupMembers groupMemberNew = groupMembersService.saveGroupMembers(grp);
		return new ResponseEntity<>(groupMemberNew.getId(), HttpStatus.CREATED);
	}
	
	@PutMapping("/change/{id}/{role}")
	public ResponseEntity<GroupMembers> update (@PathVariable Integer id, @PathVariable String role) {
		try {
			GroupMembers actualGroupMember = groupMembersService.getGroupMembers(id);
			actualGroupMember.setRole(role);
			groupMembersService.saveGroupMembers(actualGroupMember);
			return new ResponseEntity<GroupMembers>(HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<GroupMembers>(HttpStatus.NOT_FOUND);
		}
	}
		
	@DeleteMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Integer id) {
		try {
			groupMembersService.deleteGroupMembers(id);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (EmptyResultDataAccessException e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

}
