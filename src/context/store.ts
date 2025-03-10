import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Friend, Group, GroupMember, Message } from '@/services/api/types';
import UsersApi from '@/services/api/users.api';
import FriendsApi from '@/services/api/friends.api';
import GroupsApi from '@/services/api/groups.api';
import GroupMembersApi from '@/services/api/groupsmember.api';
import MessagesApi from '@/services/api/messages.api';

const usersApi = new UsersApi();
const friendsApi = new FriendsApi();
const groupsApi = new GroupsApi();
const groupMembersApi = new GroupMembersApi();
const messagesApi = new MessagesApi();

// Estado inicial
interface AppState {
  users: User[];
  friends: Friend[];
  groups: Group[];
  groupMembers: GroupMember[];
  messages: Message[];
}

const initialState: AppState = {
  users: [],
  friends: [],
  groups: [],
  groupMembers: [],
  messages: [],
};

// Slice de Redux
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload;
    },
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    setGroupMembers: (state, action: PayloadAction<GroupMember[]>) => {
      state.groupMembers = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.friends.push(action.payload);
    },
    deleteFriend: (state, action: PayloadAction<number>) => {  
      state.friends = state.friends.filter(friend => friend.id !== action.payload);
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    deleteGroup: (state, action: PayloadAction<number>) => {  
      state.groups = state.groups.filter(group => group.id !== action.payload);
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    deleteMessage: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter(message => message.id !== action.payload);
    },
  },
});

// Acciones del slice
export const {
  setUsers,
  setFriends,
  setGroups,
  setGroupMembers,
  setMessages,
  addFriend,
  deleteFriend,
  addGroup,
  deleteGroup,
  addMessage,
  deleteMessage,
} = appSlice.actions;

// Crear el store
export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

// Funciones asincrónicas (thunks) para cargar datos desde las APIs
export const loadUsers = () => async (dispatch: any) => {
  try {
    const users = await usersApi.getUsers();
    dispatch(setUsers(users as User[]));  
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
};

export const loadFriends = () => async (dispatch: any) => {
  try {
    const friends = await friendsApi.getFriends();
    dispatch(setFriends(friends as Friend[]));  
  } catch (error) {
    console.error('Error al cargar amigos:', error);
  }
};

export const loadGroups = () => async (dispatch: AppDispatch) => {
  try {
    const groups = await groupsApi.getGroups();
    dispatch(setGroups(groups as Group[]));  
  } catch (error) {
    console.error("Error al cargar grupos:", error);
  }
};

export const loadGroupMembers = () => async (dispatch: any) => {
  try {
    const groupMembers = await groupMembersApi.getGroupMembers();
    dispatch(setGroupMembers(groupMembers as GroupMember[]));  
  } catch (error) {
    console.error('Error al cargar miembros de grupos:', error);
  }
};

export const loadMessages = () => async (dispatch: any) => {
  try {
    const messages = await messagesApi.getMessages();
    dispatch(setMessages(messages as Message[])); 
  } catch (error) {
    console.error('Error al cargar mensajes:', error);
  }
};

// Asegúrate de exportar el tipo de estado global correctamente
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;