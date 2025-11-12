// store/useUserStore.js
import { create } from "zustand";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import UserRepository from "../repositories/UserRepository";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: true,
    watchlist: [],
    favorites: [],
    watched: [],

    // Initialize auth listener
    initializeAuth: () => {
        const auth = getAuth();

        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch user data from Firestore
                    const userData = await UserRepository.getUserById(firebaseUser.uid);

                    // Fetch movie lists
                    const lists = await UserRepository.getUserMovieLists(firebaseUser.uid);

                    set({
                        user: userData || { uid: firebaseUser.uid, email: firebaseUser.email },
                        watchlist: lists.watchlist,
                        favorites: lists.favorites,
                        watched: lists.watched,
                        loading: false
                    });
                } catch (error) {
                    console.error("Error loading user data:", error);
                    set({ loading: false });
                }
            } else {
                set({
                    user: null,
                    watchlist: [],
                    favorites: [],
                    watched: [],
                    loading: false
                });
            }
        });
    },

    // Add to watchlist
    addToWatchlist: async (movie) => {
        const { user, watchlist } = get();
        if (!user) {
            alert("Please login to add movies to your watchlist");
            return;
        }

        try {
            await UserRepository.addToWatchlist(user.uid, movie);
            const movieData = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                addedAt: new Date().toISOString()
            };
            set({ watchlist: [...watchlist, movieData] });
        } catch (error) {
            console.error("Error adding to watchlist:", error);
            alert("Failed to add to watchlist");
        }
    },

    // Remove from watchlist
    removeFromWatchlist: async (movieId) => {
        const { user, watchlist } = get();
        if (!user) return;

        try {
            await UserRepository.removeFromWatchlist(user.uid, movieId);
            set({ watchlist: watchlist.filter(m => m.id !== movieId) });
        } catch (error) {
            console.error("Error removing from watchlist:", error);
        }
    },

    // Add to favorites
    addToFavorites: async (movie) => {
        const { user, favorites } = get();
        if (!user) {
            alert("Please login to add movies to your favorites");
            return;
        }

        try {
            await UserRepository.addToFavorites(user.uid, movie);
            const movieData = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                addedAt: new Date().toISOString()
            };
            set({ favorites: [...favorites, movieData] });
        } catch (error) {
            console.error("Error adding to favorites:", error);
            alert("Failed to add to favorites");
        }
    },

    // Remove from favorites
    removeFromFavorites: async (movieId) => {
        const { user, favorites } = get();
        if (!user) return;

        try {
            await UserRepository.removeFromFavorites(user.uid, movieId);
            set({ favorites: favorites.filter(m => m.id !== movieId) });
        } catch (error) {
            console.error("Error removing from favorites:", error);
        }
    },

    // Add to watched
    addToWatched: async (movie) => {
        const { user, watched } = get();
        if (!user) {
            alert("Please login to mark movies as watched");
            return;
        }

        try {
            await UserRepository.addToWatched(user.uid, movie);
            const movieData = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                watchedAt: new Date().toISOString()
            };
            set({ watched: [...watched, movieData] });
        } catch (error) {
            console.error("Error marking as watched:", error);
            alert("Failed to mark as watched");
        }
    },

    // Remove from watched
    removeFromWatched: async (movieId) => {
        const { user, watched } = get();
        if (!user) return;

        try {
            await UserRepository.removeFromWatched(user.uid, movieId);
            set({ watched: watched.filter(m => m.id !== movieId) });
        } catch (error) {
            console.error("Error removing from watched:", error);
        }
    },

    // Check if movie is in list
    isInWatchlist: (movieId) => {
        const { watchlist } = get();
        return watchlist.some(m => m.id === movieId);
    },

    isInFavorites: (movieId) => {
        const { favorites } = get();
        return favorites.some(m => m.id === movieId);
    },

    isWatched: (movieId) => {
        const { watched } = get();
        return watched.some(m => m.id === movieId);
    }
}));