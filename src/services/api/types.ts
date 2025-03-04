// Types de la API

export interface User {
    id: string | undefined; // ID como string
    name: string;
    email: string;
    password: string;
    avatar_url: string;
    description: string;
    theme: string;
    last_login: string; // Fecha en formato ISO
    created_at: string; // Fecha en formato ISO
    closed: boolean;
  }
  
  export interface Friend {
    id: string | undefined; // ID como string
    user_id: number;
    friend_id: number;
    status: "accepted" | "pending"; // Puede ser "accepted" o "pending"
    created_at: string; // Fecha en formato ISO
  }
  
  export interface Group {
    id: string | undefined; // ID como string
    name: string;
    image_url: string;
    description: string;
    created_by: number;
    invite_code: string;
    created_at: string; // Fecha en formato ISO
  }
  
  export interface GroupMember {
    id: string | undefined; // ID como string
    group_id: number;
    user_id: number;
    role: "admin" | "member"; // Puede ser "admin" o "member"
    joined_at: string; // Fecha en formato ISO
  }
  
  export interface Message {
    id: string | undefined; // ID como string
    sender_id: number;
    group_id: number | null; // Puede ser null si no es un mensaje de grupo
    receiver_id: number | null; // Puede ser null si es un mensaje grupal
    message_type: "text"; // Tipo de mensaje (por ahora solo "text")
    content: string; // Contenido del mensaje
    created_at: string; // Fecha en formato ISO
  }
  