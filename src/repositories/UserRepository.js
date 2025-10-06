import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "../services/firebase_service/firebaseConfig";
import UserData from "../models/UserData";

const db = getFirestore();


const UserRepository = {
    saveUser: async (userData) => {
        if (!userData?.uid) throw new Error("Invalid user data");
        try {
            const userRef = doc(db, "users", userData.uid);
            console.log( userData.toJson());
            await setDoc(userRef, userData.toJson(), { merge: true });
            console.log("User saved:", userData.email);
        } catch (err) {
            console.error("Error saving user:", err);
            throw err;
        }
    },

    getUserById: async (uid) => {
        if (!uid) return null;
        try {
            const userRef = doc(db, "users", uid);
            const snapshot = await getDoc(userRef);
            if (snapshot.exists()) {
                return new UserData(snapshot.data());
            } else {
                return null;
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            throw err;
        }
    },
};

export default UserRepository;