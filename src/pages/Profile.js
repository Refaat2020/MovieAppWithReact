import React, { useEffect, useState } from 'react';
import { User, Mail, Film, Heart, Clock, Star, LogOut, } from 'lucide-react';
import './Profile.css';
import useAuthStore from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { toast } from "react-toastify";
import { useLocation } from 'wouter';

function Profile() {
    const { logout, loading: authLoading, error, success } = useAuthStore();
    const {
        user,
        watchlist,
        favorites,
        watched,
        loading: userLoading
    } = useUserStore();

    const [, setLocation] = useLocation();
    const [isEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');

    // Initialize edit fields when user data loads
    useEffect(() => {
        if (user) {
            setEditedName(user.displayName || user.email?.split('@')[0] || 'User');
            setEditedEmail(user.email || '');
        }
    }, [user]);

    // Handle auth state changes
    useEffect(() => {
        if (error) {
            toast.error(error, { theme: "dark" });
        } else if (success === true) {
            toast.success("Logged out successfully", { theme: "dark" });
            setLocation('/', { replace: true });
        }
    }, [error, success, setLocation]);

    // Redirect if not logged in
    useEffect(() => {
        if (!userLoading && !user) {
            toast.error("Please login to view your profile", { theme: "dark" });
            setLocation('/', { replace: true });
        }
    }, [user, userLoading, setLocation]);


    const handleLogout = async () => {
        await logout();
    };

    // Calculate average rating (placeholder - you can implement actual rating system)
    const calculateAvgRating = () => {
        // This is a placeholder - implement actual rating calculation
        return watched.length > 0 ? (4.2).toFixed(1) : "0.0";
    };

    // Get join date
    const getJoinDate = () => {
        if (user?.createdAt) {
            const date = new Date(user.createdAt);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
        return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Get recent activity (last 3 items from all lists)
    const getRecentActivity = () => {
        const activities = [];

        // Add recent favorites
        favorites.slice(0, 1).forEach(movie => {
            activities.push({
                icon: Heart,
                text: `Added ${movie.title} to favorites`,
                time: movie.addedAt
            });
        });

        // Add recent watched
        watched.slice(0, 1).forEach(movie => {
            activities.push({
                icon: Star,
                text: `Watched ${movie.title}`,
                time: movie.watchedAt
            });
        });

        // Add recent watchlist
        watchlist.slice(0, 1).forEach(movie => {
            activities.push({
                icon: Clock,
                text: `Added ${movie.title} to watchlist`,
                time: movie.addedAt
            });
        });

        // Sort by date and take top 3
        return activities
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 3);
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    if (userLoading) {
        return (
            <div className="profile-container">
                <div className="profile-content">
                    <p style={{ textAlign: 'center', color: '#999' }}>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    const recentActivity = getRecentActivity();

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-header">
                    <div className="avatar-section">
                        <div className="avatar">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={displayName} />
                            ) : (
                                <User size={48} />
                            )}
                        </div>
                        <div className="avatar-glow"></div>
                    </div>

                    <div className="user-info">
                        {!isEditing ? (
                            <>
                                <h1 className="user-name">{displayName}</h1>
                                <p className="user-email">
                                    <Mail size={16} />
                                    {user.email}
                                </p>
                                <p className="join-date">Member since {getJoinDate()}</p>
                            </>
                        ) : (
                            <div className="edit-form">
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="edit-input"
                                    placeholder="Name"
                                />
                                <input
                                    type="email"
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    className="edit-input"
                                    placeholder="Email"
                                    disabled
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="stats-grid">
                    <div
                        className="stat-card clickable"
                        onClick={() => setLocation('/my-movies?tab=watched')}
                    >
                        <div className="stat-icon watched">
                            <Film size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{watched.length}</h3>
                            <p>Movies Watched</p>
                        </div>
                    </div>

                    <div
                        className="stat-card clickable"
                        onClick={() => setLocation('/my-movies?tab=favorites')}
                    >
                        <div className="stat-icon favorites">
                            <Heart size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{favorites.length}</h3>
                            <p>Favorites</p>
                        </div>
                    </div>

                    <div
                        className="stat-card clickable"
                        onClick={() => setLocation('/my-movies?tab=watchlist')}
                    >
                        <div className="stat-icon watchlist">
                            <Clock size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{watchlist.length}</h3>
                            <p>Watchlist</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon ratings">
                            <Star size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{calculateAvgRating()}</h3>
                            <p>Avg Rating</p>
                        </div>
                    </div>
                </div>

                <div className="profile-sections">
                    <div className="section">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => (
                                    <div key={index} className="activity-item">
                                        <div className="activity-icon">
                                            <activity.icon size={16} />
                                        </div>
                                        <div className="activity-text">
                                            <p>{activity.text}</p>
                                            <span>{getTimeAgo(activity.time)}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-activity">No recent activity. Start watching movies!</p>
                            )}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Statistics</h2>
                        <div className="preferences">
                            <div className="preference-item">
                                <span>Total Movies</span>
                                <strong>{watchlist.length + favorites.length + watched.length}</strong>
                            </div>
                            <div className="preference-item">
                                <span>Most Active List</span>
                                <strong>
                                    {watched.length >= favorites.length && watched.length >= watchlist.length
                                        ? 'Watched'
                                        : favorites.length >= watchlist.length
                                            ? 'Favorites'
                                            : 'Watchlist'}
                                </strong>
                            </div>
                            <div className="preference-item">
                                <span>Notifications</span>
                                <strong>{localStorage.getItem('notificationChoice') === 'enabled' ? 'Enabled' : 'Disabled'}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    className="btn-logout"
                    disabled={authLoading}
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    {authLoading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
}

export default Profile;