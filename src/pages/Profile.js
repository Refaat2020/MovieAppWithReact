import React, {useEffect, useState} from 'react';
import { User, Mail, Film, Heart, Clock, Star, LogOut, Edit2, Save, X } from 'lucide-react';
import './Profile.css';
import useAuthStore from "../store/useAuthStore";
import {toast} from "react-toastify";
import { useLocation } from 'wouter';

function Profile() {
    const [user, setUser] = useState({
        name: 'Refaat Rady',
        email: 'Refaat@example.com',
        joinDate: 'OCT 2025',
        watchedMovies: 127,
        favoriteMovies: 23,
        watchlistCount: 15
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(user.name);
    const [editedEmail, setEditedEmail] = useState(user.email);
    const { logout, loading, error, success } = useAuthStore();
    const [location, setLocation] = useLocation();

    // DEBUG: Track auth state changes
    useEffect(() => {
        if (error) {
            toast.error(error, {
                theme: "dark",
            });
        } else if (success === true) {
            setLocation('/', { replace: true });
        }
    }, [error, success, loading, setLocation]);

    const handleSave = () => {
        console.log('💾 Saving profile changes');
        setUser({
            ...user,
            name: editedName,
            email: editedEmail
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        console.log('❌ Cancelling profile edit');
        setEditedName(user.name);
        setEditedEmail(user.email);
        setIsEditing(false);
    };

    const handleLogout = async () => {
        await logout();
        setLocation('/', { replace: true });
    };

    console.log('👤 Profile render:', {
        location,
        isEditing,
        loading,
        error,
        success,
        user
    });

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-header">
                    <div className="avatar-section">
                        <div className="avatar">
                            <User size={48} />
                        </div>
                        <div className="avatar-glow"></div>
                    </div>

                    <div className="user-info">
                        {!isEditing ? (
                            <>
                                <h1 className="user-name">{user.name}</h1>
                                <p className="user-email">
                                    <Mail size={16} />
                                    {user.email}
                                </p>
                                <p className="join-date">Member since {user.joinDate}</p>
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
                                />
                            </div>
                        )}
                    </div>

                    <div className="action-buttons">
                        {!isEditing ? (
                            <button className="btn-edit" onClick={() => setIsEditing(true)}>
                                <Edit2 size={18} />
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button className="btn-save" onClick={handleSave}>
                                    <Save size={18} />
                                    Save
                                </button>
                                <button className="btn-cancel" onClick={handleCancel}>
                                    <X size={18} />
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon watched">
                            <Film size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{user.watchedMovies}</h3>
                            <p>Movies Watched</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon favorites">
                            <Heart size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{user.favoriteMovies}</h3>
                            <p>Favorites</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon watchlist">
                            <Clock size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{user.watchlistCount}</h3>
                            <p>Watchlist</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon ratings">
                            <Star size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>4.2</h3>
                            <p>Avg Rating</p>
                        </div>
                    </div>
                </div>

                <div className="profile-sections">
                    <div className="section">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <Heart size={16} />
                                </div>
                                <div className="activity-text">
                                    <p>Added <strong>Inception</strong> to favorites</p>
                                    <span>2 hours ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <Star size={16} />
                                </div>
                                <div className="activity-text">
                                    <p>Rated <strong>The Dark Knight</strong> 5 stars</p>
                                    <span>1 day ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <Clock size={16} />
                                </div>
                                <div className="activity-text">
                                    <p>Added <strong>Dune: Part Two</strong> to watchlist</p>
                                    <span>3 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <h2>Preferences</h2>
                        <div className="preferences">
                            <div className="preference-item">
                                <span>Favorite Genre</span>
                                <strong>Sci-Fi</strong>
                            </div>
                            <div className="preference-item">
                                <span>Language</span>
                                <strong>English</strong>
                            </div>
                            <div className="preference-item">
                                <span>Notifications</span>
                                <strong>Enabled</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="btn-logout" disabled={loading} onClick={handleLogout}>
                    <LogOut size={18} />
                    {loading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    );
}

export default Profile;