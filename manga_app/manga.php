<?php
session_start();
require("config/db.php");

// 🔍 controllo ID manga
if (!isset($_GET['id'])) {
    die("Manga non trovato.");
}

$id = (int) $_GET['id'];

// 📚 recupero manga
$query = "SELECT * FROM manga WHERE id = $id";
$result = $conn->query($query);

if ($result->num_rows == 0) {
    die("Manga inesistente.");
}

$manga = $result->fetch_assoc();

// 📂 recupero generi
$genQuery = "
    SELECT generi.nome
    FROM manga_generi
    JOIN generi
    ON manga_generi.id_genere = generi.id
    WHERE manga_generi.id_manga = $id
";

$generi = $conn->query($genQuery);

// ⭐ media voti
$ratingQuery = "
    SELECT AVG(voto) AS media, COUNT(*) AS totale
    FROM recensioni
    WHERE id_manga = $id
";

$ratingResult = $conn->query($ratingQuery);
$rating = $ratingResult->fetch_assoc();

$media = round($rating['media'], 1);
$totale = $rating['totale'];

// 💬 recensioni
$reviewQuery = "
    SELECT recensioni.*, utenti.username
    FROM recensioni
    JOIN utenti
    ON recensioni.id_utente = utenti.id
    WHERE recensioni.id_manga = $id
    ORDER BY recensioni.data_recensione DESC
";

$reviews = $conn->query($reviewQuery);

// ✍️ inserimento recensione
$errore = "";

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_SESSION['id'])) {

    $idUtente = $_SESSION['id'];

    $voto = (int) $_POST['voto'];

    $commento = $conn->real_escape_string($_POST['commento']);

    // 🔒 controllo recensione già esistente
    $check = $conn->query("
        SELECT * FROM recensioni
        WHERE id_utente = $idUtente
        AND id_manga = $id
    ");

    if ($check->num_rows > 0) {

        $errore = "Hai già recensito questo manga.";

    } else {

        $conn->query("
            INSERT INTO recensioni
            (id_utente, id_manga, voto, commento)
            VALUES
            ($idUtente, $id, $voto, '$commento')
        ");

        header("Location: manga.php?id=$id");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $manga['titolo']; ?></title>

    <link rel="stylesheet" href="assets/css/base.css">
    <link rel="stylesheet" href="assets/css/manga.css">
</head>
<body>

<!-- HEADER -->
<header class="main-header">

    <h1 class="logo-title">
        <img src="assets/img/logo.png" alt="Manga Library Logo">
    </h1>

    <div class="header-right">

        <a class="header-btn" href="index.php">
            ⬅ Home
        </a>

    </div>

</header>

<!-- PAGINA MANGA -->
<div class="manga-page">

    <!-- COVER -->
    <div class="manga-cover-big">

        <?php if(!empty($manga['immagine'])): ?>

            <img src="assets/img/covers/<?php echo $manga['immagine']; ?>">

        <?php else: ?>

            <img src="assets/img/no-image.png">

        <?php endif; ?>

    </div>

    <!-- INFO -->
    <div class="manga-details">

        <h1><?php echo $manga['titolo']; ?></h1>

        <p>
            <strong>Autore:</strong>
            <?php echo $manga['autore']; ?>
        </p>

        <p>
            <strong>Anno:</strong>
            <?php echo $manga['anno']; ?>
        </p>

        <p>
            <strong>Stato:</strong>
            <?php echo $manga['stato']; ?>
        </p>

        <!-- GENERI -->
        <div class="generi-container">

            <?php while($g = $generi->fetch_assoc()): ?>

                <span class="genere-tag">
                    <?php echo $g['nome']; ?>
                </span>

            <?php endwhile; ?>

        </div>

        <!-- DESCRIZIONE -->
        <div class="descrizione-box">

            <h3>📖 Descrizione</h3>

            <p>
                <?php echo nl2br($manga['descrizione']); ?>
            </p>

        </div>

        <!-- RATING -->
        <div class="rating-box">

            <h3>⭐ Valutazione</h3>

            <p>
                <?php echo $media ? $media : "Nessun voto"; ?>

                <?php if($totale > 0): ?>
                    / 5 (<?php echo $totale; ?> recensioni)
                <?php endif; ?>
            </p>

        </div>

    </div>

</div>

<!-- FORM RECENSIONE -->
<?php if(isset($_SESSION['id'])): ?>

<div class="review-form-container">

    <h2>✍️ Lascia una recensione</h2>

    <?php if($errore): ?>
        <p class="errore"><?php echo $errore; ?></p>
    <?php endif; ?>

    <form method="POST">

        <select name="voto" required>
            <option value="">Seleziona voto</option>

            <option value="1">⭐ 1</option>
            <option value="2">⭐⭐ 2</option>
            <option value="3">⭐⭐⭐ 3</option>
            <option value="4">⭐⭐⭐⭐ 4</option>
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
        </select>

        <textarea
            name="commento"
            placeholder="Scrivi una recensione..."
            required
        ></textarea>

        <button type="submit">
            Invia recensione
        </button>

    </form>

</div>

<?php else: ?>

<div class="login-warning">

    <p>
        Devi effettuare il login per recensire questo manga.
    </p>

</div>

<?php endif; ?>

<!-- RECENSIONI -->
<div class="reviews-section">

    <h2>💬 Recensioni utenti</h2>

    <?php if($reviews->num_rows > 0): ?>

        <?php while($review = $reviews->fetch_assoc()): ?>

            <div class="review-card">

                <div class="review-top">

                    <strong>
                        <?php echo $review['username']; ?>
                    </strong>

                    <span>
                        <?php echo str_repeat("⭐", $review['voto']); ?>
                    </span>

                </div>

                <p>
                    <?php echo nl2br($review['commento']); ?>
                </p>

            </div>

        <?php endwhile; ?>

    <?php else: ?>

        <p>Nessuna recensione presente.</p>

    <?php endif; ?>

</div>

</body>
</html>