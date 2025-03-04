import axios from 'axios';

const SERVER = import.meta.env.VITE_URL_API;

export interface Friend {
    id?: number;
    user_id: number;
    friend_id: number;
    status: 'pending' | 'accepted' | 'canceled';
    created_at?: string;
}

export default class FriendsApi {
    async getFriends(): Promise<Friend[]> {
        const response = await axios.get<Friend[]>(`${SERVER}/friends`);
        return response.data;
    }

    async addFriend(friend: Friend): Promise<Friend> {
        const response = await axios.post<Friend>(`${SERVER}/friends`, friend);
        return response.data;
    }

    async updateFriend(friend: Friend): Promise<Friend> {
        if (!friend.id) throw new Error("La solicitud de amistad debe tener un ID.");
        const response = await axios.put<Friend>(`${SERVER}/friends/${friend.id}`, friend);
        return response.data;
    }

    async deleteFriend(id: number): Promise<void> {
        await axios.delete(`${SERVER}/friends/${id}`);
    }
}
