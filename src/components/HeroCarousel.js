import "./HomeHeroCarsouel.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { useLocation,  } from 'wouter';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function HeroCarousel({ movies }) {
    const [, setLocation] = useLocation();

    const handleMovieClick = (movieId) => {
        console.log(movieId);
        setLocation(`/movie/${movieId}`,);
    };
    return (
        <div className="hero-section">
            <div className="hero-content">
                <div className="hero-text">
                    <h2 className="hero-subtitle">What to watch</h2>
                    <h1 className="hero-title">Top picks</h1>
                </div>
                <div className="carousel-container">
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        navigation
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        style={{
                            "--swiper-navigation-color": "white",
                            "--swiper-navigation-size": "30px",
                            "--swiper-dots": false,

                        }}
                    >
                        {movies.map((movie, index) => (
                            <SwiperSlide key={index}>
                                <div className="carousel-item" onClick={() => handleMovieClick(movie.id)}>
                                    <img
                                        src={movie.image}
                                        alt={movie.title}
                                        className="carousel-image"
                                    />
                                    <div className="carousel-overlay" />
                                    <div className="carousel-info">
                                        <h3 className="carousel-title">{movie.title}</h3>
                                        <p className="carousel-description">{movie.description}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </div>
    );
}