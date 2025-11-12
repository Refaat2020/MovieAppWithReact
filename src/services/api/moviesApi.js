import {AxiosClient} from "./axiosInstance";

const baseUrl = process.env.REACT_APP_BASE_URL;

const apiClient = new AxiosClient(baseUrl);

export const movieService = {
    getTopRated: async (page = 1) => {
        const data = await apiClient.get("/movie/top_rated", {
            params: { language: "en-US", page },
        });
        return data.results;
    },

    getPopular: async (page = 1) => {
        const data = await apiClient.get("/trending/movie/week", {
            params: { language: "en-US",'page': page,},
        });
        return data.results;
    },
    getMovieDetails: async (movieId) => {
        return await apiClient.get(`/movie/${movieId}`, {
            params: {language: "en-US",},
        });
    },
};