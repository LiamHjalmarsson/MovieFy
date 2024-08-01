import Header from "../../components/layouts/header/Header.js";
import MovieCard from "../../components/movie/MovieCard.js";
import showNotification from "../../components/notification/Notification.js";
import { clearUser, getUser, setUser } from "../../state/userState.js";
import { UserFollowedHandler } from "../../utils/events.js";
import { fetchExternalMovie } from "../../utils/externalFetch.js";
import { fetchUser } from "../../utils/internalFetch.js";
import AuthPage from "../auth/AuthPage.js";

const Profile = async (id) => {
    let { user } = getUser();
    let recourse = await fetchUser(id);

    console.log(recourse);
    let app = document.getElementById("app");
    app.innerHTML = "";

    let page = document.createElement("div");
    page.classList.add("profile");
    app.appendChild(page);

    if (user.id !== id) {
        otherUser(page, recourse);

        document.getElementById("follow").addEventListener("click", async (e) => UserFollowedHandler(recourse));
        document.getElementById("watchButton").addEventListener("click", () => showWatchedMovies(recourse.watched_movies));
        document.getElementById("likedButton").addEventListener("click", async () => showLikedMovies(recourse.liked_movies));

    } else {
        loggedInUser(page, recourse);

        document.getElementById("avatarUpdate").addEventListener("change", async (e) => avatarUpdateHandler(e, recourse));
        document.getElementById("editDetailsButton").addEventListener("click", (e) => edithUserHandler(e, recourse));
        document.getElementById("watchButton").addEventListener("click", () => showWatchedMovies(recourse.watched_movies));
        document.getElementById("likedButton").addEventListener("click", async () => showLikedMovies(recourse.liked_movies));
    }
}

const loggedInUser = (page, user) => {
    page.innerHTML = `
        <div class="profile__page__avatar">
            <form class="profile__page__avatar__form" id="avatarUpdate">
                <label for="avatarInput">
                    <i class="fa-solid fa-plus"></i>
                </label>
                <input type="file" id="avatarInput" style="display: none;" accept="image/*" />
            </form>

            <img src=${user?.avatar ? user.avatar : "../../../src/assets/default/deafultuser.png"} />

            <button class="profile__page__avatar__edith" id="editDetailsButton">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </div>

        <div class="profile__page__user">
            <h1>
            ${user.username}
            </h1>
            <i class="fa-solid fa-right-from-bracket"></i>
        </div>

        <form class="profile__page__form" style="display: none;">
            <input type="text" name="username" value="${user.username}" />
            <input type="email" name="email" value="${user.email}" />
            <input type="password" name=pwd" placeholder="Enter new password" />
            <div>
                <button class="button__primary" type="button" id="cancelButton">Cancel</button>
                <button class="button__primary" type="submit">Save</button>
            </div>
        </form>

        <div class="button__container">
            <button id="followersButton" class="button button--sub">
                Followers ${user.followers_count}
            </button>
            <button id="followingButton" class="button button--sub">
                Following ${user.following_count}
            </button>
            <button id="watchButton" class="button button--sub">
                Watched
            </button>
            <button id="likedButton" class="button button--sub">
                Liked
            </button>
        </div>

        <div class="profile__page__details">
        </div>
    `;

    document.querySelector(".profile__page__user > i").addEventListener("click", async () => await logoutHandler())
};

const otherUser = (page, user) => {
    page.innerHTML = `
        <div class="profile__page__avatar">
            <button class="profile__page__avatar__follow" id="follow">
                ${user.isFollowed ? `<i class="fa-solid fa-user-minus"></i>` : `<i class="fa-solid fa-user-plus"></i>`}
            </button>
            <img src=${user?.avatar ? user.avatar : "../../../src/assets/default/deafultuser.png"} />
        </div>
        <h1>${user.username}</h1>
        <div class="button__container">
            <button id="watchButton" class="button button--sub">
                Watched
            </button>
            <button id="likedButton" class="button button--sub">
                Liked
            </button>
        </div>

        <div class="profile__page__details">
        </div>
    `;
}

// Watched Movies 
const showWatchedMovies = async (watched_movies) => {
    let container = document.querySelector(".profile__page__details");
    container.innerHTML = `
        <h2>Watched Movies</h2>
        <div class="profile__page__details__movies"></div>
    `;

    watched_movies.forEach(async (movie, index) => {
        if (index <= 10) {
            let recourse = await fetchExternalMovie(movie.movie_id);
            let movieCard = MovieCard(recourse);

            document.querySelector(".profile__page__details__movies").append(movieCard);
        }
    });
}

// Liked Movies 
const showLikedMovies = async (liked) => {
    let container = document.querySelector(".profile__page__details");
    container.innerHTML = `
        <h2>Liked Movies</h2>
        <div class="profile__page__details__movies"></div>
    `;

    liked.forEach(async (movie, index) => {
        if (index <= 10) {
            let recourse = await fetchExternalMovie(movie.movie_id);
            let movieCard = MovieCard(recourse);

            document.querySelector(".profile__page__details__movies").append(movieCard);
        }
    });
}

// Handlers Logged in 
const avatarUpdateHandler = async (e, user) => {
    let file = e.target.files[0];
    let { userToken } = getUser();

    if (file) {
        let formData = new FormData();
        formData.append('avatar', file);

        try {
            let response = await fetch(`routes/userRoute.php?action=updateAvatar&id=${user.id}`, {
                method: 'POST',
                body: formData
            });

            let result = await response.json();

            if (response.ok) {
                document.querySelector(".profile__page__avatar img").src = result.user.avatar;
                user.avatar = result.user.avatar;
                setUser(user, userToken);

                document.getElementById("header").innerHTML = "";
                Header();
            } else {
                console.error("Failed to update avatar:", result.error);
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
        }
    }
}

const edithUserHandler = (e, user) => {
    let { userToken } = getUser();
    let detailsForm = document.querySelector(".profile__page__form");
    detailsForm.style.display = detailsForm.style.display === "none" ? "flex" : "none";

    document.querySelector(".profile__page__form").addEventListener("submit", async (e) => {
        e.preventDefault();

        let username = detailsForm.querySelector("input[type='text']").value;
        let email = detailsForm.querySelector("input[type='email']").value;
        let password = detailsForm.querySelector("input[type='password']").value;

        let data = {};

        if (username) data.username = username;
        if (email) data.email = email;
        if (password) data.password = password;

        let response = await fetch(`routes/userRoute.php?action=updateUser&id=${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log(response);
        let recourse = await response.json();
        console.log(recourse);

        setUser(recourse.user, userToken);
        showNotification(recourse);

        document.getElementById("header").innerHTML = "";
        Header()
    });
}

export const logoutHandler = async () => {
    let response = await fetch("routes/authRoute.php?action=logout");
    let res = await response.json();

    showNotification(res);
    clearUser();

    document.getElementById("header").innerHTML = "";
    app.innerHTML = "";

    AuthPage();
}


export default Profile;