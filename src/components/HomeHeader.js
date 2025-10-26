import "./HomeHeader.css"
import logo from '../assets/Black_Yellow_Illustration_Watch_Store_Logo-removebg-preview.png';
// import { useNavigate, Link } from "react-router-dom";
import { Link } from 'wouter';

import React from "react";

export default function HomeHeader() {
    return (
        <header className="header">
            <img src={logo} alt="logo" className="logo-image" />
            <nav className="nav">
                <Link to="/profile" style={{textDecoration: 'none', color: 'white'}} >
                    Profile
                </Link>
                <Link to="/watchlist" style={{textDecoration: 'none', color: 'white'}} >
                    Watchlist
                </Link>
            </nav>
        </header>
    );
}