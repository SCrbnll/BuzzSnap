import axios from 'axios';
import { Message } from './types';
import LocalStorageCalls from '@/context/localStorageCalls';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class MessagesApi {
    async getMessages(): Promise<Message[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Message[]>(`${SERVER}/messages`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getMessage(id: number): Promise<Message> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Message>(`${SERVER}/messages/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getMessagesByUserId(userId: number): Promise<Message[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Message[]>(`${SERVER}/messages/sender/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getMessagesByChatId(chatId: number): Promise<Message[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Message[]>(`${SERVER}/messages/chat/${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getMessagesByGroupId(groupId: number): Promise<Message[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<Message[]>(`${SERVER}/messages/group/${groupId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async addMessage(message: Message): Promise<Message> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.post<Message>(`${SERVER}/messages`, message, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async updateMessage(message: Message): Promise<Message> {
        const token = LocalStorageCalls.getAccessToken();
        if (!message.id) throw new Error("El mensaje debe tener un ID.");
        const response = await axios.put<Message>(`${SERVER}/messages/send/${message.id}`, message, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async deleteMessage(id: number): Promise<void> {
        const token = LocalStorageCalls.getAccessToken();
        await axios.delete(`${SERVER}/messages/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
