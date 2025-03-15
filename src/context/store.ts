import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend, Group, GroupMember } from "@/services/api/types";
import FriendsApi from "@/services/api/friends.api";
import GroupsApi from "@/services/api/groups.api";
import GroupMembersApi from "@/services/api/groupsmember.api";

const friendsApi = new FriendsApi();
const groupsApi = new GroupsApi();
const groupMembersApi = new GroupMembersApi();

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

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAllData: (
      state,
      action: PayloadAction<{ friends: Friend[]; groups: Group[]; groupMembers: GroupMember[] }>
    ) => {
      state.friends = action.payload.friends;
      state.groups = action.payload.groups;
      state.groupMembers = action.payload.groupMembers;
    },
  },
});

export const { setAllData } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

// Thunk para cargar todos los datos de la API y actualizar Redux
export const syncAllData = () => async (dispatch: any) => {
  try {
    console.log("🔄 Sincronizando datos...");

    const [friends, groups, groupMembers] = await Promise.all([
      friendsApi.getFriends(),
      groupsApi.getGroups(),
      groupMembersApi.getGroupMembers(),
    ]);
    console.log("✅ Datos obtenidos:", { friends, groups, groupMembers }); 


    dispatch(
      setAllData({
        friends: friends as Friend[],
        groups: groups as Group[],
        groupMembers: groupMembers as GroupMember[],
      })
    );
    console.log("📦 Store actualizado con los nuevos datos."); 

  } catch (error) {
    console.error("Error al sincronizar datos:", error);
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
