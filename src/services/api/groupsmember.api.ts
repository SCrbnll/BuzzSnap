import axios from 'axios';

const SERVER = import.meta.env.VITE_URL_API;

export interface GroupMember {
    id?: number;
    group_id: number;
    user_id: number;
    role: 'admin' | 'member';
    joined_at?: string;
}

export default class GroupMembersApi {
    async getGroupMembers(): Promise<GroupMember[]> {
        const response = await axios.get<GroupMember[]>(`${SERVER}/groupmembers`);
        return response.data;
    }

    async getGroupMember(id: number): Promise<GroupMember> {
        const response = await axios.get<GroupMember>(`${SERVER}/groupmembers/${id}`);
        return response.data;
    }

    async getGroupMembersByGroupId(groupId: number): Promise<GroupMember[]> {
        const response = await axios.get<GroupMember[]>(`${SERVER}/groupmembers/group/${groupId}`);
        return response.data;
    }

    async getGroupMembersByUserId(userId: number): Promise<GroupMember[]> {
        const response = await axios.get<GroupMember[]>(`${SERVER}/groupmembers/user/${userId}`);
        return response.data;
    }

    async addGroupMember(member: GroupMember): Promise<GroupMember> {
        const response = await axios.post<GroupMember>(`${SERVER}/groupmembers`, member);
        return response.data;
    }

    async updateGroupMember(member: GroupMember, role: string): Promise<GroupMember> {
        const response = await axios.put<GroupMember>(`${SERVER}/groupmembers/change/${member.id}/${role}`, member);
        return response.data;
    }

    async deleteGroupMember(id: number): Promise<void> {
        await axios.delete(`${SERVER}/groupmembers/${id}`);
    }
}
