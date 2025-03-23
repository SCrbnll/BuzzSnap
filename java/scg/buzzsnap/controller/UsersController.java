package scg.buzzsnap.controller;

import java.util.Date;
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

import scg.Utils;
import scg.buzzsnap.model.Users;
import scg.buzzsnap.service.UsersService;

@RestController
@RequestMapping("/users")
public class UsersController {
	@Autowired
	UsersService userService;

	@GetMapping("")
	public List<Users> list() {
		return userService.listAllUsers();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Users> get(@PathVariable Integer id) {
		try {
			Users usr = userService.getUser(id);
			return new ResponseEntity<Users>(usr, HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Users>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/login/{email}/{password}")
	public ResponseEntity<Users> login (@PathVariable String email, @PathVariable String password) {
		try {
			Users usr = userService.getUserByEmail(email);
			String pass = Utils.sha1(password);
			if(usr.getPassword().equals(pass)) {
				return new ResponseEntity<Users>(usr, HttpStatus.OK);
			} else throw new NoSuchElementException();
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Users>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	@PostMapping("")
	public ResponseEntity<Integer> add(@RequestBody Users usr) {
		usr.setPassword(Utils.sha1(usr.getPassword()));
		Users cliNuevo = userService.saveUser(usr);
		return new ResponseEntity<>(cliNuevo.getId(), HttpStatus.CREATED);
	}
	
	@PutMapping("/changepass/{id}")
	public ResponseEntity<Users> update (@PathVariable Integer id, @RequestBody String password) {
		try {
			Users actualCli = userService.getUser(id);
			if(actualCli.getPassword().equals(Utils.sha1(password))) {
				throw new NoSuchElementException();
			}
			String pass = Utils.sha1(password);
			actualCli.setPassword(pass);
			userService.saveUser(actualCli);
			return new ResponseEntity<Users>(HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Users>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PutMapping("/connection/{id}")
	public ResponseEntity<Users> updateLastConnection (@PathVariable Integer id, @RequestBody Date newDate) {
		try {
			Users actualCli = userService.getUser(id);
			actualCli.setLastLogin(newDate);
			userService.saveUser(actualCli);
			return new ResponseEntity<Users>(HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<Users>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	@PutMapping("/changeprofile")
	public ResponseEntity<Integer> update (@RequestBody Users usr) {
		try {
			Users actualUser = userService.getUser(usr.getId());
			if(!actualUser.getPassword().equals(usr.getPassword())) {
			throw new NoSuchElementException();
			}
			actualUser.setName(usr.getName());
			actualUser.setEmail(usr.getEmail());
			actualUser.setPassword(usr.getPassword());
			actualUser.setAvatarUrl(usr.getAvatarUrl());
			actualUser.setDescription(usr.getDescription());
			actualUser.setTheme(usr.getTheme());
			userService.saveUser(actualUser);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (NoSuchElementException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	
	@DeleteMapping("/unsubscribe/{id}")
	public ResponseEntity<?> update(@PathVariable Integer id) {
		try {
			Users actualUser = userService.getUser(id);
			actualUser.setClosed(true);
			userService.saveUser(actualUser);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (EmptyResultDataAccessException e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

}
