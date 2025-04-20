import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend, GroupMember } from "@/services/api/types";
import FriendsApi from "@/services/api/friends.api";
import GroupMembersApi from "@/services/api/groupsmember.api";
import LocalStorageCalls from "./localStorageCalls";
import { notifyError } from "@/components/NotificationProvider";

const friendsApi = new FriendsApi();
const groupMembersApi = new GroupMembersApi();

interface AppState {
  friends: Friend[];
  groupMembers: GroupMember[];
  currentChatUserId: number | null;
}

const initialState: AppState = {
  friends: [],
  groupMembers: [],
  currentChatUserId: null,
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
  },
});

export const { setAllData, setCurrentChatUserId } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

// Thunk para cargar todos los datos de la API y actualizar Redux
export const syncAllData = () => async (dispatch: any) => {
  try {
    console.log("🔄 Sincronizando datos...");
    const userLocalStorage = LocalStorageCalls.getStorageUser();
    if (userLocalStorage) {
      const userId = JSON.parse(userLocalStorage).id;
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
      console.log("📦 Store actualizado con los nuevos datos."); 
    }
  } catch (error) {
    notifyError("Error crítico al sincronizar datos");
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
