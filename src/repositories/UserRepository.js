import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import UserData from "../models/UserData";

const db = getFirestore();

const UserRepository = {
    saveUser: async (userData) => {
        if (!userData?.uid) throw new Error("Invalid user data");
        try {
            const userRef = doc(db, "users", userData.uid);
            console.log(userData.toJson());
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

    // Add movie to watchlist
    addToWatchlist: async (uid, movie) => {
        if (!uid) throw new Error("User not authenticated");
        try {
            const userRef = doc(db, "users", uid);
            const movieData = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                addedAt: new Date().toISOString()
            };

            await updateDoc(userRef, {
                watchlist: arrayUnion(movieData)
            });
            console.log("Added to watchlist:", movie.title);
            return movieData;
        } catch (err) {
            console.error("Error adding to watchlist:", err);
            throw err;
        }
    },

    // Remove movie from watchlist
    removeFromWatchlist: async (uid, movieId) => {
        if (!uid) throw new Error("User not authenticated");
        try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const watchlist = userDoc.data().watchlist || [];
                const movieToRemove = watchlist.find(m => m.id === movieId);

                if (movieToRemove) {
                    await updateDoc(userRef, {
                        watchlist: arrayRemove(movieToRemove)
                    });
                    console.log("Removed from watchlist:", movieId);
                }
            }
        } catch (err) {
            console.error("Error removing from watchlist:", err);
            throw err;
        }
    },

    // Add movie to favorites
    addToFavorites: async (uid, movie) => {
        if (!uid) throw new Error("User not authenticated");
        try {
            const userRef = doc(db, "users", uid);
            const movieData = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                addedAt: new Date().toISOString()
            };

            await updateDoc(userRef, {
                favorites: arrayUnion(movieData)
            });
            console.log("Added to favorites:", movie.title);
            return movieData;
        } catch (err) {
            console.error("Error adding to favorites:", err);
            throw err;
        }
    },

    // Remove movie from favorites
    removeFromFavorites: async (uid, movieId) => {
        if (!uid) throw new Error("User not authenticated");
        try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const favorites = userDoc.data().favorites || [];
                const movieToRemove = favorites.find(m => m.id === movieId);

                if (movieToRemove) {
                    await updateDoc(userRef, {
                        favorites: arrayRemove(movieToRemove)
                    });
                    console.log("Removed from favorites:", movieId);
                }
            }
        } catch (err) {
            console.error("Error removing from favorites:", err);
            throw err;
        }
    },

    // Add movie to watched list
    addToWatched: async (uid, movie) => {
        if (!uid) throw new Error("User not authenticated");
        try {
            const userRef = doc(db, "users", uid);
            const movieData = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                watchedAt: new Date().toISOString()
            };

            await updateDoc(userRef, {
                watched: arrayUnion(movieData)
            });
            console.log("Marked as watched:", movie.title);
            return movieData;
        } catch (err) {
            console.error("Error marking as watched:", err);
            throw err;
        }
    },

    // Remove movie from watched list
    removeFromWatched: async (uid, movieId) => {
        if (!uid) throw new Error("User not authenticated");
        try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const watched = userDoc.data().watched || [];
                const movieToRemove = watched.find(m => m.id === movieId);

                if (movieToRemove) {
                    await updateDoc(userRef, {
                        watched: arrayRemove(movieToRemove)
                    });
                    console.log("Removed from watched:", movieId);
                }
            }
        } catch (err) {
            console.error("Error removing from watched:", err);
            throw err;
        }
    },

    // Get user's movie lists
    getUserMovieLists: async (uid) => {
        if (!uid) return { watchlist: [], favorites: [], watched: [] };
        try {
            const userRef = doc(db, "users", uid);
            const snapshot = await getDoc(userRef);

            if (snapshot.exists()) {
                const data = snapshot.data();
                return {
                    watchlist: data.watchlist || [],
                    favorites: data.favorites || [],
                    watched: data.watched || []
                };
            }
            return { watchlist: [], favorites: [], watched: [] };
        } catch (err) {
            console.error("Error fetching user movie lists:", err);
            throw err;
        }
    }
};

export default UserRepository;