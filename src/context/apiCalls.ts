import { Friend, Group, GroupMember, Message, User, Chats } from '@/services/api/types';  
import FriendsApi from '@/services/api/friends.api';
import GroupsApi from '@/services/api/groups.api';
import GroupMembersApi from '@/services/api/groupsmember.api';
import MessagesApi from '@/services/api/messages.api';
import UsersApi from '@/services/api/users.api';
import ChatsApi from '@/services/api/chats.api';  // Importa ChatsApi

export default class ApiManager {
    private friendsApi: FriendsApi;
    private groupsApi: GroupsApi;
    private groupMembersApi: GroupMembersApi;
    private messagesApi: MessagesApi;
    private usersApi: UsersApi;
    private chatsApi: ChatsApi; // Nueva propiedad para ChatsApi

    constructor() {
        this.friendsApi = new FriendsApi();
        this.groupsApi = new GroupsApi();
        this.groupMembersApi = new GroupMembersApi();
        this.messagesApi = new MessagesApi();
        this.usersApi = new UsersApi();
        this.chatsApi = new ChatsApi(); // Inicialización de ChatsApi
    }

    // Amigos
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

    async updateFriend(id: number, status: string): Promise<Friend> {
        return this.friendsApi.updateFriend(id, status);
    }

    async deleteFriend(id: number): Promise<void> {
        const friend = await this.friendsApi.getFriend(id);
        return this.friendsApi.deleteFriend(friend);
    }

    // Grupos
    async getGroups(): Promise<Group[]> {
        return this.groupsApi.getGroups();
    }

    async getGroup(id: number): Promise<Group> {
        return this.groupsApi.getGroup(id);
    }

    async addGroup(group: Group): Promise<Group> {
        return this.groupsApi.addGroup(group);
    }

    async updateGroup(group: Group): Promise<Group> {
        return this.groupsApi.updateGroup(group);
    }

    async deleteGroup(id: number): Promise<void> {
        return this.groupsApi.deleteGroup(id);
    }

    // Miembros de grupos
    async getGroupMembers(): Promise<GroupMember[]> {
        return this.groupMembersApi.getGroupMembers();
    }

    async getGroupMember(id: number): Promise<GroupMember> {
        return this.groupMembersApi.getGroupMember(id);
    }

    async addGroupMember(member: GroupMember): Promise<GroupMember> {
        return this.groupMembersApi.addGroupMember(member);
    }

    async updateGroupMember(member: GroupMember, role: string): Promise<GroupMember> {
        return this.groupMembersApi.updateGroupMember(member, role);
    }

    async deleteGroupMember(id: number): Promise<void> {
        return this.groupMembersApi.deleteGroupMember(id);
    }

    // Mensajes
    async getMessages(): Promise<Message[]> {
        return this.messagesApi.getMessages();
    }

    async getMessage(id: number): Promise<Message> {
        return this.messagesApi.getMessage(id);
    }

    async addMessage(message: Message): Promise<Message> {
        return this.messagesApi.addMessage(message);
    }

    async updateMessage(message: Message): Promise<Message> {
        return this.messagesApi.updateMessage(message);
    }

    async deleteMessage(id: number): Promise<void> {
        return this.messagesApi.deleteMessage(id);
    }

    // Chats
    async getChat(user1Id: number, user2Id: number): Promise<Chats> {
        return this.chatsApi.getChat(user1Id, user2Id);
    }

    async getChatsByUserId(userId: number): Promise<Chats[]> {
        return this.chatsApi.getChatsByUser(userId);
    }

    async createChat(user1Id: number, user2Id: number): Promise<Chats> {
        return this.chatsApi.createChat(user1Id, user2Id);
    }

    // Usuarios
    async getUsers(): Promise<User[]> {
        return this.usersApi.getUsers();
    }

    async getUser(id: number): Promise<User> {
        return this.usersApi.getUser(id);
    }

    async getUserByDisplayName(displayName: string): Promise<User> {
        return this.usersApi.getUserByDisplayName(displayName);
    }

    async addUser(user: User): Promise<User> {
        return this.usersApi.addUser(user);
    }

    async updateUser(user: User): Promise<User> {
        return this.usersApi.updateUser(user);
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.usersApi.getUser(id); 
        return this.usersApi.deleteUser(user);
    }

    async loginUser(email: string, password: string): Promise<User> {
        const user = await this.usersApi.loginUser(email, password);
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
        document.body.setAttribute("data-theme", user.theme);
        return user;
    }

    async changePassword(user: User, password: string): Promise<User> {
        return this.usersApi.changePassword(user, password);
    }

    async updateLastConnection(user: User, newDate: Date): Promise<User> {
        return this.usersApi.updateLastConnection(user, newDate);
    }
}
