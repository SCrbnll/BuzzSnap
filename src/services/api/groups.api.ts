import axios from 'axios';
import { Group } from './types';
import LocalStorageCalls from '@/context/localStorageCalls';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class GroupsApi {
    async getGroups(): Promise<Group[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Group[]>(`${SERVER}/groups`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getGroup(id: number): Promise<Group> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Group>(`${SERVER}/groups/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getGroupsByUserId(userId: number): Promise<Group[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Group[]>(`${SERVER}/groups/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getGroupByInviteCode(invite_code: string): Promise<Group> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Group>(`${SERVER}/groups/invite_code/${invite_code}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async addGroup(group: Group): Promise<number> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.post<number>(`${SERVER}/groups`, group, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async updateGroup(group: Group): Promise<Group> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.put<Group>(`${SERVER}/groups/change/${group.id}`, group, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async deleteGroup(id: number): Promise<void> {
        const token = LocalStorageCalls.getAccessToken();
        await axios.delete(`${SERVER}/groups/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
