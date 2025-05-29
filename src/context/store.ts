import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend, GroupMember } from "@/services/api/types";
import FriendsApi from "@/services/api/friends.api";
import GroupMembersApi from "@/services/api/groupsmember.api";
import LocalStorageCalls from "./localStorageCalls";
import { notifyError } from "@/components/NotificationProvider";
import TokenUtils from "@/utils/TokenUtils";

const friendsApi = new FriendsApi();
const groupMembersApi = new GroupMembersApi();

interface AppState {
  friends: Friend[];
  groupMembers: GroupMember[];
  currentChatUserId: number | null;
  currentGroupUserId: number | null;
  lastSyncedAt: number | null; 

}

const initialState: AppState = {
  friends: [],
  groupMembers: [],
  currentChatUserId: null,
  currentGroupUserId: null,
  lastSyncedAt: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAllData: (
      state,
      action: PayloadAction<{ friends: Friend[]; groupMembers: GroupMember[] }>
    ) => {
      state.friends = action.payload.friends;
      state.groupMembers = action.payload.groupMembers;
    },
    setCurrentChatUserId: (state, action: PayloadAction<number | null>) => {
      state.currentChatUserId = action.payload;
    },
    setCurrentGroupUserId: (state, action: PayloadAction<number | null>) => {
      state.currentGroupUserId = action.payload;
    },
    setLastSyncedAt: (state, action: PayloadAction<number>) => {
      state.lastSyncedAt = action.payload;
    },
  },
});

export const { setAllData, setCurrentChatUserId, setCurrentGroupUserId, setLastSyncedAt } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

// Thunk para cargar todos los datos de la API y actualizar Redux
export const syncAllData = () => async (dispatch: any) => {
  try {
    console.log("🔄 Sincronizando datos...");
    const storedUser = LocalStorageCalls.getStorageUser() ? JSON.parse(LocalStorageCalls.getStorageUser()!) : null;
    const decodeUser = storedUser ? TokenUtils.decodeToken(storedUser.token) : null;
    if (decodeUser) {
      const userId = decodeUser.id;
      const [friends, groupMembers] = await Promise.all([
        friendsApi.getFriendsByUserId(userId),
        groupMembersApi.getGroupMembersByUserId(userId),
      ]);
      dispatch(
        setAllData({
          friends: friends as Friend[],
          groupMembers: groupMembers as GroupMember[],
        })
      );
      dispatch(setLastSyncedAt(Date.now()));
      console.log("📦 Store actualizado con los nuevos datos."); 
    }
  } catch (error) {
    notifyError("Error crítico al sincronizar datos");
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
