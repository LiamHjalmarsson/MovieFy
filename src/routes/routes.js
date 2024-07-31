import HomePage from "../pages/home/HomePage.js";
import MoviesPage from "../pages/movies/MoviesPage.js";

const Router = async () => {
    let path = window.location.pathname.trim();

    switch (path) {
        case '/':
            await HomePage();
            break;
        case '/topmovies':
            await MoviesPage('top_movies');
            break;
        case '/popularmovies':
            await MoviesPage('popular_movies');
            break;
        case '/upcoming':
            await MoviesPage('upcoming');
            break;
        default:
            HomePage();
    }
};

export default Router;
