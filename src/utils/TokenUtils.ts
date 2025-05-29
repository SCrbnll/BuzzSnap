import { User } from "@/services/api/types";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: number;
  name: string;
  display_name: string;
  email: string;
  avatar_url: string;
  description?: string;
  theme: string;
  last_login: string;
  created_at: string;
  closed: boolean;
  roles: string[];
  iat: number;
  exp: number;
  [key: string]: any;
}

export default class TokenUtils {
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (e) {
      console.error("Error decodificando el token", e);
      return null;
    }
  }

  static mapJwtPayloadToUser(payload: JwtPayload): User {
    return {
      id: payload.id,
      name: payload.name,
      displayName: payload.display_name,
      email: payload.email,
      avatarUrl: payload.avatar_url,
      description: payload.description,
      theme: payload.theme,
      lastLogin: payload.last_login,
      createdAt: payload.created_at,
      closed: payload.closed,
    };
  }
}
