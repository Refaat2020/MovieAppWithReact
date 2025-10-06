import { create } from "zustand";
import { auth } from "../services/firebase_service/firebaseConfig";
import UserData from "../models/UserData";
import UserRepository from "../repositories/UserRepository";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";

const useAuthStore = create((set) => ({
    user: null,
    loading: false,
    error: null,

    register: async (email, password,fullName) => {
        set({ loading: true, error: null });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            const userData = UserData.fromFireBaseUser(firebaseUser);
            userData.fullName = fullName
            console.log( userData.fullName);

            await UserRepository.saveUser(userData);
            set({ user: userData, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    login: async (email, password,rememberMe) => {
        set({ loading: true, error: null });
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (rememberMe === true) {
                const token = await userCredential.user.getIdToken();
                localStorage.setItem("token", token);
            }
            set({ user: UserData.fromFireBaseUser(userCredential.user), loading: false });
        } catch (err) {
            let  errorMessage;
            if (err.message.includes("auth/invalid-credential")){
                errorMessage = "Invalid email or password";
            }else{
                errorMessage = err.message;
            }
            set({ error: errorMessage, loading: false });
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null });
        } catch (err) {
            set({ error: err.message });
        }
    },

    subscribeToAuth: () => {
        onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const existingUser = await UserRepository.getUserById(currentUser.uid);
                set({ user: existingUser || UserData.fromFireBaseUser(currentUser) });
            } else {
                set({ user: null });
            }
        });
    },
}));

export default useAuthStore;