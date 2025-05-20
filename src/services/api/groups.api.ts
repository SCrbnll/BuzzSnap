import axios from 'axios';
import { Group } from './types';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class GroupsApi {
    async getGroups(): Promise<Group[]> {
        const response = await axios.get<Group[]>(`${SERVER}/groups`);
        return response.data;
    }

    async getGroup(id: number): Promise<Group> {
        const response = await axios.get<Group>(`${SERVER}/groups/${id}`);
        return response.data;
    }

    async getGroupsByUserId(userId: number): Promise<Group[]> {
        const response = await axios.get<Group[]>(`${SERVER}/groups/user/${userId}`);
        return response.data;
    }

    async getGroupByInviteCode(invite_code: string): Promise<Group> {
        const response = await axios.get<Group>(`${SERVER}/groups/invite_code/${invite_code}`);
        return response.data;
    }

    async addGroup(group: Group): Promise<number> {
        const response = await axios.post<number>(`${SERVER}/groups`, group);
        return response.data;
    }

    async updateGroup(group: Group): Promise<Group> {
        const response = await axios.put<Group>(`${SERVER}/groups/change/${group.id}`, group);
        return response.data;
    }

    async deleteGroup(id: number): Promise<void> {
        await axios.delete(`${SERVER}/groups/${id}`);
    }
}
