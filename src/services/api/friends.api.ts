import axios from 'axios';
import { Friend } from './types';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class FriendsApi {
    async getFriends(): Promise<Friend[]> {
        const response = await axios.get<Friend[]>(`${SERVER}/friends`);
        return response.data;
    }

    async getFriend(id: number): Promise<Friend> {
        const response = await axios.get<Friend>(`${SERVER}/friends/${id}`);
        return response.data;
    }

    async getFriendsByUserId(userId: number): Promise<Friend[]> {
        const response = await axios.get<Friend[]>(`${SERVER}/friends/user/${userId}`);
        return response.data;
    }

    async addFriend(friend: Friend): Promise<Friend> {
        const response = await axios.post<Friend>(`${SERVER}/friends`, friend);
        return response.data;
    }

    async updateFriend(id: number, status: string): Promise<Friend> {
        const response = await axios.put<Friend>(`${SERVER}/friends//changestatus/${id}/${status}`);
        return response.data;
    }

    async deleteFriend(friend: Friend): Promise<void> {
        await axios.delete(`${SERVER}/friends/${friend.id}`);
    }
}
