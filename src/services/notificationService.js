// services/notificationService.js
import { showToast } from "../components/ToastNotification";

class NotificationService {
    constructor() {
        this.permission = null;
        this.intervalId = null;
    }

    // Request notification permission
    async requestPermission() {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
            return false;
        }

        if (Notification.permission === "granted") {
            this.permission = "granted";
            return true;
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === "granted";
        }

        return false;
    }

    // Show notification for a specific movie
    showMovieNotification(movie, onClickCallback) {
        console.log("showMovieNotification called for:", movie.title);
        console.log("Notification.permission:", Notification.permission);

        if (Notification.permission !== "granted") {
            console.log("Notification permission not granted");
            return;
        }

        try {
            const title = `🎬 ${movie.title}`;
            const options = {
                body: movie.overview?.substring(0, 100) + "..." || "Check out this movie!",
                icon: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : null,
                badge: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                    : null,
                tag: `movie-${movie.id}`,
                requireInteraction: false,
                data: { movieId: movie.id },
                vibrate: [200, 100, 200],
            };

            console.log("Creating notification with title:", title);
            const notification = new Notification(title, options);
            console.log("Notification created successfully");

            notification.onclick = () => {
                console.log("Notification clicked!");
                window.focus();
                if (onClickCallback) {
                    onClickCallback(movie.id);
                }
                notification.close();
            };

            notification.onerror = (error) => {
                console.error("Notification error:", error);
            };

            notification.onshow = () => {
                console.log("Notification shown successfully!");
            };

            notification.onclose = () => {
                console.log("Notification closed");
            };

            // Auto close after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);

            // ALSO show in-app toast as backup
            showToast(movie);

        } catch (error) {
            console.error("Error creating notification:", error);
            // If browser notification fails, still show toast
            showToast(movie);
        }
    }

    // Start sending random movie notifications
    startRandomNotifications(movieRepository, navigateCallback, intervalMinutes = 30) {
        console.log(`Starting random notifications with ${intervalMinutes} minute interval`);
        this.stopRandomNotifications(); // Clear any existing interval

        const sendRandomNotification = async () => {
            console.log("Attempting to send random notification...");
            try {
                // Fetch random page of popular movies
                const randomPage = Math.floor(Math.random() * 10) + 1;
                console.log(`Fetching movies from page ${randomPage}`);

                const movies = await movieRepository.fetchPopular(randomPage);
                console.log(`Fetched ${movies?.length} movies`);

                if (movies && movies.length > 0) {
                    // Pick a random movie from the results
                    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                    console.log(`Selected movie: ${randomMovie.title} (ID: ${randomMovie.id})`);
                    this.showMovieNotification(randomMovie, navigateCallback);
                } else {
                    console.warn("No movies returned from API");
                }
            } catch (error) {
                console.error("Error fetching random movie:", error);
            }
        };

        // Send first notification after 5 seconds (for testing)
        console.log("Scheduling first notification in 5 seconds...");
        setTimeout(async () => {
            console.log("Sending first notification now");
            await  sendRandomNotification();
        }, 5000);

        // Then set interval for future notifications
        const intervalMs = intervalMinutes * 60 * 1000;
        console.log(`Setting interval: ${intervalMs}ms (${intervalMinutes} minutes)`);

        this.intervalId = setInterval(async () => {
            console.log("Interval triggered, sending notification");
            await sendRandomNotification();
        }, intervalMs);

        console.log(`Notification interval ID: ${this.intervalId}`);
    }

    // Stop sending notifications
    stopRandomNotifications() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // Check if notifications are supported and enabled
    isSupported() {
        return "Notification" in window;
    }

}

export const notificationService = new NotificationService();