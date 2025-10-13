import "./HomeHeader.css"
import logo from '../assets/Black_Yellow_Illustration_Watch_Store_Logo-removebg-preview.png';


export default function HomeHeader() {
    return (
        <header className="header">
            <img src={logo} alt="logo" className="logo-image" />
            <nav className="nav">
                <a href="#" className="nav-link">Profile</a>
                <a href="#" className="nav-link">Watchlist</a>
            </nav>
        </header>
    );
}