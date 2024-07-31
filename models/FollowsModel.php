<?php

namespace Follows;

class Follows
{
    public static function getFollowing(object $pdo, $userId)
    {
        $query = "SELECT * FROM follows WHERE user_id = :user_id;";

        $statement = $pdo->prepare($query);
        $statement->bindParam(":user_id", $userId);
        $statement->execute();

        $result = $statement->fetchAll();
        return $result;
    }

    // POST 
    public static function followUser(object $pdo, $userId, $followedUserId)
    {
        $query = "INSERT INTO follows (user_id, followed_user) VALUES (:user_id, :followed_user);";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->bindParam(':followed_user', $followedUserId);
        return $statement->execute();
    }

    // DELETE 
    public static function unfollowUser(object $pdo, $userId, $followedUserId)
    {
        $query = "DELETE FROM follows WHERE user_id = :user_id AND followed_user = :followed_user ;";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->bindParam(':followed_user', $followedUserId);
        return $statement->execute();
    }
    
    public static function isUserFollowed(object $pdo, $userId, $followedUserId)
    {
        $query = "SELECT COUNT(*) FROM follows WHERE user_id = :user_id AND followed_user = :followed_user;";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->bindParam(':followed_user', $followedUserId);
        $statement->execute();

        return $statement->fetchColumn() > 0;
    }

    public static function getFollowersCount(object $pdo, $userId)
    {
        $query = "SELECT COUNT(*) FROM follows WHERE followed_user = :user_id;";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->execute();

        return $statement->fetchColumn();
    }

    public static function getFollowingCount(object $pdo, $userId)
    {
        $query = "SELECT COUNT(*) FROM follows WHERE user_id = :user_id;";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->execute();

        return $statement->fetchColumn();
    }
}
