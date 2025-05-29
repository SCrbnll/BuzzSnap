import axios from 'axios';
import { Chats } from './types';
import LocalStorageCalls from '@/context/localStorageCalls';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class ChatsApi {
    async getChat(user1Id: number, user2Id: number): Promise<Chats> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Chats>(`${SERVER}/chats/${user1Id}/${user2Id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getChatById(chatId: number): Promise<Chats> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Chats>(`${SERVER}/chats/${chatId}` , {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getChatsByUser(userId: number): Promise<Chats[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Chats[]>(`${SERVER}/chats/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async createChat(user1Id: number, user2Id: number): Promise<Chats> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.post<Chats>(`${SERVER}/chats/create/${user1Id}/${user2Id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
}