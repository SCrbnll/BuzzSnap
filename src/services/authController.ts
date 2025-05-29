import axios from 'axios';
import { User } from './api/types';

const SERVER = import.meta.env.VITE_URL_API;
axios.defaults.baseURL = SERVER;

interface LoginRequest {
  email: string;
  password: string;
}

interface TokenRequest {
  refreshToken: string;
}

interface JwtResponse {
  token: string;
  refreshToken: string;
}

interface ErrorResponse {
  error: string;
  message: string;
}

export default class AuthController {
  async login(payload: LoginRequest): Promise<JwtResponse | ErrorResponse> {
    const response = await axios.post<JwtResponse | ErrorResponse>('/auth/login', payload);
    return response.data;
  }

  async register(payload: User): Promise<JwtResponse | ErrorResponse> {
    const response = await axios.post<JwtResponse | ErrorResponse>('/auth/register', payload);
    return response.data;
  }

  async refreshToken(payload: TokenRequest): Promise<JwtResponse | ErrorResponse> {
    const response = await axios.post<JwtResponse | ErrorResponse>('/auth/refresh', payload);
    return response.data;
  }

  async updateToken(payload: User): Promise<JwtResponse | ErrorResponse> {
    const response = await axios.put('/auth/update', payload);
    return response.data;
  }
}
