import HomePage from "../../../pages/home/HomePage.js";
import MoviesPage from "../../../pages/movies/MoviesPage.js";
import Profile from "../../../pages/profile/Profile.js";
import UsersPage from "../../../pages/users/UsersPage.js";
import { getUser, clearUser } from "../../../state/userState.js";

let navLinks = [
    {
        path: "/",
        click: () => {
            window.history.pushState({}, "", `/`);
            HomePage();
        }
    },
    {
        path: "/topmovies",
        click: async () => {
            window.history.pushState({}, "", `/topmovies`);
            await MoviesPage("top_rated");
        }
    },
    {
        path: "/popularmovies",
        click: async () => {
            window.history.pushState({}, "", `/popularmovies`);
            await MoviesPage("now_playing");
        }
    },
    {
        path: "/upcoming",
        click: async () => {
            window.history.pushState({}, "", `/upcoming`);
            await MoviesPage("upcoming");
        }
    },
    {
        path: "/users",
        click: async () => {
            window.history.pushState({}, "", `/users`);
            await UsersPage("upcoming");
        }
    }
];

const Header = () => {
    let header = document.getElementById('header');

    let nav = document.createElement('nav');
    nav.classList.add('header__nav');
    header.append(nav);

    nav.append(LinksSection(), BurgerMenu(), UserSection());

    document.querySelector(".header__nav-user__icon")?.addEventListener("click", () => {
        let user = JSON.parse(localStorage.getItem("user"));
        window.history.pushState({}, "", `/${user.username}`);
        Profile(user.id);
    });
}

let LinksSection = () => {
    let ul = document.createElement('ul');
    ul.classList.add("header__nav-links")

    navLinks.forEach(navLink => {
        let link = document.createElement('li');
        link.classList.add("header__nav-links__link")
        link.textContent = navLink.path.slice(1) === "" ? "home" : navLink.path.slice(1);
        link.addEventListener("click", navLink.click);
        ul.append(link);
    });

    return ul;
}

let UserSection = () => {
    let { user } = getUser();

    let userSection = document.createElement('div');
    userSection.classList.add('header__nav-user__section');

    if (user) {
        userSection.innerHTML = `
            <div class="header__nav-user__icon">
                <span>${user?.username}</span>
                <img src=${user?.avatar ? user.avatar : "../../../../src/assets/default/deafultuser.png"} />
            </div>
        `;
    } else {
        userSection.innerHTML = `
            <div>
                <span>No user</span>
                <div></div>
            </div>
        `;
    }

    return userSection;
} 

let BurgerMenu = () => {
    let burgerMenu = document.createElement('div');
    burgerMenu.classList.add('header__nav-burger__menu');
    burgerMenu.innerHTML = `
        <div class="header__nav-burger__menu-icon">
            <div></div>
            <div></div>
            <div></div>
        </div>
    `;

    burgerMenu.addEventListener('click', () => {
        document.querySelector(".header__nav").classList.toggle('header__nav--active');
        burgerMenu.classList.toggle('header__burger-menu--toggle');
    });

    return burgerMenu;
}

export default Header;
