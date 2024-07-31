import { Form } from "../../pages/movie/LeaveReview.js";
import MoviePage from "../../pages/movie/MoviePage.js";
import { UserMovieHandler } from "../../utils/events.js";
import { fetchMovieStatus } from "../../utils/fetchData.js";
import showNotification from "../notification/Notification.js";

const Button = (buttonCLass) => {
    let button = document.createElement('button');
    button.classList.add("button", "button--sub", buttonCLass);

    return button;
}

export const LeaveReviewButton = (movie) => {
    let button = Button("button--review");
    button.innerHTML = `<i class="fa-regular fa-star"></i>`;

    button.addEventListener("click", () => {
        let backdropContainer = document.createElement('div');
        backdropContainer.classList.add("module__backdrop");
        document.getElementById("module").append(backdropContainer);

        let form = Form(movie);
        backdropContainer.appendChild(form);

        backdropContainer.addEventListener("click", (event) => {
            if (event.target === backdropContainer) {
                backdropContainer.classList.add("module__backdropClose");

                backdropContainer.addEventListener("animationend", () => {
                    backdropContainer.remove();
                    form.remove();
                }, { once: true });
            }
        });
    });

    return button;
};

export const WatchLaterButton = async (movie) => {
    let status = await fetchMovieStatus(movie.id);
    let button = Button("button--watchLater");

    button.innerHTML = `${status.includes("watch_later")
        ? `<i class="fa-solid fa-bookmark"></i>`
        : `<i class="fa-regular fa-bookmark"></i>`}`;

    button.addEventListener("click", async () => {
        if (status.includes("watch_later")) {
            let result = await UserMovieHandler(movie.id, "watch_later", "remove");
            button.innerHTML = `<i class="fa-regular fa-bookmark"></i>`;

            showNotification({ success: movie.title + " " + result.success });

            status.splice(status.indexOf("watch_later"), 1);
        } else {
            let result = await UserMovieHandler(movie.id, "watch_later", "add");

            button.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;

            showNotification({ success: movie.title + " " + result.success });
            status.push("watch_later");
        }
    });

    return button;
};

export const GoToMovieButton = (movie) => {
    let button = Button("button--goTo");
    button.innerHTML = `<i class="fa-solid fa-angle-right"></i>`;

    let module = document.querySelector(".module__backdrop");

    button.addEventListener("click", async () => {
        let movieCard = document.querySelector(".movie__card-open");
        
        window.history.pushState({}, "", `/${movie.title.replace(/\s+/g, '_')}`);
        await MoviePage(movie.id);

        if (movieCard) {
            movieCard.classList.add("movie__card__slideOut");
        }

        if (module) {
            document.querySelector(".module__backdrop").classList.add("module__backdropClose");

            setTimeout(() => {
                document.querySelector(".module__backdrop").remove();
            }, 300);
        }
    });

    return button;
};

export const LikeMovieButton = (movie) => {
    let button = Button("button--like");
    button.innerHTML = `<i class="fa-regular fa-heart"></i>`;

    return button;
}