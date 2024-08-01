<?php

namespace ReviewController;

require_once "../models/ReviewModel.php";

use PDOException;
use Review\Review;
use User\User;

class ReviewController
{
    public static function addMovieReview($pdo)
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $review = $data['review'];
        $movie_id = $data['movie_id'];
        $rating = $data['rating'];
        $user_id = $_SESSION['user_id'];

        try {

            $errors = [];

            if (!$user_id) {
                $errors["user"] = "User must be logged in";
            }

            if (!$movie_id) {
                $errors["movie_id"] = "Invalid movie ID";
            }

            if (empty($review)) {
                $errors["review"] = "Review cannot be empty";
            }

            if (!$rating || $rating < 1 || $rating > 5) {
                $errors["rating"] = "Rating must be between 1 and 5";
            }

            if ($errors) {
                sendJSON(["error" => $errors], 400);
            }

            Review::addReview($pdo, $user_id, $movie_id, $review, $rating);

            sendJSON(["success" => "Review posted"]);
        } catch (PDOException $e) {
            sendJSON(["error" => $e->getMessage()], 500);
        }
    }

    public static function updateMovieReview($pdo)
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $review = $data['review'];
        $movie_id = $data['movie_id'];
        $rating = $data['rating'];
        $user_id = $_SESSION['user_id'];
        $id = $data['review_id'];

        Review::updateReview($pdo, $user_id, $movie_id, $review, $rating, $id);

        sendJSON(["success" => "Review updated"]);
    }

    public static function movieReviews($pdo)
    {
        $movie_id = $_GET['movie_id'];

        $result = Review::getMovieReviews($pdo, $movie_id);

        sendJSON($result);
        try {
        } catch (PDOException $e) {
            sendJSON(["error" => $e->getMessage()], 500);
        }
    }

    public static function userReviews($pdo)
    {
        $user_id = $_SESSION['user_id'];

        try {
            sendJSON(["success" => "win"]);
        } catch (PDOException $e) {
            sendJSON(["error" => $e->getMessage()], 500);
        }
    }

    public static function userReview($pdo)
    {
        $user_id = $_SESSION['user_id'];
        $movie_id = $_GET["movie_id"];

        try {
            $result = Review::getUserReview($pdo, $user_id, $movie_id);

            sendJSON($result);
        } catch (PDOException $e) {
            sendJSON(["error" => $e->getMessage()], 500);
        }
    }
}
