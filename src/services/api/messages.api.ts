import axios from 'axios';

const SERVER = import.meta.env.VITE_URL_API;

export interface Message {
    id?: number;
    sender_id: number;
    group_id?: number | null;
    receiver_id?: number | null;
    message_type: 'text' | 'image' | 'video' | 'audio';
    content: string;
    created_at?: string;
}

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
        const response = await axios.get<Message[]>(`${SERVER}/messages/user/${userId}`);
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
