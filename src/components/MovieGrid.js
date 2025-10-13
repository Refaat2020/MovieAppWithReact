import "./HomeMovieGrid.css"
import MovieCard from "./MovieCard";


export default function MovieGrid({movies}) {
    return (
        <div className="movie-grid">
            {movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
            ))}
        </div>
    );
};