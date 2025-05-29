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

import scg.buzzsnap.model.Groups;
import scg.buzzsnap.service.GroupsService;

@RestController
@RequestMapping("/groups")
public class GroupsController {
	@Autowired
	GroupsService groupsService;

	@GetMapping("")
	public List<Groups> list() {
		return groupsService.listAllGroups();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Groups> get(@PathVariable Integer id) {
		try {
			Groups usr = groupsService.getGroup(id);
			return new ResponseEntity<Groups>(usr, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Groups>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/user/{userId}")
	public List<Groups> getByUser (@PathVariable Integer userId) {
		return groupsService.getGroupsByCreator(userId);	
	}
	
	@GetMapping("/invite_code/{inviteCode}")
	public Groups getByInviteCode (@PathVariable String inviteCode) {
		return groupsService.getByInviteCode(inviteCode);	
	}
	
	@PostMapping("")
	public ResponseEntity<Integer> add(@RequestBody Groups grp) {
		Groups groupNuevo = groupsService.saveGroup(grp);
		return new ResponseEntity<>(groupNuevo.getId(), HttpStatus.CREATED);
	}
	
	@PutMapping("/change/{id}")
	public ResponseEntity<Groups> update (@PathVariable Integer id, @RequestBody Groups group) {
		try {
			Groups actualGroup = groupsService.getGroup(id);
			actualGroup.setName(group.getName());
			actualGroup.setImageUrl(group.getImageUrl());
			actualGroup.setDescription(group.getDescription());
			actualGroup.setCreator(group.getCreator());
			groupsService.saveGroup(actualGroup);
			return new ResponseEntity<Groups>(HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Groups>(HttpStatus.NOT_FOUND);
		}
	}
		
	@DeleteMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Integer id) {
		try {
			groupsService.deleteGroup(id);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (EmptyResultDataAccessException e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

}
