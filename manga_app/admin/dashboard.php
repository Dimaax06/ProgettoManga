<?php
session_start();
require("../config/db.php");

// 🔒 controllo accesso
if (!isset($_SESSION['id']) || !isset($_SESSION['ruolo'])) {
    header("Location: ../login.php");
    exit();
}

if ($_SESSION['ruolo'] !== 'admin') {
    die("Accesso negato");
}

// 📊 statistiche base
$mangaCount = $conn->query("SELECT COUNT(*) AS tot FROM manga")->fetch_assoc()['tot'];

$userCount = $conn->query("SELECT COUNT(*) AS tot FROM utenti")->fetch_assoc()['tot'];

$reviewCount = $conn->query("SELECT COUNT(*) AS tot FROM recensioni")->fetch_assoc()['tot'];
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard</title>

    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>

<div class="admin-container">

    <!-- HEADER -->
    <h1>🛠️ Dashboard Admin</h1>

    <p>
        👋 Benvenuto,
        <strong><?php echo $_SESSION['username'] ?? 'Admin'; ?></strong>
    </p>

    <a href="../index.php" class="back-btn">🏠 Torna al sito</a>

    <!-- STATISTICHE -->
    <div class="stats">

        <a href="manga_list.php" class="stat-box">
            📚 Manga<br>
            <strong><?php echo $mangaCount; ?></strong>
        </a>

        <a href="users.php" class="stat-box">
            👤 Utenti<br>
            <strong><?php echo $userCount; ?></strong>
        </a>

        <a href="reviews.php" class="stat-box">
            💬 Recensioni<br>
            <strong><?php echo $reviewCount; ?></strong>
        </a>

    </div>

    <!-- MENU ADMIN -->
    <div class="admin-menu">

        <a href="manga_add.php">➕ Aggiungi Manga</a>

        <a href="reviews.php">💬 Gestisci Recensioni</a>

        <a href="manga_list.php">📚 Gestisci Manga</a>

    </div>

</div>

</body>
</html>