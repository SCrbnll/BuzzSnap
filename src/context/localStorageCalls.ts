export default class LocalStorageCalls {
    static USER_KEY: string = "user";
    static ACTIVE_CHAT_KEY: string = "active_chat_id";

    static getStorageUser() {
        return localStorage.getItem(this.USER_KEY);
    }

    static setStorageUser(user: any) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    static removeStorageUser() {
        localStorage.removeItem(this.USER_KEY);
    }

    static getActiveChatId() {
        return localStorage.getItem(this.ACTIVE_CHAT_KEY);
    }

    static setActiveChatId(chatId: string) {
        localStorage.setItem(this.ACTIVE_CHAT_KEY, chatId);
    }

    static removeActiveChatId() {
        localStorage.removeItem(this.ACTIVE_CHAT_KEY);
    }

}
