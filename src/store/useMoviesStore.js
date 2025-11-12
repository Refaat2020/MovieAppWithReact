// store/movieStore.js
import { create } from "zustand";
import { movieRepository } from "../repositories/MovieRepository.js";

export const useMovieStore = create((set, get) => ({
    topRated: [],
    popular: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 500,
    movieDetails: null,
    hasMore: true,

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
        const { loading, hasMore, popular } = get();

        // Prevent duplicate requests
        if (loading || !hasMore) return;

        set({ loading: true, error: null });
        try {
            const movies = await movieRepository.fetchPopular(page);

            // If page is 1, replace. Otherwise, append
            const updatedPopular = page === 1 ? movies : [...popular, ...movies];

            set({
                popular: updatedPopular,
                currentPage: page,
                hasMore: movies.length > 0 && page < get().totalPages,
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    resetMovies: () => {
        set({
            popular: [],
            currentPage: 1,
            hasMore: true,
        });
    },
}));