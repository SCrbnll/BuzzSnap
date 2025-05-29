package scg.buzzsnap.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import scg.buzzsnap.model.Chats;
import scg.buzzsnap.model.Friends;
import scg.buzzsnap.model.Users;
import scg.buzzsnap.service.ChatsService;

@RestController
@RequestMapping("/chats")
public class ChatsController {

    @Autowired
    private ChatsService chatsService;
    
    @GetMapping("/{chatId}")
    public ResponseEntity<Chats> getChatById(@PathVariable int chatId) {
        Chats chat = chatsService.getChatById(chatId);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @GetMapping("/{user1Id}/{user2Id}")
    public ResponseEntity<Chats> getChat(@PathVariable int user1Id, @PathVariable int user2Id) {
        String usersOrder = (user1Id < user2Id) ? user1Id + "-" + user2Id : user2Id + "-" + user1Id;

        Optional<Chats> chat = chatsService.getChatBetweenUsers(usersOrder);

        if (chat.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(chat.get(), HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public List<Chats> getChatsByUser(@PathVariable int userId) {
        return chatsService.getChatsByUserId(userId);
    }

    @PostMapping("/create/{user1Id}/{user2Id}")
    public ResponseEntity<Chats> createChat(@PathVariable Users user1Id, @PathVariable Users user2Id) {
        String usersOrder = (user1Id.getId() < user2Id.getId()) 
                            ? user1Id + "-" + user2Id 
                            : user2Id + "-" + user1Id;

        Optional<Chats> existingChat = chatsService.getChatBetweenUsers(usersOrder);

        if (existingChat.isPresent()) {
            return new ResponseEntity<>(existingChat.get(), HttpStatus.OK);
        }

        Chats newChat = new Chats();
        newChat.setUser1(user1Id);
        newChat.setUser2(user2Id);

        Chats createdChat = chatsService.createChat(newChat);

        return new ResponseEntity<>(createdChat, HttpStatus.CREATED);
    }
}
