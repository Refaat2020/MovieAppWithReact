import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
    Home,
    // Search,
    Heart,
    Clock,
    Film,
    User,
    Menu,
    X,
    Bell,
    LogOut
} from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import useAuthStore from "../store/useAuthStore";
import "./AppBar.css";
import logo from '../assets/Black_Yellow_Illustration_Watch_Store_Logo-removebg-preview.png';

export default function AppBar() {
    const [location, setLocation] = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const { user, watchlist, favorites, watched } = useUserStore();
    const { logout } = useAuthStore();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    }, [location]);

    const navItems = [
        { path: "/", icon: Home, label: "Home" },
        { path: "/my-movies?tab=watchlist", icon: Clock, label: "Watchlist", count: watchlist.length },
        { path: "/my-movies?tab=favorites", icon: Heart, label: "Favorites", count: favorites.length },
        { path: "/my-movies?tab=watched", icon: Film, label: "Watched", count: watched.length },
    ];

    const isActive = (path) => {
        if (path === "/") return location === "/";
        return location.startsWith(path.split("?")[0]);
    };

    const handleLogout = async () => {
        await logout();
        setLocation("/");
    };

    const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

    return (
        <>
            <nav className={`app-bar ${isScrolled ? "scrolled" : ""}`}>
                <div className="app-bar-content">
                    {/* Logo */}
                    <div className="app-bar-logo" onClick={() => setLocation("/")}>
                        <img src={logo} alt="logo" className="logo-image" />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="nav-links desktop">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                                onClick={() => setLocation(item.path)}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                                {item.count > 0 && (
                                    <span className="nav-badge">{item.count}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="nav-right">
                        {/* Notifications */}
                        <button className="icon-btn" title="Notifications">
                            <Bell size={20} />
                        </button>

                        {/* User Profile / Auth */}
                        {user ? (
                            <div className="profile-dropdown">
                                <button
                                    className="profile-btn"
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={displayName} />
                                    ) : (
                                        <User size={20} />
                                    )}
                                    <span className="profile-name">{displayName}</span>
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <p className="dropdown-name">{displayName}</p>
                                            <p className="dropdown-email">{user.email}</p>
                                        </div>
                                        <div className="dropdown-divider" />
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setLocation("/profile")}
                                        >
                                            <User size={16} />
                                            My Profile
                                        </button>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => setLocation("/my-movies")}
                                        >
                                            <Film size={16} />
                                            My Movies
                                        </button>
                                        <div className="dropdown-divider" />
                                        <button
                                            className="dropdown-item logout"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                className="login-btn"
                                onClick={() => setLocation("/login")}
                            >
                                Sign In
                            </button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
                <div className="mobile-menu-content">
                    {user && (
                        <div className="mobile-user-info">
                            <div className="mobile-avatar">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={displayName} />
                                ) : (
                                    <User size={24} />
                                )}
                            </div>
                            <div>
                                <p className="mobile-name">{displayName}</p>
                                <p className="mobile-email">{user.email}</p>
                            </div>
                        </div>
                    )}

                    <div className="mobile-nav-links">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                className={`mobile-nav-link ${isActive(item.path) ? "active" : ""}`}
                                onClick={() => setLocation(item.path)}
                            >
                                <item.icon size={22} />
                                <span>{item.label}</span>
                                {item.count > 0 && (
                                    <span className="mobile-badge">{item.count}</span>
                                )}
                            </button>
                        ))}

                        {user && (
                            <>
                                <div className="mobile-divider" />
                                <button
                                    className="mobile-nav-link"
                                    onClick={() => setLocation("/profile")}
                                >
                                    <User size={22} />
                                    <span>My Profile</span>
                                </button>
                                <button
                                    className="mobile-nav-link logout"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={22} />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}

                        {!user && (
                            <button
                                className="mobile-nav-link login"
                                onClick={() => setLocation("/login")}
                            >
                                <User size={22} />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}