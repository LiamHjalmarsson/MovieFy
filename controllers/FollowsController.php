<?php

namespace FollowController;

require_once "../models/UserModel.php";
require_once "../models/FollowsModel.php";

use PDOException;
use Follows\Follows;

class FollowController
{
    public static function follow($pdo)
    {
        $followed_userId  = $_GET['followed_user'];
        $user_id = $_SESSION['user_id'];

        try {
            if (!$followed_userId || !$user_id) {
                sendJSON(["error" => "Invalid user ID or session"], 400);
            }

            $result = Follows::followUser($pdo, $user_id, $followed_userId);
            $message = "Followed successfully";

            sendJSON(["success" => $message]);
        } catch (PDOException $e) {
            sendJSON(["errors" => $e->getMessage()], 500);
        }
    }

    public static function unfollow($pdo)
    {
        $followed_userId  = $_GET['followed_user'];
        $user_id = $_SESSION['user_id'];

        try {
            if (!$followed_userId || !$user_id) {
                sendJSON(["error" => "Invalid user ID or session"], 400);
            }

            $result = Follows::unfollowUser($pdo, $user_id, $followed_userId);

            sendJSON(["success" => "Unfollowed"]);
        } catch (PDOException $e) {
            sendJSON(["errors" => $e->getMessage()], 500);
        }
    }

    public static function getFollowing($pdo)
    {
        $user_id = $_SESSION['user_id'];

        try {

            $following = Follows::getFollowing($pdo, $user_id);

            sendJSON($following);
        } catch (PDOException $e) {
            sendJSON(["error" => $e->getMessage()], 500);
        }
    }
}