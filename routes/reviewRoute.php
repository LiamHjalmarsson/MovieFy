<?php

require_once "../config/database.php";
require_once "../controllers/ReviewController.php";
require_once "../utils/sendJson.php";
require_once "../config/config_session.php";

header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Origin: *');

use ReviewController\ReviewController;

switch ($_GET['action']) {
    case "addReview":
        ReviewController::addMovieReview($pdo);
        break;
    case "updateReview":
        ReviewController::updateMovieReview($pdo);
        break;
    case "getMovieReviews":
        ReviewController::movieReviews($pdo);
        break;
    case "getUserReviews":
        ReviewController::userReviews($pdo);
        break;
    case "getUserReview":
        ReviewController::userReview($pdo);
        break;
    default:
        sendJSON(["error" => ["error" => "Invalid route"]]);
        break;
}
