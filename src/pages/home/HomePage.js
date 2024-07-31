import Banners from "../../components/banner/Banners.js";
import Loading from "../../components/loading/Loading.js";
import MovieCard from "../../components/movie/MovieCard.js";
import { fetchExternalMovies } from "../../utils/externalFetch.js";
import { fetchFollowing, fetchUsers } from "../../utils/internalFetch.js";
import { slide } from "../../utils/slide.js";
import Profile from "../profile/Profile.js";

const HomePage = async () => {
    let app = document.getElementById('app');
    app.innerHTML = "";

    // let loading = Loading();

    let [topRatedMovies, upcomingMovies, nowPlayingMovies] = await Promise.all([
        fetchExternalMovies("top_rated"),
        fetchExternalMovies("now_playing"),
        fetchExternalMovies("upcoming"),
    ]);

    let home = document.createElement('div');
    home.classList.add('home');

    let bannerContainer = await Banners(upcomingMovies.slice(0, 6));
    app.append(bannerContainer, home);

    let followingsBar = await FollowingsBar();

    let upcoming = MovieRow("upcoming", upcomingMovies);
    let nowPlaying = MovieRow("now_playing", nowPlayingMovies);
    let topRated = MovieRow("top_rated", topRatedMovies);

    if (followingsBar) {
        home.appendChild(followingsBar);
    }

    home.append(upcoming, nowPlaying, topRated);

    // setTimeout(() => {
    //     loading.remove();
    // }, 1500);
};

const FollowingsBar = async () => {
    let following = await fetchFollowing();
    let allUsers = await fetchUsers();

    if (following.length > 0) {
        let followingsContainer = document.createElement("div");
        followingsContainer.classList.add("home__followings");

        let followingsWrapper = document.createElement("div");
        followingsWrapper.classList.add("home__followings-wrapper");

        followingsContainer.append(followingsWrapper);

        allUsers.forEach(user => {
            following.forEach(follow => {
                if (follow.followed_user === user.id) {
                    let followElement = document.createElement("div");
                    followElement.classList.add("home__followings-user");

                    let avatar = user.avatar || "../../../src/assets/default/deafultuser.png";
                    
                    followElement.innerHTML = `
                        <img src=${avatar} class="home__followings-avatar" />
                        <p>
                            ${user.username}
                        </p>
                    `;

                    followElement.addEventListener("click", async () => {
                        window.history.pushState({}, "", `/${user.username}`);
                        await Profile(follow.followed_user);
                    });

                    followingsWrapper.append(followElement);
                }
            });
        })

        return followingsContainer;
    }
    return false;
}

const MovieRow = (id, movies) => {
    let movieRow = document.createElement('div');
    movieRow.classList.add("home__movies");

    let title = document.createElement('h2');
    title.classList.add("home__movies-title");

    let movieTitle = id.includes("_") ? id.replace("_", "") : id;
    title.textContent = movieTitle;

    let movieContainer = document.createElement('div');
    movieContainer.classList.add("home__movies-container");

    let movieBox = document.createElement('div');
    movieBox.classList.add("home__movies-box");

    let leftArrow = Arrow('left', () => slide(movieBox, 'left'));
    let rightArrow = Arrow('right', () => slide(movieBox, 'right'));

    movieContainer.append(leftArrow, movieBox, rightArrow);
    movieRow.append(title, movieContainer);

    movies.forEach(movie => {
        let movieCard = MovieCard(movie);
        movieBox.appendChild(movieCard);
    });

    return movieRow;
}

const Arrow = (direction, onClick) => {
    let arrow = document.createElement('div');
    arrow.classList.add("arrow", `${direction}-arrow`);
    let arrowDirection = direction === "left" ? `<i class="fa-solid fa-angle-left"></i>` : `<i class="fa-solid fa-angle-right"></i>`;
    arrow.innerHTML = arrowDirection;
    arrow.addEventListener('click', onClick);

    return arrow;
}

export default HomePage;