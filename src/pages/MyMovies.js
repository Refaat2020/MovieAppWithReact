import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUserStore } from "../store/useUserStore";
import "./MyMovies.css";

export default function MyMovies() {
    const [, setLocation] = useLocation();

    // Get tab from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || 'watchlist';

    const [activeTab, setActiveTab] = useState(initialTab);

    const { user, watchlist, favorites, watched } = useUserStore();

    // Update tab when URL changes
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab && ['watchlist', 'favorites', 'watched'].includes(tab)) {
            setActiveTab(tab);
        }
    }, []);

    if (!user) {
        return (
            <div className="user-lists-container">
                <div className="not-logged-in">
                    <h2>Please Login</h2>
                    <p>You need to be logged in to view your movie lists</p>
                    <button onClick={() => setLocation("/")}>Go to Home</button>
                </div>
            </div>
        );
    }

    const getCurrentList = () => {
        switch (activeTab) {
            case "watchlist":
                return watchlist;
            case "favorites":
                return favorites;
            case "watched":
                return watched;
            default:
                return [];
        }
    };

    const currentList = getCurrentList();

    return (
        <div className="user-lists-container">
            <header className="lists-header">
                <h1>My Movies</h1>
            </header>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === "watchlist" ? "active" : ""}`}
                    onClick={() => setActiveTab("watchlist")}
                >
                    📋 Watchlist ({watchlist.length})
                </button>
                <button
                    className={`tab ${activeTab === "favorites" ? "active" : ""}`}
                    onClick={() => setActiveTab("favorites")}
                >
                    ❤️ Favorites ({favorites.length})
                </button>
                <button
                    className={`tab ${activeTab === "watched" ? "active" : ""}`}
                    onClick={() => setActiveTab("watched")}
                >
                    ✓ Watched ({watched.length})
                </button>
            </div>

            <div className="movies-grid">
                {currentList.length === 0 ? (
                    <div className="empty-state">
                        <p>No movies in your {activeTab} yet</p>
                        <button onClick={() => setLocation("/")}>
                            Browse Movies
                        </button>
                    </div>
                ) : (
                    currentList.map((movie) => (
                        <div
                            key={movie.id}
                            className="movie-card"
                            onClick={() => setLocation(`/movie/${movie.id}`)}
                        >
                            {movie.poster_path && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            )}
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <span className="added-date">
                                    Added: {new Date(movie.addedAt || movie.watchedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}