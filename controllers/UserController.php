<?php

namespace UserController;

require_once "../models/UserModel.php";
require_once "../models/FollowsModel.php";
require_once "../models/MoviesModel.php";

use PDOException;
use User\User;
use Follows\Follows;
use Movies\Movies;

class UserController
{
    public static function getUser($pdo)
    {
        $userId = $_GET['id'];
        $sessionId = $_SESSION['user_id'];

        try {
            $errors = [];

            if (empty($userId)) {
                $errors["user_id_missing"] = "User ID is missing.";
            }

            if ($errors) {
                sendJSON(["error" => $errors], 400);
            }

            $user = User::getUserById($pdo, $userId);

            if ($user) {
                $user['isFollowed'] = Follows::isUserFollowed($pdo, $sessionId, $userId);
                $user['followers_count'] = Follows::getFollowersCount($pdo, $userId);
                $user['following_count'] = Follows::getFollowingCount($pdo, $userId);
                $user["watched_movies"] = Movies::getUserWatched($pdo, $userId);
                $user["liked_movies"] = Movies::getUserLiked($pdo, $userId);

                sendJSON($user);
            } else {
                sendJSON(["error" => "User not found"], 404);
            }
        } catch (PDOException $e) {
            sendJSON(["errors" => $e->getMessage()], 500);
        }
    }

    public static function getUsers($pdo)
    {
        $users = User::getAllUsers($pdo);
        sendJSON($users);
    }

    public static function updateAvatar($pdo)
    {
        $userId = (int)$_GET['id'];
        $user_id = $_SESSION['user_id'];

        try {
            $errors = [];

            if (empty($userId)) {
                $errors["user_id_missing"] = "User ID is missing.";
            }

            if ($userId !== $user_id) {
                $errors["user__not__valid"] = "Not vaild id";
            }

            // Check if a file is uploaded
            if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
                $errors["avatar_upload"] = "Failed to upload avatar.";
            }

            if ($errors) {
                sendJSON(["error" => $errors], 400);
            }

            $uploadDir = '../uploads/avatars/';
            $uploadFile = $uploadDir . basename($_FILES['avatar']['name']);

            // Ensure the directory exists and is writable
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Move the uploaded file
            if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadFile)) {
                // Fetch user details to check for existing avatar
                $user = User::getUserById($pdo, $userId);
                $oldAvatar = $user['avatar']; // Assuming 'avatar' is the field storing the image path

                // If there's an old avatar, remove it
                if ($oldAvatar && file_exists($oldAvatar)) {
                    unlink($oldAvatar);
                }

                // Update the user's avatar path in the database
                User::updateUserAvatar($pdo, $userId, $uploadFile);
                $updatedUser = User::getUserById($pdo, $userId);

                sendJSON(["user" => $updatedUser]);
            } else {
                sendJSON(["error" => "Failed to upload avatar"], 400);
            }
        } catch (PDOException $e) {
            sendJSON(["errors" => $e->getMessage()]);
        }
    }

    public static function updateUser($pdo)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $userId = (int)$_GET['id'];
        $user_id = $_SESSION['user_id'];

        try {
            if (empty($userId)) {
                sendJSON(["error" => "User ID is required"], 400);
            }

            if ($userId !== $user_id) {
                sendJSON(["error" => "Not vaild id"], 400);
            }

            $username = $data['username'];
            $email = $data['email'];
            $password = $data['password'];
            
            if (!empty($password)) {
                $options = [
                    "cost" => 12
                ];

                $hashedPwd = password_hash($password, PASSWORD_BCRYPT, $options);
                User::updateUserWithPassword($pdo, $userId, $username, $email, $hashedPwd);
            } else {
                User::updateUserWithoutPassword($pdo, $userId, $username, $email);
            }

            sendJSON(["success" => "Updated user", "user" => $user]);
        } catch (PDOException $e) {
            sendJSON(["errors" => $e->getMessage()], 500);
        }
    }
}
