import axios from 'axios';
import { User } from './types';
import LocalStorageCalls from '@/context/localStorageCalls';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

export default class UsersApi {
    async getUsers(): Promise<User[]> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<User[]>(`${SERVER}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getUser(id: number): Promise<User> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<User>(`${SERVER}/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async getUserByDisplayName(displayName: string): Promise<User> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.get<User>(`${SERVER}/users/find/${displayName}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async changePassword(user : User, password: string): Promise<User> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.put<User>(`${SERVER}/users/password/${user.id}`, {password}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async updateLastConnection(user : User, newDate: Date): Promise<User> {
        const token = LocalStorageCalls.getAccessToken();
        const formattedDate = newDate.toISOString();
        const response = await axios.put<User>(`${SERVER}/users/connection/${user.id}`, {formattedDate}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async updateUser(user: User): Promise<User> {
        const token = LocalStorageCalls.getAccessToken();
        if (!user.id) throw new Error("El usuario debe tener un ID para ser modificado.");
        const response = await axios.put<User>(`${SERVER}/users/change`, user, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    }

    async updateColor(id: number, color: string): Promise<User> {
        const token = LocalStorageCalls.getAccessToken();
        const response = await axios.put<User>(`${SERVER}/users/color/${id}/${color}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async deleteUser(user: User): Promise<void> {
        const token = LocalStorageCalls.getAccessToken();
        await axios.delete(`${SERVER}/users/unsubscribe/${user.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}
