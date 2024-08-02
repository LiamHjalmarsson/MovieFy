const userState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    userToken: localStorage.getItem("userToken") || null,
};

const setUser = (user, token) => {
    userState.user = user;
    userState.userToken = token;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userToken", token);
};

const clearUser = () => {
    userState.user = null;
    userState.userToken = null;
    
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
};

const getUser = () => {
    return userState;
};

const updateUserMovies = (movieId, statusType, action) => {
    if (!userState.user) return;

    let { user } = userState;

    if (action === "add") {

        if (!user[statusType]) {
            user[statusType] = [];
        }

        user[statusType].push({ movie_id: movieId });
    } else if (action === "remove") {

        if (user[statusType]) {
            user[statusType] = user[statusType].filter(movie => movie.movie_id !== movieId);
        }

    }

    setUser(user, userState.userToken);
    console.log(userState);
};


export { setUser, clearUser, getUser, updateUserMovies };
