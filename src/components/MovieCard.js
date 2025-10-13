import "./HomeMovieGrid.css"


export default function MovieCard({movie}) {
    return (
        <div className="movie-card">
            <img
                src={movie.image}
                alt={movie.title}
                className="movie-image"
            />
            <div className="movie-overlay">
                <div className="movie-title-container">
                    <h4 className="movie-title">{movie.title}</h4>
                </div>
            </div>
        </div>
    );
};