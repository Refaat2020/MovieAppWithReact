import React, { useEffect } from "react";
import HomeHeader from "../components/HomeHeader";
import HeroCarousel from "../components/HeroCarousel";
import MovieGrid from "../components/MovieGrid";
import { useMovieStore } from "../store/useMoviesStore";
import "./HomeMovie.css";

export default function Home() {
    const {
        topRated,
        popular,
        loading,
        error,
        fetchTopRated,
        fetchPopular,
    } = useMovieStore();

    useEffect(() => {
        fetchTopRated();
        fetchPopular();

        let hasNavigatedAway = false;

        const preventBack = () => {
            if (window.location.pathname === "/" && hasNavigatedAway) {
                window.history.pushState(null, "", window.location.href);
            }
        };

        const handleLocationChange = () => {
            if (window.location.pathname !== "/") {
                hasNavigatedAway = true;
            }
        };

        window.addEventListener("popstate", preventBack);
        window.addEventListener("pushState", handleLocationChange);

        return () => {
            window.removeEventListener("popstate", preventBack);
            window.removeEventListener("pushState", handleLocationChange);
        };
    }, [fetchTopRated, fetchPopular]);

    // 🔹 أثناء التحميل
    if (loading) {
        return (
            <div className="home-movie">
                <HomeHeader />
                <p style={{ textAlign: "center", marginTop: "3rem" }}>Loading movies...</p>
            </div>
        );
    }

    // 🔹 في حالة الخطأ
    if (error) {
        return (
            <div className="home-movie">
                <HomeHeader />
                <p style={{ color: "red", textAlign: "center", marginTop: "3rem" }}>
                    Error: {error}
                </p>
            </div>
        );
    }

    const featuredMovies =
        topRated.length > 0
            ? topRated.map((movie) => ({
                title: movie.title,
                description: movie.overview,
                image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }))
            : [];

    const topPicks =
        popular.length > 0
            ? popular.map((movie) => ({
                title: movie.title,
                image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }))
            : [];

    return (
        <div className="home-movie">
            <HomeHeader />
            <HeroCarousel movies={featuredMovies} />
            <MovieGrid movies={topPicks} />
        </div>
    );
}