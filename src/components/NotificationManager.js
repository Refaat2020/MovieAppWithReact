import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { notificationService } from "../services/notificationService";
import { movieRepository } from "../repositories/MovieRepository";
import "./NotificationManager.css";

export default function NotificationManager() {
    const [, setLocation] = useLocation();
    const [notificationEnabled, setNotificationEnabled] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);
    const [debugInfo, setDebugInfo] = useState("");

    useEffect(() => {
        console.log("NotificationManager mounted");

        // Check if user has already made a choice
        const userChoice = localStorage.getItem("notificationChoice");
        console.log("User choice from localStorage:", userChoice);

        if (userChoice === "enabled") {
            setNotificationEnabled(true);
            setShowPrompt(false);
            startNotifications();
        } else if (userChoice === "disabled") {
            setShowPrompt(false);
        }

        // Cleanup on unmount
        return () => {
            console.log("NotificationManager unmounting, stopping notifications");
            notificationService.stopRandomNotifications();
        };
    }, []);

    const startNotifications = () => {
        console.log("Starting notifications...");

        const navigateToMovie = (movieId) => {
            console.log("Navigating to movie:", movieId);
            setLocation(`/movie/${movieId}`);
        };

        // Start sending notifications every 1 minute for testing
        notificationService.startRandomNotifications(
            movieRepository,
            navigateToMovie,
            1 // 1 minute for testing
        );

        setDebugInfo("Notifications enabled! Next notification in ~1 minute");
        console.log("Notifications started with 1 minute interval");
    };

    const handleEnable = async () => {
        console.log("Enable button clicked");
        console.log("Notification support:", notificationService.isSupported());
        console.log("Current permission:", Notification.permission);

        const granted = await notificationService.requestPermission();
        console.log("Permission granted:", granted);

        if (granted) {
            setNotificationEnabled(true);
            setShowPrompt(false);
            localStorage.setItem("notificationChoice", "enabled");
            startNotifications();
        } else {
            alert("Please enable notifications in your browser settings");
        }
    };

    const handleDisable = () => {
        console.log("Disable button clicked");
        setShowPrompt(false);
        localStorage.setItem("notificationChoice", "disabled");
    };

    const handleToggle = async () => {
        if (notificationEnabled) {
            // Disable notifications
            console.log("Disabling notifications");
            notificationService.stopRandomNotifications();
            setNotificationEnabled(false);
            localStorage.setItem("notificationChoice", "disabled");
            setDebugInfo("");
        } else {
            // Enable notifications
            console.log("Enabling notifications");
            const granted = await notificationService.requestPermission();
            if (granted) {
                setNotificationEnabled(true);
                localStorage.setItem("notificationChoice", "enabled");
                startNotifications();
            }
        }
    };

    const handleTestNow = async () => {
        console.log("Test notification button clicked");
        try {
            const randomPage = Math.floor(Math.random() * 10) + 1;
            console.log("Fetching movies from page:", randomPage);

            const movies = await movieRepository.fetchPopular(randomPage);
            console.log("Movies fetched:", movies?.length);

            if (movies && movies.length > 0) {
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                console.log("Sending notification for movie:", randomMovie.title);

                notificationService.showMovieNotification(randomMovie, (movieId) => {
                    setLocation(`/movie/${movieId}`);
                });

                setDebugInfo(`Test notification sent for: ${randomMovie.title}`);
            }
        } catch (error) {
            console.error("Error in test notification:", error);
            setDebugInfo(`Error: ${error.message}`);
        }
    };

    if (!notificationService.isSupported()) {
        return (
            <div style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                background: "red",
                color: "white",
                padding: "1rem",
                borderRadius: "8px"
            }}>
                Notifications not supported in this browser
            </div>
        );
    }

    return (
        <>
            {/* Initial Prompt */}
            {showPrompt && (
                <div className="notification-prompt">
                    <div className="notification-prompt-content">
                        <span className="notification-icon">🔔</span>
                        <div className="notification-text">
                            <h3>Get Movie Recommendations</h3>
                            <p>Receive notifications about trending movies you might like</p>
                        </div>
                        <div className="notification-actions">
                            <button
                                className="btn-enable"
                                onClick={handleEnable}
                            >
                                Enable
                            </button>
                            <button
                                className="btn-disable"
                                onClick={handleDisable}
                            >
                                No Thanks
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button (fixed position) */}
            {!showPrompt && (
                <>
                    <button
                        className={`notification-toggle ${notificationEnabled ? 'active' : ''}`}
                        onClick={handleToggle}
                        title={notificationEnabled ? "Disable notifications" : "Enable notifications"}
                    >
                        {notificationEnabled ? '🔔' : '🔕'}
                    </button>

                    {/* Test Button (for debugging) */}
                    {/*{notificationEnabled && (*/}
                    {/*    <button*/}
                    {/*        className="notification-test"*/}
                    {/*        onClick={handleTestNow}*/}
                    {/*        title="Send test notification now"*/}
                    {/*    >*/}
                    {/*        Test Now*/}
                    {/*    </button>*/}
                    {/*)}*/}

                    {/* Debug Info */}
                    {/*{debugInfo && (*/}
                    {/*    <div className="debug-info">*/}
                    {/*        {debugInfo}*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </>
            )}
        </>
    );
}