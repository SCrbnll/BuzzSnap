package scg.buzzsnap.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import scg.buzzsnap.model.GroupMembers;
import scg.buzzsnap.repository.GroupMembersRepository;

@Service
@Transactional
public class GroupMembersService {
	@Autowired
	private GroupMembersRepository groupMembersRepository;	

	public GroupMembersService() {
	}
	public List<GroupMembers> listAllGroupMembers() {
		return groupMembersRepository.findAll();
	}
	public GroupMembers getGroupMembers(Integer id) {
		return groupMembersRepository.findById(id).get();
	}
	public GroupMembers saveGroupMembers(GroupMembers usr) {
		return groupMembersRepository.save(usr);
	}
	public void deleteGroupMembers(Integer id) {
		groupMembersRepository.deleteById(id);
	}
	public List<GroupMembers> getGroupMembersByGroup(Integer groupId) {
		return groupMembersRepository.findByGroup(groupId);
	}
	public List<GroupMembers> getGroupMembersByUser(Integer userId) {
		return groupMembersRepository.findByUser(userId);
	}

}
