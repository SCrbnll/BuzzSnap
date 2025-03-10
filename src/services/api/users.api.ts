import axios from 'axios';
import { User } from './types';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class UsersApi {
    async getUsers(): Promise<User[]> {
        const response = await axios.get<User[]>(`${SERVER}/users`);
        return response.data;
    }

    async getUser(id: number): Promise<User> {
        const response = await axios.get<User>(`${SERVER}/users/${id}`);
        return response.data;
    }

    async loginUser(email: string, password: string): Promise<User> {
        const response = await axios.get<User>(`${SERVER}/users/login/${email}/${password}`);
        return response.data;
    }

    async addUser(user: User): Promise<User> {
        const response = await axios.post<User>(`${SERVER}/users`, user);
        return response.data;
    }

    async changePassword(user : User, password: string): Promise<User> {
        const response = await axios.put<User>(`${SERVER}/users/changepass/${user.id}`, {password});
        return response.data;
    }

    async updateLastConnection(user : User, newDate: Date): Promise<User> {
        const formattedDate = newDate.toISOString();
        const response = await axios.put<User>(`${SERVER}/users/lastconnection/${user.id}`, {formattedDate});
        return response.data;
    }

    async updateUser(user: User): Promise<User> {
        if (!user.id) throw new Error("El usuario debe tener un ID para ser modificado.");
        const response = await axios.put<User>(`${SERVER}/users/changeprofile`, user);
        return response.data;
    }

    async deleteUser(user: User): Promise<void> {
        await axios.delete(`${SERVER}/users/unsubscribe/${user.id}`);
    }
}
