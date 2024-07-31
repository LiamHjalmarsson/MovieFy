import { fetchMovieCredits, fetchProviders, fetchVideo } from "../../utils/fetchData.js";
import { GoToMovieButton, LikeMovieButton, WatchLaterButton } from "../buttons/Buttons.js";
import { LoadingImage } from "../loading/Loading.js";
import Image from "../ui/image.js";
import ImageIcon from "../ui/imageIcon.js";
import Trailer from "../video/Trailer.js";

const MovieCard = (movie) => {
    let movieCard = document.createElement('div');
    movieCard.classList.add("movie__card");

    let loadingIcon = LoadingImage();
    movieCard.append(loadingIcon);

    let img = Image(`https://image.tmdb.org/t/p/original${movie.poster_path}`, movie.title, loadingIcon);
    img.classList.add("movie__card-img");

    movieCard.appendChild(img);
    movieCard.addEventListener("click", () => OpenMovie(movie));

    return movieCard;
};

const OpenMovie = async (movie) => {
    let backdrop = Backdrop();

    let container = document.createElement('div');
    container.classList.add("movie__card-open");
    backdrop.append(container);

    let video = await fetchVideo(movie.id);

    if (video) {
        let trailer = Trailer(video.key);
        container.appendChild(trailer);
    }

    let movieDetails = await MovieDetails(movie);
    let title = Title(movie);

    container.append(title, movieDetails);

    let goToButton = GoToMovieButton(movie);
    let watchLaterButton = await WatchLaterButton(movie);
    let likedButton = LikeMovieButton();

    title.querySelector(".movie__card-heading__buttons").append(watchLaterButton, likedButton, goToButton);
}

const Backdrop = () => {
    let backdropContainer = document.createElement('div');
    backdropContainer.classList.add("module__backdrop");
    document.getElementById("module").append(backdropContainer);

    backdropContainer.addEventListener("click", (event) => {
        if (event.target === backdropContainer) {
            backdropContainer.classList.add("module__backdropClose");
            let openCard = document.querySelector(".movie__card-open");

            openCard.classList.add("movie__card__slideOut");

            setTimeout(() => {
                backdropContainer.remove();
                openCard.remove();
            }, 300);
        }
    });

    return backdropContainer;
}

const Title = (movie) => {
    let title = document.createElement('div');
    title.classList.add("movie__card-heading");

    title.innerHTML = `
        <div>
            <h1>${movie.title}</h1>
            <p class="heading__release">${movie.release_date}</p>
        </div>
        <div class="movie__card-heading__buttons">
        </div>
    `;

    return title;
};

const MovieDetails = async (movie) => {
    let movieDetails = document.createElement('div');
    movieDetails.classList.add("movie__card-details");

    let details = document.createElement('div');
    details.classList.add("movie__card-details__item");

    let image = Image(`https://image.tmdb.org/t/p/original${movie.poster_path}`, movie.title);
    image.classList.add("movie__card-details__item-img");
    movieDetails.append(details, image);

    details.innerHTML = `
        <div class="movie__card-details__item-synopsis">
            <h2>Synopsis</h2>
            <p class="movie__card-details__item-overview">${movie.overview}</p>
        </div>
    `;

    // let streamProviders = await Providers(movie.id);
    let cast = await CastMembers(movie.id);

    details.append(cast);

    return movieDetails;
};

export const CastMembers = async (id) => {
    let castMembersData = await fetchMovieCredits(id);

    let castMembers = document.createElement("div");
    castMembers.classList.add("movie__card-details__cast");
    castMembers.innerHTML = `
        <h2>Cast</h2>
        <div class="movie__card-details__cast-items"></div>
    `;

    if (castMembersData) {
        castMembersData.slice(0, 5).forEach(member => {
            let castImage = member.profile_path ? `https://image.tmdb.org/t/p/w200/${member.profile_path}` : 'path/to/default/image';
            let imageIcon = ImageIcon(castImage, member.name);

            castMembers.querySelector("div").append(imageIcon);
        });
    } else {
        castMembers.querySelector("div").innerHTML = "<p>No cast information available</p>";
    }

    return castMembers;
};

export const Providers = async (id) => {
    let providersData = await fetchProviders(id);

    let streamProviders = document.createElement("div");
    streamProviders.classList.add("stream");
    streamProviders.innerHTML = `
        <h2>Buy or Rent</h2>
        <div></div>
    `;

    if (providersData && providersData.buy) {
        providersData.buy.slice(0, 6).forEach(provider => {
            let providerImage = `https://media.themoviedb.org/t/p/original/${provider.logo_path}`;
            let imageIcon = ImageIcon(providerImage, provider.provider_name);
            streamProviders.querySelector("div").append(imageIcon);
        });
    } else {
        streamProviders.querySelector("div").innerHTML = "<p>No providers available</p>";
    }

    return streamProviders;
};

export default MovieCard;