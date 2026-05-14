<?php
session_start();
require("config/db.php");

// 📚 manga
$result = $conn->query("SELECT * FROM manga ORDER BY id DESC");

if (!$result) {
    die("Errore query: " . $conn->error);
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manga Library</title>

    <link rel="stylesheet" href="assets/css/base.css">
    <link rel="stylesheet" href="assets/css/index.css">
</head>
<body>

<!-- HEADER -->
<header class="main-header">

    <!-- LOGO -->
    <h1 class="logo-title">
        <img src="assets/img/logo.png" alt="Manga Library Logo">
    </h1>

    <h2>BENVENUTO NELLA TUA LIBRERIA DIGITALE!</h2>

    <!-- DESTRA HEADER -->
    <div class="header-right">

        <?php if(isset($_SESSION['username'])): ?>

            <span class="welcome-text">
                👋 <?php echo $_SESSION['username']; ?>
            </span>

            <!-- LOGOUT -->
            <a class="header-btn" href="logout.php">
                Logout
            </a>

            <!-- MENU -->
            <div class="menu-container">

                <button class="menu-toggle" onclick="toggleMenu()">
                    ☰
                </button>

                <div class="dropdown-menu" id="dropdownMenu">

                    <a href="profile.php">
                        👤 Profilo
                    </a>

                    <a href="my_reviews.php">
                        ⭐ Le mie recensioni
                    </a>

                    <a href="favorites.php">
                        ❤️ Preferiti
                    </a>

                    <?php if(isset($_SESSION['ruolo']) && $_SESSION['ruolo'] == 'admin'): ?>

                        <a href="admin/dashboard.php">
                            🛠️ Dashboard Admin
                        </a>

                    <?php endif; ?>

                    <a href="logout.php">
                        🚪 Logout
                    </a>

                </div>

            </div>

        <?php else: ?>

            <a class="header-btn" href="login.php">
                Login
            </a>

            <a class="header-btn" href="register.php">
                Registrati
            </a>

        <?php endif; ?>

    </div>

</header>

<!-- ADMIN BAR -->
<?php if(isset($_SESSION['ruolo']) && $_SESSION['ruolo'] == 'admin'): ?>

    <div class="admin-bar">

        <a href="admin/dashboard.php">
            🛠️ Pannello Admin
        </a>

    </div>

<?php endif; ?>

<!-- LISTA MANGA -->
<div class="manga-list">

<?php while($row = $result->fetch_assoc()): ?>

    <?php
        $manga_id = $row['id'];

        // 📚 generi
        $genResult = $conn->query("
            SELECT generi.nome
            FROM manga_generi
            JOIN generi ON manga_generi.id_genere = generi.id
            WHERE manga_generi.id_manga = $manga_id
        ");

        // ⭐ rating
        $rating = $conn->query("
            SELECT AVG(voto) AS media, COUNT(*) AS totale
            FROM recensioni
            WHERE id_manga = $manga_id
        ")->fetch_assoc();

        $media = round($rating['media'], 1);
        $totale = $rating['totale'];

        $stellePiene = floor($media);
        $mezzaStella = ($media - $stellePiene) >= 0.5;

        // ❤️ preferiti
        $preferito = false;

        if(isset($_SESSION['id'])) {

            $id_utente = $_SESSION['id'];

            $prefCheck = $conn->query("
                SELECT *
                FROM preferiti
                WHERE id_utente = $id_utente
                AND id_manga = $manga_id
            ");

            $preferito = $prefCheck->num_rows > 0;
        }
    ?>

    <!-- LINK MANGA -->
    <a class="manga-link" href="manga.php?id=<?php echo $row['id']; ?>">

        <div class="manga-item">

            <!-- COVER -->
            <img class="manga-img"
                 src="assets/img/covers/<?php echo !empty($row['immagine']) ? $row['immagine'] : 'no-image.png'; ?>">

            <!-- INFO -->
            <div class="manga-info">

                <h3><?php echo $row['titolo']; ?></h3>

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

                <!-- GENERI -->
                <div class="generi-container">

                    <?php while($g = $genResult->fetch_assoc()): ?>

                        <span class="genere-tag">
                            <?php echo $g['nome']; ?>
                        </span>

                    <?php endwhile; ?>

                </div>

                <!-- ❤️ PREFERITI -->
                <?php if(isset($_SESSION['id'])): ?>

                    <div class="favorite-box">

                        <a class="favorite-btn"
                           href="favorite_toggle.php?id=<?php echo $row['id']; ?>">

                            <?php if($preferito): ?>
                                ❤️ Rimuovi dai preferiti
                            <?php else: ?>
                                🤍 Aggiungi ai preferiti
                            <?php endif; ?>

                        </a>

                    </div>

                <?php endif; ?>

                <!-- ⭐ RATING -->
                <div class="rating-mini">

                    <?php if($totale > 0): ?>

                        <span class="stars">

                            <?php for($i = 0; $i < 5; $i++): ?>

                                <?php if($i < $stellePiene): ?>
                                    ⭐
                                <?php elseif($i == $stellePiene && $mezzaStella): ?>
                                    ✨
                                <?php else: ?>
                                    ☆
                                <?php endif; ?>

                            <?php endfor; ?>

                        </span>

                        <span class="rating-text">
                            <?php echo $media; ?> (<?php echo $totale; ?>)
                        </span>

                    <?php else: ?>

                        <span class="rating-text">
                            Nessuna recensione
                        </span>

                    <?php endif; ?>

                </div>

            </div>

        </div>

    </a>

<?php endwhile; ?>

</div>

<!-- MENU SCRIPT -->
<script>

function toggleMenu() {

    const menu = document.getElementById("dropdownMenu");

    if(menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

// chiusura cliccando fuori
window.onclick = function(event) {

    if (!event.target.matches('.menu-toggle')) {

        const dropdown = document.getElementById("dropdownMenu");

        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    }
}

</script>

</body>
</html>