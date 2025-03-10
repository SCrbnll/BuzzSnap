export interface User {
  id: string; // ID como string, no debería ser undefined si proviene de la API
  name: string;
  email: string;
  password?: string; // En respuestas de la API, usualmente no se devuelve la contraseña
  avatar_url?: string; // Puede ser opcional si no siempre se envía
  description?: string; // Puede ser opcional si no siempre se envía
  theme: string;
  last_login: string; // Fecha en formato ISO
  created_at: string; // Fecha en formato ISO
  closed: boolean;
}

export interface Friend {
  id: string; // ID como string
  user_id: string; // Cambiado a string para coincidir con User.id
  friend_id: string; // Cambiado a string para coincidir con User.id
  status: "accepted" | "pending"; // Puede ser "accepted" o "pending"
  created_at: string; // Fecha en formato ISO
}

export interface Group {
  id: string;
  name: string;
  image_url?: string; // Puede ser opcional
  description?: string;
  created_by: string; // ID del creador en string
  invite_code: string;
  created_at: string; // Fecha en formato ISO
}

export interface GroupMember {
  id: string;
  group_id: string; // ID en string para coincidir con la API
  user_id: string; // ID en string
  role: "admin" | "member"; // Puede ser "admin" o "member"
  joined_at: string; // Fecha en formato ISO
}

export interface Message {
  id: string;
  sender_id: string;
  group_id?: string | null; // Puede ser null o undefined
  receiver_id?: string | null; // Puede ser null o undefined
  message_type: "text"; // Tipo de mensaje (por ahora solo "text")
  content: string;
  created_at: string; // Fecha en formato ISO
}
