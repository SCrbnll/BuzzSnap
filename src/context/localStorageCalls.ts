export default class LocalStorageCalls {
    static USER_KEY: string = "user";

    static getStorageUser() {
        return localStorage.getItem(this.USER_KEY);
    }

    static setStorageUser(user: any) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    static removeStorageUser() {
        localStorage.removeItem(this.USER_KEY);
    }

}
