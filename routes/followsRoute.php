<?php
require_once "../utils/sendJson.php";
require_once "../config/config_session.php";
require_once "../controllers/FollowsController.php";
require_once "../config/database.php";

header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Origin: *');

use FollowController\FollowController;

switch ($_GET['action']) {
    case "follow":
        FollowController::follow($pdo);
        break;
    case "unfollow":
        FollowController::unfollow($pdo);
    case "userFollowing":
        FollowController::getFollowing($pdo);
        break;
    default:
        sendJSON(["error" => ["error" => "Invalid route"]]);
        break;
}
