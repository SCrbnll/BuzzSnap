import axios from 'axios';
import { Friend } from './types';
import LocalStorageCalls from '@/context/localStorageCalls';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class FriendsApi {
    async getFriends(): Promise<Friend[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Friend[]>(`${SERVER}/friends`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getFriend(id: number): Promise<Friend> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Friend>(`${SERVER}/friends/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getFriendsByUserId(userId: number): Promise<Friend[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Friend[]>(`${SERVER}/friends/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getFriendsPending(friendId: number): Promise<Friend[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Friend[]>(`${SERVER}/friends/pending/${friendId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async addFriend(friend: Friend): Promise<Friend> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.post<Friend>(`${SERVER}/friends/create`, friend, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async acceptFriendRequest(id: number): Promise<Friend> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.put<Friend>(`${SERVER}/friends/accept/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async rejectFriendRequest(id: number): Promise<Friend> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.put<Friend>(`${SERVER}/friends/reject/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async deleteFriend(id: number): Promise<void> {
        const token = LocalStorageCalls.getAccessToken();
        await axios.delete(`${SERVER}/friends/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
