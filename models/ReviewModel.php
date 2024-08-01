<?php

namespace Review;

class Review
{
    public static function addReview($pdo, $user_id, $movie_id, $review, $rating)
    {
        $stmt = $pdo->prepare("INSERT INTO reviews (user_id, movie_id, review, rating) VALUES (:user_id, :movie_id, :review, :rating)");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':movie_id', $movie_id);
        $stmt->bindParam(':review', $review);
        $stmt->bindParam(':rating', $rating);

        return $stmt->execute();
    }

    public static function updateReview($pdo, $user_id, $movie_id, $review, $rating, $id)
    {
        $stmt = $pdo->prepare("UPDATE reviews SET review = :review, rating = :rating WHERE id = :id AND movie_id = :movie_id AND user_id = :user_id");
        $stmt->bindParam(':review', $review);
        $stmt->bindParam(':rating', $rating);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':movie_id', $movie_id);
        $stmt->bindParam(':user_id', $user_id);

        return $stmt->execute();
    }
    public static function getMovieReviews($pdo, $movie_id)
    {
        $query = "SELECT reviews.*, users.username, users.avatar 
            FROM reviews 
                JOIN users ON reviews.user_id = users.id 
                    WHERE reviews.movie_id = :movie_id
                        ORDER BY reviews.created_at DESC";

        $statement = $pdo->prepare($query);
        $statement->bindParam(':movie_id', $movie_id);
        $statement->execute();

        $result = $statement->fetchAll(\PDO::FETCH_ASSOC);

        return $result;
    }

    public static function getUserReview(object $pdo, $user_id, $movie_id)
    {
        $query = "SELECT * FROM reviews WHERE user_id = :user_id AND movie_id = :movie_id;";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':user_id', $user_id);
        $statement->bindParam(':movie_id', $movie_id);
        $statement->execute();

        return $statement->fetch(\PDO::FETCH_ASSOC);
    }
}
