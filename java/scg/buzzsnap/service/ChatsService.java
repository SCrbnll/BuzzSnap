package scg.buzzsnap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import scg.buzzsnap.model.Chats;
import scg.buzzsnap.repository.ChatsRepository;

@Service
public class ChatsService {

    @Autowired
    private ChatsRepository chatsRepository;

    public Optional<Chats> getChatBetweenUsers(String usersOrder) {
        return chatsRepository.findByUsersOrder(usersOrder);
    }

    public List<Chats> getChatsByUserId(int userId) {
        return chatsRepository.findChatsByUserId(userId);
    }

    public Chats createChat(Chats chat) {
        return chatsRepository.save(chat);
    }
}
