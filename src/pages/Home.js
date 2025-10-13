import HomeHeader from '../components/HomeHeader';
import HeroCarousel from '../components/HeroCarousel';
import MovieGrid from '../components/MovieGrid';
import  "./HomeMovie.css"

export default function Home(){
    const featuredMovies = [
        {
            title: "Stranger Things",
            description: "On November 6, also known as Stranger Things Day 2024, Netflix confirmed that Stranger Things 5 will premiere in 2025. Though the streamer did not share an exact date, this is the biggest update fans have gotten yet on the arrival of season 5 — it almost seemed like it would never make it to the screen.",
            image: "https://upload.wikimedia.org/wikipedia/commons/3/38/Stranger_Things_logo.png"
        },
        {
            title: "The Dark Knight",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            image: "https://cdn.europosters.eu/image/1300/posters/the-dark-knight-trilogy-on-fire-i197743.jpg"
        }
    ];

    const topPicks = [
        {
            title: "La La Land",
            image: "https://upload.wikimedia.org/wikipedia/pt/c/c0/La_La_Land_%28filme%29.png"
        },
        {
            title: "Interstellar",
            image: "https://www.hauweele.net/~gawen/blog/wp-content/uploads/2014/11/interstellar.jpg"
        },
        {
            title: "Inglourious Basterds",
            image: "https://res.cloudinary.com/bloomsbury-atlas/image/upload/w_360,c_scale,dpr_1.5/jackets/9781441138217.jpg"
        },
        {
            title: "American Psycho",
            image: "https://static.wikia.nocookie.net/horrormovies/images/8/82/American_Psycho_%282000%29.jpg"
        }
    ];
    return (
        <div className="home-movie">
            <HomeHeader />
            <HeroCarousel movies={featuredMovies} />
            <MovieGrid movies={topPicks} />
        </div>
    );
}

