import axios from 'axios';
import { GroupMember } from './types';
import LocalStorageCalls from '@/context/localStorageCalls';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class GroupMembersApi {
    async getGroupMembers(): Promise<GroupMember[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<GroupMember[]>(`${SERVER}/groupmembers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getGroupMember(id: number): Promise<GroupMember> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<GroupMember>(`${SERVER}/groupmembers/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getGroupMembersByUserId(userId: number): Promise<GroupMember[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<GroupMember[]>(`${SERVER}/groupmembers/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getGroupMembersByGroupId(groupId: number): Promise<GroupMember[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<GroupMember[]>(`${SERVER}/groupmembers/group/${groupId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async addGroupMember(member: GroupMember): Promise<GroupMember> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.post<GroupMember>(`${SERVER}/groupmembers`, member, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async updateGroupMember(member: number, role: string): Promise<GroupMember> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.put<GroupMember>(`${SERVER}/groupmembers/change/${member}/${role}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async deleteGroupMember(id: number): Promise<void> {
        const token = LocalStorageCalls.getAccessToken();
        await axios.delete(`${SERVER}/groupmembers/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        } );
    }
}
