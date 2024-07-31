<?php
require_once "../utils/sendJson.php";
require_once "../controllers/AuthController.php";
require_once "../config/config_session.php";
require_once "../config/database.php";

header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Origin: *');

use AuthController\AuthController;

switch ($_GET['action']) {
    case "register":
        AuthController::register($pdo);
        break;
    case "login":
        AuthController::login($pdo);
        break;
    case "logout":
        AuthController::logout($pdo);
        break;
    default:
        sendJSON(["error" => ["error" => "Invalid route"]]);
        break;
}
