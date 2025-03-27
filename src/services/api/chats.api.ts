import axios from 'axios';
import { Chats } from './types';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class ChatsApi {
    async getChat(user1Id: number, user2Id: number): Promise<Chats> {
        const response = await axios.get<Chats>(`${SERVER}/chats/${user1Id}/${user2Id}`);
        return response.data;
    }

    async getChatsByUser(userId: number): Promise<Chats[]> {
        const response = await axios.get<Chats[]>(`${SERVER}/chats/user/${userId}`);
        return response.data;
    }

    async createChat(user1Id: number, user2Id: number): Promise<Chats> {
        const response = await axios.post<Chats>(`${SERVER}/chats/createChat/${user1Id}/${user2Id}`);
        return response.data;
    }
}
