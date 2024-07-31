<?php
namespace AuthController;

require_once "../models/UserModel.php";
require_once "../config/config_session.php";
require_once "../models/FollowsModel.php";
require_once "../models/MoviesModel.php";

use Follows\Follows;
use Movies\Movies;
use PDOException;
use User\User;

class AuthController
{
    public static function register($pdo)
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $username = $data["username"];
        $pwd = $data["pwd"];
        $email = $data["email"];

        try {
            $errors = [];

            if (empty($username) || empty($pwd) || empty($email)) {
                $errors["empty_input"] = "Fill in all fields!";
            }

            if (User::getUsername($pdo, $username)) {
                $errors["username_taken"] = "Username already taken.";
            }

            if (User::getEmail($pdo, $email)) {
                $errors["email_taken"] = "Email already taken.";
            }

            if ($errors) {
                sendJSON(["error" => $errors], 400);
            }

            User::createUser($pdo, $username, $email, $pwd);

            $pdo = null;
            $statement = null;

            sendJSON(["success" => "User created successfully"]);
        } catch (PDOException $e) {
            sendJSON(["errors" => $e->getMessage()]);
        }
    }

    public static function login($pdo)
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $username = $data["username"];
        $pwd = $data["pwd"];

        try {
            $errors = [];

            if (empty($username) || empty($pwd)) {
                $errors["empty_input"] = "Fill in all fields!";
            }

            $user = User::getUser($pdo, $username);

            if (!$user) {
                $errors["login_incorrect"] = "Incorrect login information";
            }

            if ($user && !password_verify($pwd, $user["pwd"])) {
                $errors["login_incorrect"] = "Incorrect login information";
            }

            if ($errors) {
                sendJSON(["error" => $errors], 400);
            }

            $token = bin2hex(random_bytes(16));

            $_SESSION["user_id"] = $user["id"];
            $_SESSION["token"] = $token;
            $_SESSION["last_regeneration"] = time();

            $user['followers_count'] = Follows::getFollowersCount($pdo, $user["id"]);
            $user['following_count'] = Follows::getFollowingCount($pdo, $user["id"]);
            $user["watched_movies"] = Movies::getUserWatched($pdo, $user["id"]);

            $pdo = null;

            unset($user["pwd"]);

            sendJSON([
                "success" => $username . " logged in",
                "token" => $token,
                "user" => $user
            ]);
        } catch (PDOException $e) {
            sendJSON(["errors" => $e->getMessage()]);
        }
    }

    public static function logout()
    {
        // session_start();
        session_unset();
        session_destroy();

        sendJSON(["success" => "logged out"]);
    }
}
