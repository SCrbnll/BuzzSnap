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

    async getFriendsPending(friendId: number): Promise<Friend[]> {
        const response = await axios.get<Friend[]>(`${SERVER}/friends/pending/${friendId}`);
        return response.data;
    }

    async addFriend(friend: Friend): Promise<Friend> {
        const response = await axios.post<Friend>(`${SERVER}/friends/create`, friend);
        return response.data;
    }

    async acceptFriendRequest(id: number): Promise<Friend> {
        const response = await axios.put<Friend>(`${SERVER}/friends/accept/${id}`);
        return response.data;
    }

    async rejectFriendRequest(id: number): Promise<Friend> {
        const response = await axios.put<Friend>(`${SERVER}/friends/reject/${id}`);
        return response.data;
    }

    async deleteFriend(friend: Friend): Promise<void> {
        await axios.delete(`${SERVER}/friends/${friend.id}`);
    }
}
