//auth.js

import conf from "../conf/conf";

import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client)
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if (userAccount) {
                // call another method (login the user if the account is created successfully)
                return this.login({ email, password })
            } else {
                return userAccount;
            }

        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            // 1. Check if there is an active session before trying to delete it
            let hasSession = false;
            try {
                await this.account.get();
                hasSession = true;
            } catch {
                // If get() throws, we know there is no active session (guest), so skip deleteSessions
            }

            if (hasSession) {
                await this.account.deleteSessions();
            }

            // 2. Now create a fresh session
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }



    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error)
        }

        return null;
    }

    async logout() {
        try {
            // Check if logged in
            await this.account.get(); // This throws if no session

            // If logged in, then delete session
            await this.account.deleteSession('current');
            return true;
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
            return false;
        }
    }


    /**
   * Generates a one-time JWT for the currently logged-in user.
   * Your server will use this to authenticate /api/chat calls.
   */
    async createJWT() {
        try {
            const result = await this.account.createJWT();
            return result; // { jwt: "..." }
        } catch (error) {
            console.error("AuthService.createJWT error", error);
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService