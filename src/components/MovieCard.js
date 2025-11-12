import "./HomeMovieGrid.css"
import { useLocation,  } from 'wouter';


export default function MovieCard({movie}) {
    const [, setLocation] = useLocation();
    const handleMovieClick = (movieId) => {
        console.log(movieId);
        setLocation(`/movie/${movieId}`,);
    };
    return (
        <div className="movie-card" onClick={() => handleMovieClick(movie.id)}>
            <img
                src={movie.image}
                alt={movie.title}
                className="movie-image"
            />
            <div className="movie-overlay">
                <div className="movie-title-container">
                    <h4 className="movie-title-grid">{movie.title}</h4>
                </div>
            </div>
        </div>
    );
};