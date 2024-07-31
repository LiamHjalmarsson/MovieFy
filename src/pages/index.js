import Header from "../components/layouts/header/Header.js";
import AuthPage from "./auth/AuthPage.js";
import HomePage from "./home/HomePage.js";

document.addEventListener('DOMContentLoaded', async () => {
    let user = localStorage.getItem("userToken");

    if (user) {
        Header();
        await HomePage();
    } else {
        AuthPage();
    }
});
