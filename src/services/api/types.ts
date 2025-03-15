export interface User {
  id: number; // ID como string, no debería ser undefined si proviene de la API
  name: string;
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
  id: number; // ID de la relación de amistad (no es string)
  user: User; // El usuario que está pidiendo la amistad
  friend: User; // El amigo del usuario
  status: "accepted" | "pending"; // Estado de la amistad: aceptado o pendiente
  createdAt: string; // Fecha de creación de la amistad (en formato ISO)
}


export interface Group {
  id: number;
  name: string;
  image_url?: string; // Puede ser opcional
  description?: string;
  created_by: number; // ID del creador en string
  invite_code: string;
  created_at: string; // Fecha en formato ISO
}

export interface GroupMember {
  id: number;
  group_id: number; // ID del grupo
  user_id: number; // ID del usuario
  role: "admin" | "member"; // Rol en el grupo
  joined_at: string; // Fecha de unión
  group?: Group; // Esto es opcional, ya que no siempre tendrás el objeto completo del grupo aquí
}

export interface Message {
  id: number;
  sender_id: number;
  group_id?: number | null; // Puede ser null o undefined
  receiver_id?: string | null; // Puede ser null o undefined
  message_type: "text"; // Tipo de mensaje (por ahora solo "text")
  content: string;
  created_at: string; // Fecha en formato ISO
}
