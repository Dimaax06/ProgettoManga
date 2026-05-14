<?php
session_start();
require("config/db.php");

if(!isset($_SESSION['id'])){
    header("Location: login.php");
    exit();
}

$id = $_SESSION['id'];

$user = $conn->query("
    SELECT *
    FROM utenti
    WHERE id = $id
")->fetch_assoc();

$reviews = $conn->query("
    SELECT COUNT(*) AS totale
    FROM recensioni
    WHERE id_utente = $id
")->fetch_assoc();

$favorites = $conn->query("
    SELECT COUNT(*) AS totale
    FROM preferiti
    WHERE id_utente = $id
")->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="it">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Profilo</title>

<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/profile.css">

</head>
<body>

<div class="profile-container">

    <div class="profile-card">

        <div class="profile-top">

            <div class="avatar">
                👤
            </div>

            <div>

                <h1>
                    <?php echo $user['username']; ?>
                </h1>

                <p class="role">
                    <?php echo strtoupper($user['ruolo']); ?>
                </p>

            </div>

        </div>

        <div class="stats">

            <div class="stat-box">
                <h2><?php echo $reviews['totale']; ?></h2>
                <p>Recensioni</p>
            </div>

            <div class="stat-box">
                <h2><?php echo $favorites['totale']; ?></h2>
                <p>Preferiti</p>
            </div>

        </div>

        <div class="profile-buttons">

            <a href="my_reviews.php">
                ⭐ Le mie recensioni
            </a>

            <a href="favorites.php">
                ❤️ Preferiti
            </a>

            <a href="logout.php">
                🚪 Logout
            </a>

        </div>

    </div>

</div>

</body>
</html>