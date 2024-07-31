import { fetchExternalMoviePoster } from "../../utils/externalFetch.js";
import { initializeSlider } from "../../utils/slide.js";
import { GoToMovieButton, LeaveReviewButton, LikeMovieButton, WatchLaterButton } from "../buttons/Buttons.js";

const Banners = async (movies) => {
    movies.splice(6);

    let bannerContainer = document.createElement('div');
    bannerContainer.classList.add("banners");

    let bannersSlider = document.createElement('div');
    bannersSlider.classList.add("banners__slider");

    for (let movie of movies) {
        let banner = await Banner(movie);
        bannersSlider.append(banner);
    }

    let firstBannerClone = bannersSlider.children[0].cloneNode(true);
    bannersSlider.append(firstBannerClone);

    bannerContainer.append(bannersSlider);
    initializeSlider(bannersSlider);

    return bannerContainer;
}

export const Banner = async (movie) => {
    let imageData = await fetchExternalMoviePoster(movie.id);

    let banner = document.createElement('div');
    banner.classList.add("banners__banner");

    banner.innerHTML = `
        <img src="https://image.tmdb.org/t/p/original${imageData[0].file_path}" alt="${movie.title}" class="banners__banner-image"/>

        <div class="banners__banner-overlay"></div>

        <div class="banners__banner-details">
            <div class="banners__banner-details-content">
                <div>
                    <h1 class="banners__banner-title">
                    ${movie.title}
                    </h1>
                    <h3 class="banners__banner-release-date">
                    ${movie.release_date}
                    </h3>
                </div>

                <p class="banners__banner-overview">
                    ${movie.overview}
                </p>

                <div class="button__container">
                </div>
            </div>

            <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}" class="banners__banner-poster"/>
        </div>
    `;

    await bannerButtons(banner, movie);

    if (movie.genres) {
        bannerGenres(banner, movie);
    }

    return banner;
}

const bannerButtons = async (banner, movie) => {
    let path = window.location.pathname;
    let movieUrl = path.slice(1).replace(/_/g, ' ');

    let watchLaterButton = await WatchLaterButton(movie);
    let liked = LikeMovieButton();
    
    if (movieUrl !== movie.title) {
        let goToButton = GoToMovieButton(movie);
        banner.querySelector(".button__container").append(watchLaterButton, liked, goToButton);
    } else {
        let leaveReview = LeaveReviewButton(movie);
        banner.querySelector(".button__container").append(watchLaterButton, leaveReview, liked);
    }
}

const bannerGenres = (banner, movie) => {
    let genresContainer = document.createElement('div');
    genresContainer.classList.add('banners__banner-genres');

    movie.genres.forEach(genre => {
        let genreElement = document.createElement("div");
        genreElement.textContent = genre.name;
        genresContainer.append(genreElement);
    });

    let detailsContent = banner.querySelector(".banners__banner-details-content");
    let overviewParagraph = detailsContent.querySelector(".banners__banner-overview");

    detailsContent.insertBefore(genresContainer, overviewParagraph);
}

export default Banners;