import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Friend, Group, GroupMember } from '@/services/api/types';
import FriendsApi from '@/services/api/friends.api';
import GroupsApi from '@/services/api/groups.api';
import GroupMembersApi from '@/services/api/groupsmember.api';

const friendsApi = new FriendsApi();
const groupsApi = new GroupsApi();
const groupMembersApi = new GroupMembersApi();

// Estado inicial
interface AppState {
  friends: Friend[];
  groups: Group[];
  groupMembers: GroupMember[];
}

const initialState: AppState = {
  friends: [],
  groups: [],
  groupMembers: [],
};

// Slice de Redux
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload;
    },
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    setGroupMembers: (state, action: PayloadAction<GroupMember[]>) => {
      state.groupMembers = action.payload;
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
  },
});

// Acciones del slice
export const {
  setFriends,
  setGroups,
  setGroupMembers,
  addFriend,
  deleteFriend,
  addGroup,
  deleteGroup,
} = appSlice.actions;

// Crear el store
export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

// Funciones asincrónicas (thunks) para cargar datos desde las APIs
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;