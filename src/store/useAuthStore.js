import { create } from "zustand";
import { auth } from "../services/firebase_service/firebaseConfig";
import UserData from "../models/UserData";
import UserRepository from "../repositories/UserRepository";
import {
    saveUserToLocal,
    clearStorage,
} from '../services/storage/storageService';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const useAuthStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,
    success: null, // Changed from null to support three states: null, true, false
    initialized: false,

    // ADDED: Reset success state
    resetSuccess: () => {
        set({ success: null });
    },

    // ADDED: Reset error state
    resetError: () => {
        set({ error: null });
    },

    register: async (email, password, fullName) => {
        set({ loading: true, error: null, success: null });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            const firebaseUser = userCredential.user;
            const userData = UserData.fromFireBaseUser(firebaseUser);
            userData.fullName = fullName;
            userData.token = token;

            // Save user in Firebase
            await UserRepository.saveUser(userData);

            // Save user in local storage (synchronous)
            saveUserToLocal(userData);

            set({
                user: userData,
                loading: false,
                success: true,
                error: null
            });

            // CRITICAL FIX: Reset success after a short delay
            setTimeout(() => {
                set({ success: null });
            }, 100);

            return { success: true, user: userData };
        } catch (err) {
            const errorMessage = err.message;
            set({ error: errorMessage, loading: false, success: false });
            return { success: false, error: errorMessage };
        }
    },

    login: async (email, password) => {
        set({ loading: true, error: null, success: null });
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Get the user data from Firebase
            const userDoc = await UserRepository.getUserById(userCredential.user.uid);
            userDoc.token = token;

            // Save user in local storage (synchronous)
            saveUserToLocal(userDoc);

            set({
                user: userDoc,
                loading: false,
                success: true,
                error: null,
            });

            // CRITICAL FIX: Reset success after a short delay
            // This prevents the success state from persisting and triggering
            // unwanted redirects when Profile component mounts
            setTimeout(() => {
                set({ success: null });
            }, 100);

            return { success: true, user: userDoc };
        } catch (err) {
            let errorMessage;
            if (err.message.includes("auth/invalid-credential")) {
                errorMessage = "Invalid email or password";
            } else if (err.message.includes("auth/user-not-found")) {
                errorMessage = "No account found with this email";
            } else if (err.message.includes("auth/wrong-password")) {
                errorMessage = "Incorrect password";
            } else if (err.message.includes("auth/too-many-requests")) {
                errorMessage = "Too many failed attempts. Please try again later";
            } else {
                errorMessage = err.message;
            }
            set({ error: errorMessage, loading: false, success: false });
            return { success: false, error: errorMessage };
        }
    },

    logout: async () => {
        try {
            set({ loading: true, error: null, success: null });
            await signOut(auth);
            clearStorage();
            set({
                user: null,
                loading: false,
                error: null,
                success: true
            });

            setTimeout(() => {
                set({ success: null });
            }, 100);

            return { success: true };
        } catch (err) {
            set({ error: err.message, loading: false, success: false });
            return { success: false, error: err.message };
        }
    },

    // Update user data (both in store and local storage)
    updateUser: (userData) => {
        saveUserToLocal(userData);
        set({ user: userData });
    },

    // ADDED: Clear all auth state
    clearAuthState: () => {
        set({
            user: null,
            loading: false,
            error: null,
            success: null
        });
    }
}));

export default useAuthStore;