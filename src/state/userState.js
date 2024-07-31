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

export { setUser, clearUser, getUser };
