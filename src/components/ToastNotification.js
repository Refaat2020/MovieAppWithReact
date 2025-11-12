import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import "./ToastNotification.css";

let showToastCallback = null;

export const showToast = (movie) => {
    if (showToastCallback) {
        showToastCallback(movie);
    }
};

export default function ToastNotification() {
    const [, setLocation] = useLocation();
    const [visible, setVisible] = useState(false);
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        showToastCallback = (movieData) => {
            console.log("Showing toast for:", movieData.title);
            setMovie(movieData);
            setVisible(true);

            // Auto-hide after 8 seconds
            setTimeout(() => {
                setVisible(false);
            }, 8000);
        };

        return () => {
            showToastCallback = null;
        };
    }, []);

    const handleClick = () => {
        if (movie) {
            setLocation(`/movie/${movie.id}`);
            setVisible(false);
        }
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setVisible(false);
    };

    if (!visible || !movie) return null;

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : null;

    return (
        <div className={`toast-notification ${visible ? "show" : ""}`} onClick={handleClick}>
            <button className="toast-close" onClick={handleClose}>×</button>
            {posterUrl && (
                <img src={posterUrl} alt={movie.title} className="toast-poster" />
            )}
            <div className="toast-content">
                <div className="toast-icon">🎬</div>
                <div className="toast-text">
                    <h4>{movie.title}</h4>
                    <p>{movie.overview?.substring(0, 80)}...</p>
                </div>
            </div>
        </div>
    );
}