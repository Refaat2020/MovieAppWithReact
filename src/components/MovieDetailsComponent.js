import React, { useEffect, useState } from "react";
import { useLocation, useRoute } from 'wouter';
import { movieRepository } from "../repositories/MovieRepository";
import "./MovieDetails.css";

export default function MovieDetailsComponent() {
    const [match, params] = useRoute("/movie/:id");
    const id = params?.id;
    const [, setLocation] = useLocation();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Action states
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWatched, setIsWatched] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                console.log(`Fetching Movie details...:${id}`);
                setLoading(true);
                const data = await movieRepository.fetchMovieDetails(id);
                setMovie(data);

                // Load saved states from localStorage
                const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                const watched = JSON.parse(localStorage.getItem('watched') || '[]');

                setIsInWatchlist(watchlist.includes(id));
                setIsFavorite(favorites.includes(id));
                setIsWatched(watched.includes(id));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const toggleWatchlist = () => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        let updated;

        if (isInWatchlist) {
            updated = watchlist.filter(movieId => movieId !== id);
        } else {
            updated = [...watchlist, id];
        }

        localStorage.setItem('watchlist', JSON.stringify(updated));
        setIsInWatchlist(!isInWatchlist);
    };

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let updated;

        if (isFavorite) {
            updated = favorites.filter(movieId => movieId !== id);
        } else {
            updated = [...favorites, id];
        }

        localStorage.setItem('favorites', JSON.stringify(updated));
        setIsFavorite(!isFavorite);
    };

    const toggleWatched = () => {
        const watched = JSON.parse(localStorage.getItem('watched') || '[]');
        let updated;

        if (isWatched) {
            updated = watched.filter(movieId => movieId !== id);
        } else {
            updated = [...watched, id];
        }

        localStorage.setItem('watched', JSON.stringify(updated));
        setIsWatched(!isWatched);
    };

    if (loading) {
        return (
            <div className="movie-details-loading">
                <p>Loading movie details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="movie-details-error">
                <p>Error: {error}</p>
                <button onClick={() => setLocation(`/`)}>Go Back Home</button>
            </div>
        );
    }

    if (!movie) return null;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    return (
        <div className="movie-details">
            {/* Backdrop Image */}
            {backdropUrl && (
                <div
                    className="movie-backdrop"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                >
                    <div className="backdrop-overlay"></div>
                </div>
            )}

            {/* Back Button */}
            <button className="back-button" onClick={() => setLocation(`/`)}>
                ← Back
            </button>

            {/* Content */}
            <div className="movie-content">
                <div className="movie-poster">
                    {posterUrl && <img src={posterUrl} alt={movie.title} />}
                </div>

                <div className="movie-info">
                    <h1 className="movie-title">{movie.title}</h1>

                    <div className="movie-meta">
                        <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                        <span className="release-date">
                            {new Date(movie.release_date).getFullYear()}
                        </span>
                        <span className="runtime">{movie.runtime} min</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            className={`action-btn ${isInWatchlist ? 'active' : ''}`}
                            onClick={toggleWatchlist}
                        >
                            <span className="icon">📋</span>
                            {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                        </button>

                        <button
                            className={`action-btn ${isFavorite ? 'active' : ''}`}
                            onClick={toggleFavorite}
                        >
                            <span className="icon">{isFavorite ? '❤️' : '🤍'}</span>
                            {isFavorite ? 'Favorited' : 'Add to Favorites'}
                        </button>

                        <button
                            className={`action-btn ${isWatched ? 'active' : ''}`}
                            onClick={toggleWatched}
                        >
                            <span className="icon">{isWatched ? '✓' : '○'}</span>
                            {isWatched ? 'Watched' : 'Mark as Watched'}
                        </button>
                    </div>

                    <div className="movie-genres">
                        {movie.genres?.map((genre) => (
                            <span key={genre.id} className="genre-tag">
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    <div className="movie-overview">
                        <h2>Overview</h2>
                        <p>{movie.overview}</p>
                    </div>

                    {movie.tagline && (
                        <div className="movie-tagline">
                            <em>"{movie.tagline}"</em>
                        </div>
                    )}

                    <div className="movie-stats">
                        <div className="stat">
                            <span className="stat-label">Budget</span>
                            <span className="stat-value">
                                ${movie.budget?.toLocaleString() || "N/A"}
                            </span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Revenue</span>
                            <span className="stat-value">
                                ${movie.revenue?.toLocaleString() || "N/A"}
                            </span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Status</span>
                            <span className="stat-value">{movie.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}