import Banners from "../../components/banner/Banners.js";
import MovieCard from "../../components/movie/MovieCard.js";
import Button from "../../components/ui/Button.js";
import { fetchMovies } from "../../utils/fetchData.js";

const MoviesPage = async (moviePath, initialPage = 1) => {
    let moviesData = await fetchMovies(moviePath);

    let app = document.getElementById('app');
    app.innerHTML = "";

    let page = document.createElement('div');
    page.classList.add("movies");
    app.appendChild(page);

    let bannerContainer = await Banners(moviesData.slice(0, 3));

    let container = document.createElement('div');
    container.classList.add("movies__container");

    page.append(bannerContainer, container);

    moviesData.forEach(movie => {
        let movieCard = MovieCard(movie);
        container.appendChild(movieCard);
    });

    let button = Button("View more", false);
    button.style.marginBottom = "2rem";
    page.append(button);

    createShowMore(button, moviePath, initialPage);
}

function createMovie(movies) {
    let container = document.querySelector('.movies__container')

    movies.forEach(movie => {
        let movieCard = MovieCard(movie);
        container.appendChild(movieCard);
    });
}

async function createShowMore(button, moviePath, initialPage) {
    let observer = new IntersectionObserver(
        async entries => {
            let btn = entries[0];

            if (!btn.isIntersecting) return;

            initialPage++;

            let response = await fetch(`https://api.themoviedb.org/3/movie/${moviePath}?api_key=61abd3b74d3f82c9dd4f0647ff31fb34&S&page=${initialPage}`);
            let { results } = await response.json();

            createMovie(results);
        },
        {
            threshold: 1
        }
    )

    observer.observe(button);
}

export default MoviesPage;