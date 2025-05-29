package scg.buzzsnap.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import scg.buzzsnap.model.Groups;
import scg.buzzsnap.repository.GroupsRepository;

@Service
@Transactional
public class GroupsService {
	@Autowired
	private GroupsRepository groupsRepository;	

	public GroupsService() {
	}
	public List<Groups> listAllGroups() {
		return groupsRepository.findAll();
	}
	public Groups getGroup(Integer id) {
		return groupsRepository.findById(id).get();
	}
	public Groups saveGroup(Groups usr) {
		return groupsRepository.save(usr);
	}
	public void deleteGroup(Integer id) {
		groupsRepository.deleteById(id);
	}
	public List<Groups> getGroupsByCreator(Integer userId) {
		return groupsRepository.findByCreatedBy(userId);
	}
	public Groups getByInviteCode(String inviteCode) {
		return groupsRepository.getByInviteCode(inviteCode);
	}

}
