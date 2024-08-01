import showNotification from "../../components/notification/Notification.js";
import { Reviews } from "./MoviePage.js";

export const Form = (movie, reviewed) => {
    let form = document.createElement("form");
    form.id = "reviewForm";
    form.classList.add("movie-form");

    let reviewTitle = reviewed ? "Edit Review For" : "Review For";
    let reviewText = reviewed ? reviewed.review : "";
    let selectedRating = reviewed ? reviewed.rating : 0;

    form.innerHTML = `
        <h3>
            ${reviewTitle} <br> ${movie.title}
        </h3>
        <textarea id="reviewText" placeholder="Write your review here..." class="movie-form__textfield">${reviewText}</textarea>
        <div class="movie-form__stars">
            ${[1, 2, 3, 4, 5].map(i => `
                <span class="movie-form__star" data-rating="${i}">&#9733;</span>
            `).join('')}
        </div>
        <div class="movie-form__buttons">
            <button id="cancelReview" class="button--sub button" type="button">
                Cancel
            </button>
            <button id="${reviewed ? "updateReview" : "submitReview"}" class="button--sub button" type="submit">
                ${reviewed ? "Update" : "Submit"}
            </button>
        </div>
    `;

    updateStars(form, selectedRating);

    form.querySelectorAll(".movie-form__star").forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStars(form, selectedRating);
        });
    });

    if (reviewed) {
        form.querySelector("#updateReview").addEventListener("click", (e) => updateReview(e, movie, selectedRating, reviewed));
    } else {
        form.querySelector("#submitReview").addEventListener("click", (e) => submitReview(e, movie, selectedRating));
    }

    form.querySelector("#cancelReview").addEventListener("click", closeForm);

    return form;
}

const submitReview = async (e, movie, selectedRating) => {
    e.preventDefault();
    let reviewText = document.getElementById("reviewText").value;

    let data = {
        review: reviewText,
        movie_id: movie.id,
        rating: selectedRating
    };

    let response = await fetch("routes/reviewRoute.php?action=addReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    let result = await response.json();

    showNotification(result);

    if (response.ok) {
        await refreshReviews(movie);
        closeForm();
    }
}

const updateReview = async (e, movie, selectedRating, reviewed) => {
    e.preventDefault();

    let reviewText = document.getElementById("reviewText").value;

    let data = {
        review: reviewText,
        movie_id: movie.id,
        rating: selectedRating,
        review_id: reviewed.id
    };

    let response = await fetch("routes/reviewRoute.php?action=updateReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    let result = await response.json();

    console.log(result);
    
    showNotification(result);

    if (response.ok) {
        await refreshReviews(movie);
        closeForm();
    }
}

const closeForm = () => {
    document.getElementById("reviewForm").classList.add("hidden");
    document.querySelector(".module__backdrop").remove();
    document.body.style.overflow = '';
};

const updateStars = (form, rating) => {
    form.querySelectorAll(".movie-form__star").forEach(star => {
        star.classList.toggle("filled", parseInt(star.dataset.rating) <= rating);
    });
}

const refreshReviews = async (movie) => {
    let getReviewsResponse = await fetch(`../routes/reviewRoute.php?action=getMovieReviews&movie_id=${movie.id}`);
    let reviewData = await getReviewsResponse.json();

    if (document.querySelector(".movie-reviews")) {
        document.querySelector(".movie-reviews").remove();
    }

    document.querySelector(".movie-container").appendChild(Reviews(reviewData));
};