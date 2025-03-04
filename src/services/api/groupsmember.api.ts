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
        const response = await axios.get<GroupMember[]>(`${SERVER}/group_members`);
        return response.data;
    }

    async addGroupMember(member: GroupMember): Promise<GroupMember> {
        const response = await axios.post<GroupMember>(`${SERVER}/group_members`, member);
        return response.data;
    }

    async updateGroupMember(member: GroupMember): Promise<GroupMember> {
        if (!member.id) throw new Error("El miembro debe tener un ID.");
        const response = await axios.put<GroupMember>(`${SERVER}/group_members/${member.id}`, member);
        return response.data;
    }

    async deleteGroupMember(id: number): Promise<void> {
        await axios.delete(`${SERVER}/group_members/${id}`);
    }
}
