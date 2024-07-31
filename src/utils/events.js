import showNotification from "../components/notification/Notification.js";
import AuthPage from "../pages/auth/AuthPage.js";
import { clearUser } from "../state/userState.js";

// Handles the users movie state watched, liked etc...
export const UserStatusMovieHandler = async (id, status, action) => {
    let data = {
        movie_id: id,
        status,
    }

    let response = await fetch(`routes/moviesRoute.php?action=${action}UserMovie`, {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    return await response.json();
}

export const UserFollowedHandler = async (user) => {
    let action = user.isFollowed ? "unfollow" : "follow";

    let response = await fetch(`routes/followsRoute.php?action=${action}&followed_user=${user.id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
    });

    let recourse = await response.json();

    user.isFollowed = !user.isFollowed; 

    updateFollowButton(user);
    showNotification(recourse);
};

const updateFollowButton = (user) => {
    let followButton = document.querySelector(".profile__page__avatar__follow");
    followButton.innerHTML = user.isFollowed ? `<i class="fa-solid fa-user-minus"></i>` : `<i class="fa-solid fa-user-plus"></i>`;
};

export const logoutHandler = async () => {
    let response = await fetch("routes/authRoute.php?action=logout");
    let res = await response.json();

    clearUser();

    document.getElementById("header").innerHTML = "";
    app.innerHTML = "";

    AuthPage();
}
