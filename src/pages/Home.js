import React, { useEffect, useRef, useCallback } from "react";
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
        currentPage,
        hasMore,
    } = useMovieStore();

    const observerRef = useRef(null);
    const loadingRef = useRef(null);

    useEffect(() => {
        // Initial fetch only if no data
        if (popular.length === 0) {
            fetchTopRated();
            fetchPopular();
        }

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
    }, [fetchPopular, fetchTopRated, popular.length]); // Remove dependencies to prevent double calls

    // Infinite scroll logic
    const loadMore = useCallback(async () => {
        if (!loading && hasMore) {
            await fetchPopular(currentPage + 1);
        }
    }, [loading, hasMore, currentPage, fetchPopular]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "200px",
            threshold: 0.1,
        };

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        }, options);

        if (loadingRef.current) {
            observerRef.current.observe(loadingRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMore]);

    // Initial loading state
    if (loading && popular.length === 0) {
        return (
            <div className="home-movie">
                <HomeHeader />
                <p style={{ textAlign: "center", marginTop: "3rem" }}>Loading movies...</p>
            </div>
        );
    }

    // Error state
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
                id: movie.id,
                image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }))
            : [];

    const topPicks =
        popular.length > 0
            ? popular.map((movie) => ({
                id: movie.id,
                title: movie.title,
                image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }))
            : [];

    return (
        <div className="home-movie">
            <HomeHeader />
            <HeroCarousel movies={featuredMovies} />
            <MovieGrid movies={topPicks} />

            {/* Infinite scroll trigger */}
            <div ref={loadingRef} style={{ height: "20px", margin: "2rem 0" }}>
                {loading && (
                    <p style={{ textAlign: "center", color: "#666" }}>
                        Loading more movies...
                    </p>
                )}
                {!hasMore && popular.length > 0 && (
                    <p style={{ textAlign: "center", color: "#666" }}>
                        No more movies to load
                    </p>
                )}
            </div>
        </div>
    );
}