package scg.buzzsnap.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import scg.buzzsnap.model.Messages;
import scg.buzzsnap.repository.MessagesRepository;

@Service
@Transactional
public class MessagesService {
	@Autowired
	private MessagesRepository messagesRepository;	

	public MessagesService() {
	}
	public List<Messages> listAllMessages() {
		return messagesRepository.findAll();
	}
	public Messages getMessage(Integer id) {
		return messagesRepository.findById(id).get();
	}
	public Messages saveMessage(Messages msg) {
		return messagesRepository.save(msg);
	}
	public void deleteMessage(Integer id) {
		messagesRepository.deleteById(id);
	}
	public List<Messages> getMessagesBySender(Integer userId) {
		return messagesRepository.findBySender(userId);
	}
	public List<Messages> getMessagesByChat(Integer chatId) {
		return messagesRepository.findByChat(chatId);
	}
	public List<Messages> getMessagesByGroup(Integer groupId) {
		return messagesRepository.findByGroup(groupId);
	}

}
