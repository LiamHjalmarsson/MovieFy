<?php

namespace MoviesController;
require_once "../models/MoviesModel.php";

use Movies\Movies;
use PDOException;

class MoviesController
{
    public static function getMovieStatus($pdo)
    {
        $user_id = $_SESSION['user_id'];
        $movie_id = $_GET['movie_id'];

        try {
            $status = Movies::getUserMovieStatus($pdo, $user_id, $movie_id);
            sendJSON($status);
        } catch (PDOException $e) {
            sendJSON(["error" => $e->getMessage()], 500);
        }
    }

    public static function addUserMovie($pdo)
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $user_id = $_SESSION['user_id'];

        $movie_id  = $data['movie_id'];
        $status  = $data['status'];

        try {
            
            $errors = [];
            
            if (!$user_id) {
                $errors["user"] = "Invalid user Id";
            }
            
            if (empty($status) || empty($movie_id)) {
                $errors["status"] = "Problem adding movieId";
            }
            
            if ($errors) {
                sendJSON($errors, 400);
            }
            
            $results = Movies::updateMovieStatus($pdo, $user_id, $movie_id, $status);
            
            sendJSON(["success" => "have been added!"]);
        } catch (PDOException $e) {
            sendJSON(["error" => $e->getMessage()], 500);
        }
    }

    public static function deleteUserMovie($pdo)
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $user_id = $_SESSION['user_id'];
        $movie_id = $data['movie_id'];
        $status = $data['status'];

        try {
            $errors = [];
            
            if (!$user_id) {
                $errors["user"] = "Invalid user Id";
            }
            
            if (empty($status) || empty($movie_id)) {
                $errors["status"] = "Problem with status or movieId";
            }
            
            if (empty($status) || empty($movie_id)) {
                $errors["status"] = "Problem adding movieId";
            }
            
            if ($errors) {
                sendJSON($errors, 400);
            }
            
            $results = Movies::deleteMovieStatus($pdo, $user_id, $movie_id, $status);

            sendJSON(["success" => "Movie have been removed successfully"]);
        } catch (PDOException $e) {
            sendJSON(["error" => $e->getMessage()], 500);
        }
    }
}
