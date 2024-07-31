<?php

namespace User;

class User
{
    // RETRIEVER
    public static function getUsername(object $pdo, string $username)
    {
        $query = "SELECT username FROM users WHERE username = :username;";

        $statement = $pdo->prepare($query);
        $statement->bindParam(":username", $username);
        $statement->execute();

        $result = $statement->fetch(\PDO::FETCH_ASSOC);
        return $result;
    }

    public static function getEmail(object $pdo, string $email)
    {
        $query = "SELECT username FROM users WHERE email = :email;";

        $statement = $pdo->prepare($query);
        $statement->bindParam(":email", $email);
        $statement->execute();

        $result = $statement->fetch(\PDO::FETCH_ASSOC);

        return $result;
    }

    public static function getUser(object $pdo, string $username)
    {
        $query = "SELECT * FROM users WHERE username = :username ;";

        $statement = $pdo->prepare($query);
        $statement->bindParam(":username", $username);
        $statement->execute();

        $result = $statement->fetch(\PDO::FETCH_ASSOC);

        return $result;
    }

    public static function getAllUsers(object $pdo)
    {
        $query = "SELECT * FROM users;";

        $statement = $pdo->prepare($query);
        $statement->execute();

        $result = $statement->fetchAll(\PDO::FETCH_ASSOC);

        unset($result["pwd"]);

        return $result;
    }

    public static function getUserById(object $pdo, $userId)
    {
        $query = "SELECT * FROM users WHERE id = :id";
        $statement = $pdo->prepare($query);
        $statement->bindParam(":id", $userId);
        $statement->execute();

        $result = $statement->fetch(\PDO::FETCH_ASSOC);

        return $result;
    }

    // ADD
    public static function createUser(object $pdo, string $username, string $email, string $pwd)
    {
        $query = "INSERT INTO users (username, email, pwd) VALUES (:username, :email, :pwd)";

        $statement = $pdo->prepare($query);

        $options = [
            "cost" => 12
        ];

        $hashedPwd = password_hash($pwd, PASSWORD_BCRYPT, $options);

        $statement->bindParam(":username", $username);
        $statement->bindParam(":email", $email);
        $statement->bindParam(":pwd", $hashedPwd);
        $statement->execute();
    }

    // UPDATE
    public static function updateUserAvatar(object $pdo, $userId, $avatar)
    {
        $query = "UPDATE users SET avatar = :avatar WHERE id = :id";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':avatar', $avatar);
        $statement->bindParam(':id', $userId);
        $statement->execute();
    }

    public static function updateUserWithPassword(object $pdo, $userId, $username, $email, $password)
    {
        $query = "UPDATE users SET username = :username, email = :email, pwd = :pwd WHERE id = :id";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':username', $username);
        $statement->bindParam(':email', $email);
        $statement->bindParam(':pwd', $password);
        $statement->bindParam(':id', $userId);
        $statement->execute();
    }

    public static function updateUserWithoutPassword(object $pdo, $userId, $username, $email)
    {
        $query = "UPDATE users SET username = :username, email = :email WHERE id = :id";
        $statement = $pdo->prepare($query);
        $statement->bindParam(':username', $username);
        $statement->bindParam(':email', $email);
        $statement->bindParam(':id', $userId);
        $statement->execute();
    }
}
