import showNotification from "../../components/notification/Notification.js";
import { Details, Reviews } from "./MoviePage.js";

export const Form = (movie) => {
    let form = document.createElement("form");
    form.id = "reviewForm";
    form.classList.add("movie-form");

    form.innerHTML = `
        <h3>
            Review For <br> ${movie.title}
        </h3>
        <textarea id="reviewText" placeholder="Write your review here..." class="movie-form__textfield">
        </textarea>
        <div class="movie-form__stars">
            ${[1, 2, 3, 4, 5].map(i => `
                <span class="movie-form__star" data-rating="${i}">&#9733;</span>
            `).join('')}
        </div>
        <div class="movie-form__buttons">
            <button id="cancelReview" class="button__primary" type="button">Cancel</button>
            <button id="submitReview" class="button__primary" type="submit">Submit</button>
        </div>
    `;

    let selectedRating = 0;

    form.querySelectorAll(".movie-form__star").forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStars(form, selectedRating);
        });
    });

    form.querySelector("#submitReview").addEventListener("click", async (e) => {
        e.preventDefault();
        let reviewText = document.getElementById("reviewText").value;

        let data = {
            review: reviewText,
            movie_id: movie.id,
            rating: selectedRating
        };

        try {
            let response = await fetch("../routes/reviewRoute.php?action=addReviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            let result = await response.json();
            showNotification(result);

            if (response.ok) {
                await refreshReviews(movie);
            }
            
            document.querySelector(".module__backdrop--close").remove();
            form.remove();
            document.body.style.overflow = '';
        } catch (error) {
            showNotification(error);
        }
    });

    form.querySelector("#cancelReview").addEventListener("click", () => {
        form.classList.add("hidden");
        document.querySelector(".module__backdrop").remove();
        document.body.style.overflow = '';
    });

    // Function to refresh reviews
    const refreshReviews = async (movie) => {
        let getReviewsResponse = await fetch(`../routes/reviewRoute.php?action=getMovieReviews&movie_id=${movie.id}`);
        let reviewData = await getReviewsResponse.json();

        document.querySelector(".movie-reviews").remove();
        document.querySelector(".movie-container").appendChild(Reviews(reviewData), Details(movie));
    };

    return form;
}

const updateStars = (form, rating) => {
    form.querySelectorAll(".movie-form__star").forEach(star => {
        star.classList.toggle("filled", parseInt(star.dataset.rating) <= rating);
    });
}