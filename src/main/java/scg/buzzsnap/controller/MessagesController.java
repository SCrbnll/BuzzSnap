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

import scg.buzzsnap.model.Messages;
import scg.buzzsnap.service.MessagesService;

@RestController
@RequestMapping("/messages")
public class MessagesController {
	@Autowired
	MessagesService messagesService;

	@GetMapping("")
	public List<Messages> list() {
		return messagesService.listAllMessages();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Messages> get(@PathVariable Integer id) {
		try {
			Messages usr = messagesService.getMessage(id);
			return new ResponseEntity<Messages>(usr, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Messages>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/sender/{userId}")
	public List<Messages> getByUser (@PathVariable Integer userId) {
		return messagesService.getMessagesBySender(userId);	
	}
	
	@GetMapping("/chat/{chatId}")
	public List<Messages> getByChat (@PathVariable Integer chatId) {
		return messagesService.getMessagesByChat(chatId);	
	}
	
	@GetMapping("/group/{groupId}")
	public List<Messages> getByGroup (@PathVariable Integer groupId) {
		return messagesService.getMessagesByGroup(groupId);	
	}
	
	@PostMapping("")
	public ResponseEntity<Integer> add(@RequestBody Messages msg) {
		msg.setMessageType("text");
		Messages messagesNew = messagesService.saveMessage(msg);
		return new ResponseEntity<>(messagesNew.getId(), HttpStatus.CREATED);
	}
	
	@PutMapping("/send/{id}")
	public ResponseEntity<Messages> update (@PathVariable Integer id, @RequestBody String message) {
		try {
			Messages actualMessage = messagesService.getMessage(id);
			actualMessage.setContent(message);
			messagesService.saveMessage(actualMessage);
			return new ResponseEntity<Messages>(HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Messages>(HttpStatus.NOT_FOUND);
		}
	}
		
	@DeleteMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Integer id) {
		try {
			messagesService.deleteMessage(id);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (EmptyResultDataAccessException e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

}
