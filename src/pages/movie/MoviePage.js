import { Banner } from "../../components/banner/Banners.js";
import MovieCard from "../../components/movie/MovieCard.js";
import Trailer from "../../components/video/Trailer.js";
import { fetchMovie, fetchMoviePosters, fetchSimilar, fetchVideo } from "../../utils/fetchData.js";

const MoviePage = async (id) => {
    let movieData = await fetchMovie(id);
    let getReviewsResponse = await fetch(`routes/reviewRoute.php?action=getMovieReviews&movie_id=${id}`);
    let reviewData = await getReviewsResponse.json();
    let posters = await fetchMoviePosters(id);
    let video = await fetchVideo(id);

    let similar = await fetchSimilar(id);
    let app = document.getElementById("app");

    app.innerHTML = "";

    let page = document.createElement("div");
    app.appendChild(page);
    page.classList.add("movie", "movie__slideInRight");

    let banner = await Banner(movieData);
    banner.style.height = "100vh";
    page.appendChild(banner);

    let container = document.createElement("div");
    container.classList.add("movie-container");

    let similarContainer = document.createElement('div');
    similarContainer.classList.add("movie-similarMovies");

    page.append(Details(movieData, posters, video), container);

    if (reviewData.length > 0) {
        container.append(similarContainer, Reviews(reviewData));
    } else {
        container.append(similarContainer);
    }

    similar.slice(0, 6).forEach(movie => {
        let movieCard = MovieCard(movie);
        similarContainer.appendChild(movieCard);
    });
}

export const Reviews = (data) => {
    let reviews = document.createElement("div");
    reviews.classList.add("movie-reviews");

    reviews.innerHTML = `
        <h3 class="movie-reviews__title">
            Reviews
        </h3>
    `;

    data.slice(0, 3).forEach(review => {
        let reviewElement = document.createElement("div");
        reviewElement.classList.add("movie-review");

        reviewElement.innerHTML = `
                <div class="movie-review__header">
                    <img src="${review.avatar || "../../../src/assets/default/deafultuser.png"}" class="movie-review__header-image" alt="${review.username}">
                    
                    <div>
                        <span>
                            ${review.username}
                        </span>
                        <span>
                            Rating: ${review.rating}/5
                        </span>
                    </div>

                </div>
                
                <div class="movie-review__body">
                    <p>${review.review}</p>
                </div>
        `;

        reviews.append(reviewElement)
    });

    return reviews;
}

export const Details = (movie, posters, video) => {
    let details = document.createElement("div");
    details.classList.add("movie-details");

    details.innerHTML = `
        <h2 class="movie-details__title">
            ${movie.title}
        </h2>
        <div class="movie-details__cards">
            <div class="movie-details__card">
                <span>Release Date: </span>
                <span> ${movie.release_date || 'Not available'} </span>
            </div>
            <div class="movie-details__card">
                <span>Runtime: </span>
                <span>  ${movie.runtime ? `${movie.runtime} minutes` : 'Not available'} </span>
            </div>
            <div class="movie-details__card">
                <span>Vote Average: </span>
                <span> ${movie.vote_average || 'Not available'} </span>
            </div>
        </div>
        <div class="movie-details__images">
        </div>
    `;

    let imagesContainer = details.querySelector(".movie-details__images");

    posters.slice(0, 3).forEach(poster => {
        let image = document.createElement("img");
        image.src = `https://image.tmdb.org/t/p/w500${poster.file_path}`;
        image.alt = `${movie.title} Poster`;
        image.classList.add("movie-details__image");

        imagesContainer.append(image);
    });

    if (video) {
        let trailer = Trailer(video.key);
        details.append(trailer);
    }

    return details;
}


export default MoviePage;
