export interface User {
  id: number; // ID como string, no debería ser undefined si proviene de la API
  name: string;
  displayName: string;
  email: string;
  password?: string; // En respuestas de la API, usualmente no se devuelve la contraseña
  avatarUrl?: string; // Puede ser opcional si no siempre se envía
  description?: string; // Puede ser opcional si no siempre se envía
  theme: string;
  lastLogin: string; // Fecha en formato ISO
  createdAt: string; // Fecha en formato ISO
  closed: boolean;
}

export interface Friend {
  id?: number; // ID de la relación de amistad (no es string)
  user: User; // El usuario que está pidiendo la amistad
  friend: User; // El amigo del usuario
  status: "accepted" | "pending"; // Estado de la amistad: aceptado o pendiente
  createdAt?: string; // Fecha de creación de la amistad (en formato ISO)
}


export interface Group {
  id: number;
  name: string;
  imageUrl?: string; // Puede ser opcional
  description?: string;
  creator: User; // ID del creador en string
  inviteCode: string;
  createdAt: string; // Fecha en formato ISO
}

export interface GroupMember {
  id: number;
  groupId: number; // ID del grupo
  userId: number; // ID del usuario
  role: "admin" | "member"; // Rol en el grupo
  joinedAt: string; // Fecha de unión
  group?: Group; // Esto es opcional, ya que no siempre tendrás el objeto completo del grupo aquí
}

export interface Message {
  id?: number;
  sender: User;
  group?: Group | null; // Puede ser null o undefined
  chat?: Chats | null; // Puede ser null o undefined
  message_type?: string; // Puede ser opcional
  content: string;
  created_at?: string; // Fecha en formato ISO
}

export interface Chats {
  id: number;
  user1: User; // ID del user1
  user2: User; // ID del user2
  usersOrder: string; 
  createdAt: string; // Fecha en formato ISO
}
