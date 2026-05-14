<?php
session_start();
require("config/db.php");

// 🔒 login obbligatorio
if (!isset($_SESSION['id'])) {
    header("Location: login.php");
    exit();
}

$id_utente = $_SESSION['id'];

// query preferiti
$query = "
    SELECT manga.*
    FROM preferiti
    JOIN manga
        ON preferiti.id_manga = manga.id
    WHERE preferiti.id_utente = $id_utente
    ORDER BY preferiti.created_at DESC
";

$result = $conn->query($query);

if(!$result){
    die("Errore query: " . $conn->error);
}
?>

<!DOCTYPE html>
<html lang="it">
<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>I miei preferiti</title>

    <link rel="stylesheet" href="assets/css/base.css">
    <link rel="stylesheet" href="assets/css/index.css">

</head>
<body>

<!-- HEADER -->
<header class="main-header">

    <h1 class="logo-title">
        ❤️ I miei preferiti
    </h1>

    <div class="header-right">

        <a class="header-btn" href="index.php">
            ← Torna Home
        </a>

    </div>

</header>

<!-- LISTA -->
<div class="manga-list">

<?php if($result->num_rows > 0): ?>

    <?php while($row = $result->fetch_assoc()): ?>

        <a class="manga-link"
           href="manga.php?id=<?php echo $row['id']; ?>">

            <div class="manga-item">

                <!-- COVER -->
                <img class="manga-img"
                     src="assets/img/covers/<?php echo !empty($row['immagine']) ? $row['immagine'] : 'no-image.png'; ?>">

                <!-- INFO -->
                <div class="manga-info">

                    <h3>
                        <?php echo $row['titolo']; ?>
                    </h3>

                    <p>
                        <strong>Autore:</strong>
                        <?php echo $row['autore']; ?>
                    </p>

                    <p>
                        <strong>Anno:</strong>
                        <?php echo $row['anno']; ?>
                    </p>

                    <p>
                        <strong>Stato:</strong>
                        <?php echo $row['stato']; ?>
                    </p>

                </div>

            </div>

        </a>

    <?php endwhile; ?>

<?php else: ?>

    <div class="empty-favorites">

        <h2>
            Nessun manga nei preferiti ❤️
        </h2>

        <p>
            Aggiungi manga ai preferiti dalla home.
        </p>

    </div>

<?php endif; ?>

</div>

</body>
</html>