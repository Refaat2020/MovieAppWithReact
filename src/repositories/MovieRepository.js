// repositories/movieRepository.js
import {movieService} from "../services/api/moviesApi";

export const movieRepository = {
    async fetchTopRated(page = 1) {
        try {
            return await movieService.getTopRated(page);
        } catch (error) {
            console.error("Error fetching top rated movies:", error);
            throw error;
        }
    },

    async fetchPopular(page = 1) {
        try {
            return await movieService.getPopular(page);
        } catch (error) {
            console.error("Error fetching popular movies:", error);
            throw error;
        }
    },
    async fetchMovieDetails(movieId) {
        try {
            return await movieService.getMovieDetails(movieId);
        } catch (error) {
            console.error("Error fetching popular movies:", error);
            throw error;
        }
    },

};