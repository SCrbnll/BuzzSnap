import { Friend, Group, GroupMember, Message, User, Chats } from '@/services/api/types';  
import FriendsApi from '@/services/api/friends.api';
import GroupsApi from '@/services/api/groups.api';
import GroupMembersApi from '@/services/api/groupsmember.api';
import MessagesApi from '@/services/api/messages.api';
import UsersApi from '@/services/api/users.api';
import ChatsApi from '@/services/api/chats.api'; 
import LocalStorageCalls from './localStorageCalls';
import AuthController from '@/services/authController';

export default class ApiManager {
    private authControler: AuthController;
    private friendsApi: FriendsApi;
    private groupsApi: GroupsApi;
    private groupMembersApi: GroupMembersApi;
    private messagesApi: MessagesApi;
    private usersApi: UsersApi;
    private chatsApi: ChatsApi;

    constructor() {
        this.authControler = new AuthController();
        this.friendsApi = new FriendsApi();
        this.groupsApi = new GroupsApi();
        this.groupMembersApi = new GroupMembersApi();
        this.messagesApi = new MessagesApi();
        this.usersApi = new UsersApi();
        this.chatsApi = new ChatsApi();
    }
    /* ========= AUTH ========= */
    async login(email: string, password: string): Promise<{ token: string; refreshToken: string;} | {error: string; message:string}> {
        const data = await this.authControler.login({ email, password });
        if ("token" in data && "refreshToken" in data) {
            LocalStorageCalls.setStorageUser(data);
        }
        return data;
    }

    async register(user: {name: string, email: string, password: string}): Promise<{ token: string; refreshToken: string;} | {error: string; message:string}> {
        const data = await this.authControler.register(user);
        if ("token" in data && "refreshToken" in data) {
            console.log('dentro')
            LocalStorageCalls.setStorageUser(data);
        }
        console.log('fuera')
        return data;
    }

    async refreshToken(token: string): Promise<{ token: string; refreshToken: string;} | {error: string; message:string}> {
        const data = await this.authControler.refreshToken({refreshToken: token});
        if ("token" in data && "refreshToken" in data) {
            LocalStorageCalls.setStorageUser(data);
        }
        return data;
    }

    async updateToken(user: User): Promise<{ token: string; refreshToken: string;} | {error: string; message:string}> {
        return this.authControler.updateToken(user);
    }

    /* ========= FRIENDSAPI ========= */
    async getFriends(): Promise<Friend[]> {
        return this.friendsApi.getFriends();
    }

    async getFriend(id: number): Promise<Friend> {
        return this.friendsApi.getFriend(id);
    }

    async getFriendsByUserId(userId: number): Promise<Friend[]> {
        return this.friendsApi.getFriendsByUserId(userId);
    }

    async getFriendsPending(friendId: number): Promise<Friend[]> {
        return this.friendsApi.getFriendsPending(friendId);
    }

    async addFriend(friend: Friend): Promise<Friend> {
        return this.friendsApi.addFriend(friend);
    }

    async acceptFriendRequest(id: number): Promise<Friend> {
        return this.friendsApi.acceptFriendRequest(id);
    }

    async rejectFriendRequest(id: number): Promise<Friend> {
        return this.friendsApi.rejectFriendRequest(id);
    }

    async deleteFriend(id: number): Promise<void> {
        return this.friendsApi.deleteFriend(id);
    }

     /* ========= GROUPSAPI ========= */
    async getGroups(): Promise<Group[]> {
        return this.groupsApi.getGroups();
    }

    async getGroup(id: number): Promise<Group> {
        return this.groupsApi.getGroup(id);
    }

    async getGroupsByUserId(userId: number): Promise<Group[]> {
        return this.groupsApi.getGroupsByUserId(userId);
    }

    async getGroupByInviteCode(invite_code: string): Promise<Group>{
        return this.groupsApi.getGroupByInviteCode(invite_code);
    }

    async addGroup(group: Group): Promise<number> {
        return this.groupsApi.addGroup(group);
    }

    async updateGroup(group: Group): Promise<Group> {
        return this.groupsApi.updateGroup(group);
    }

    async deleteGroup(id: number): Promise<void> {
        return this.groupsApi.deleteGroup(id);
    }

     /* ========= GROUPMEMBERSAPI ========= */
    async getGroupMembers(): Promise<GroupMember[]> {
        return this.groupMembersApi.getGroupMembers();
    }

    async getGroupMember(id: number): Promise<GroupMember> {
        return this.groupMembersApi.getGroupMember(id);
    }

    async getGroupMembersByUserId(userId: number): Promise<GroupMember[]> {
        return this.groupMembersApi.getGroupMembersByUserId(userId);
    }

    async getGroupMembersByGroupId(groupId: number): Promise<GroupMember[]> {
        return this.groupMembersApi.getGroupMembersByGroupId(groupId);
    }

    async addGroupMember(member: GroupMember): Promise<GroupMember> {
        return this.groupMembersApi.addGroupMember(member);
    }

    async updateGroupMember(memberId: number, role: string): Promise<GroupMember> {
        return this.groupMembersApi.updateGroupMember(memberId, role);
    }

    async deleteGroupMember(id: number): Promise<void> {
        return this.groupMembersApi.deleteGroupMember(id);
    }

     /* ========= MESSAGESAPI ========= */
    async getMessages(): Promise<Message[]> {
        return this.messagesApi.getMessages();
    }

    async getMessage(id: number): Promise<Message> {
        return this.messagesApi.getMessage(id);
    }

    async getMessagesByUserId(userId: number): Promise<Message[]> {
        return this.messagesApi.getMessagesByUserId(userId);
    }

    async getMessagesByChatId(userId: number): Promise<Message[]> {
        return this.messagesApi.getMessagesByChatId(userId);
    }

    async getMessagesByGroupId(userId: number): Promise<Message[]> {
        return this.messagesApi.getMessagesByGroupId(userId);
    }

    async addMessage(message: Message): Promise<Message> {
        console.log(message);
        return this.messagesApi.addMessage(message);
    }

    async updateMessage(message: Message): Promise<Message> {
        return this.messagesApi.updateMessage(message);
    }

    async deleteMessage(id: number): Promise<void> {
        return this.messagesApi.deleteMessage(id);
    }

     /* ========= CHATSAPI ========= */
    async getChat(user1Id: number, user2Id: number): Promise<Chats> {
        return this.chatsApi.getChat(user1Id, user2Id);
    }

    async getChatById(chatId: number): Promise<Chats> {
        return this.chatsApi.getChatById(chatId);
    }

    async getChatsByUserId(userId: number): Promise<Chats[]> {
        return this.chatsApi.getChatsByUser(userId);
    }

    async checkChat(user1Id: number, user2Id: number): Promise<boolean> {
        const chats = await this.chatsApi.getChatsByUser(user1Id);
        const exist = chats.filter((chat) => chat.user1.id === user1Id && chat.user2.id === user2Id || chat.user1.id === user2Id && chat.user2.id === user1Id);
        if (exist.length === 0) return false
        return true;
    }

    async createChat(user1Id: number, user2Id: number): Promise<Chats> {
        return this.chatsApi.createChat(user1Id, user2Id);
    }

     /* ========= USERSAPI ========= */
    async getUsers(): Promise<User[]> {
        return this.usersApi.getUsers();
    }

    async getUser(id: number): Promise<User> {
        return this.usersApi.getUser(id);
    }

    async getUserByDisplayName(displayName: string): Promise<User> {
        return this.usersApi.getUserByDisplayName(displayName);
    }

    async changePassword(user: User, password: string): Promise<User> {
        return this.usersApi.changePassword(user, password);
    }

    async updateLastConnection(user: User, newDate: Date): Promise<User> {
        return this.usersApi.updateLastConnection(user, newDate);
    }

    async updateColor(id: number, color: string): Promise<User> {
        return await this.usersApi.updateColor(id, color);
    }

    async updateUser(user: User): Promise<User> {
        return this.usersApi.updateUser(user);
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.usersApi.getUser(id); 
        return this.usersApi.deleteUser(user);
    }
}
