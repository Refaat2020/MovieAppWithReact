// store/movieStore.js
import { create } from "zustand";
import { movieRepository } from "../repositories/MovieRepository.js";

export const useMovieStore = create((set) => ({
    topRated: [],
    popular: [],
    loading: false,
    error: null,

    fetchTopRated: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            const movies = await movieRepository.fetchTopRated(page);
            set({ topRated: movies, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchPopular: async (page = 1) => {
        set({ loading: true, error: null });
        try {
            const movies = await movieRepository.fetchPopular(page);
            set({ popular: movies, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));