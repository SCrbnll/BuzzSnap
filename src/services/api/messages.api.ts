import axios from 'axios';
import { Message } from './types';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class MessagesApi {
    async getMessages(): Promise<Message[]> {
        const response = await axios.get<Message[]>(`${SERVER}/messages`);
        return response.data;
    }

    async getMessage(id: number): Promise<Message> {
        const response = await axios.get<Message>(`${SERVER}/messages/${id}`);
        return response.data;
    }

    async getMessagesByUserId(userId: number): Promise<Message[]> {
        const response = await axios.get<Message[]>(`${SERVER}/messages/sender/${userId}`);
        return response.data;
    }

    async getMessagesByChatId(chatId: number): Promise<Message[]> {
        const response = await axios.get<Message[]>(`${SERVER}/messages/chat/${chatId}`);
        return response.data;
    }

    async getMessagesByGroupId(groupId: number): Promise<Message[]> {
        const response = await axios.get<Message[]>(`${SERVER}/messages/group/${groupId}`);
        return response.data;
    }

    async addMessage(message: Message): Promise<Message> {
        const response = await axios.post<Message>(`${SERVER}/messages`, message);
        return response.data;
    }

    async updateMessage(message: Message): Promise<Message> {
        if (!message.id) throw new Error("El mensaje debe tener un ID.");
        const response = await axios.put<Message>(`${SERVER}/messages/send/${message.id}`, message);
        return response.data;
    }

    async deleteMessage(id: number): Promise<void> {
        await axios.delete(`${SERVER}/messages/${id}`);
    }
}
