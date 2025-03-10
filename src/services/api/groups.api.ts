import axios from 'axios';

const SERVER = import.meta.env.VITE_URL_API;

export interface Group {
    id?: number;
    name: string;
    image_url?: string;
    description?: string;
    created_by: number;
    invite_code: string;
    created_at?: string;
}

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

    async addGroup(group: Group): Promise<Group> {
        const response = await axios.post<Group>(`${SERVER}/groups`, group);
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
