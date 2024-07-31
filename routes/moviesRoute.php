<?php
require_once "../utils/sendJson.php";
require_once "../config/config_session.php";
require_once "../config/database.php";
require_once "../controllers/MoviesController.php";

header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Origin: *');

use MoviesController\MoviesController;

switch ($_GET['action']) {
    case "addUserMovie":
        MoviesController::addUserMovieStatus($pdo);
        break;
    case "removeUserMovie":
        MoviesController::deleteUserMovieStatus($pdo);
        break;
    case "getMovieStatus":
        MoviesController::getMovieStatus($pdo);
        break;
    default:
        sendJSON(["error" => ["error" => "Invalid route"]]);
        break;
}
