<?php

require_once "../config/database.php";
require_once "../utils/sendJson.php";
require_once "../config/config_session.php";
require_once "../controllers/UserController.php";

header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Origin: *');

use UserController\UserController;

switch ($_GET['action']) {
    case "updateAvatar":
        UserController::updateAvatar($pdo);
        break;
    case "updateUser":
        UserController::updateUser($pdo);
        break;
    case "getUser":
        UserController::getUser($pdo);
        break;
    case "getAll":
        UserController::getUsers($pdo);
        break;
    default:
        sendJSON(["error" => ["error" => "Invalid route"]]);
        break;
}
