<?php

namespace Movies;

class Movies
{
    // GET
    public static function getUserMovieStatus(object $pdo, $userId, $movieId)
    {
        $statuses = [];

        // Check watched
        $query = "SELECT COUNT(*) FROM watched_movies WHERE user_id = :user_id AND movie_id = :movie_id";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->bindParam(':movie_id', $movieId);
        $statement->execute();
        if ($statement->fetchColumn() > 0) {
            $statuses[] = 'watched';
        }
    
        // Check watch_later
        $query = "SELECT COUNT(*) FROM watch_later_movies WHERE user_id = :user_id AND movie_id = :movie_id";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->bindParam(':movie_id', $movieId);
        $statement->execute();
        if ($statement->fetchColumn() > 0) {
            $statuses[] = 'watch_later';
        }
    
        // Check recommended
        $query = "SELECT COUNT(*) FROM recommended_movies WHERE user_id = :user_id AND movie_id = :movie_id";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->bindParam(':movie_id', $movieId);
        $statement->execute();
        if ($statement->fetchColumn() > 0) {
            $statuses[] = 'recommended';
        }
    
        return $statuses;
    }

    public static function getUserWatched(object $pdo, $userId)
    {
        $query = "SELECT movie_id FROM watch_later_movies WHERE user_id = :user_id;";

        $statement = $pdo->prepare($query);
        $statement->bindParam(":user_id", $userId);
        $statement->execute();

        $result = $statement->fetchAll();
        return $result;
    }
    
    // CREATE
    public static function updateMovieStatus(object $pdo, $userId, $movieId, $status)
    {
        $table = "";

        switch ($status) {
            case "watched":
                $table = "watched_movies";
                break;
            case "watch_later":
                $table = "watch_later_movies";
                break;
            case "recommended":
                $table = "recommended_movies";
                break;
        }

        $query = "INSERT INTO $table (user_id, movie_id)
            VALUES (:user_id, :movie_id)
                ON DUPLICATE KEY UPDATE movie_id = VALUES(movie_id)";

        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->bindParam(':movie_id', $movieId);

        return $statement->execute();
    }

    public static function deleteMovieStatus(object $pdo, $userId, $movieId, $status)
    {
        $table = "";

        switch ($status) {
            case "watched":
                $table = "watched_movies";
                break;
            case "watch_later":
                $table = "watch_later_movies";
                break;
            case "recommended":
                $table = "recommended_movies";
                break;
        }

        $query = "DELETE FROM $table WHERE user_id = :user_id AND movie_id = :movie_id";

        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $userId);
        $statement->bindParam(':movie_id', $movieId);

        return $statement->execute();
    }
}
