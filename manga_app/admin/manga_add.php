<?php
session_start();
require("../config/db.php");

// 🔐 controllo admin
if (!isset($_SESSION['ruolo']) || $_SESSION['ruolo'] != 'admin') {
    header("Location: ../index.php");
    exit();
}

// 📚 recupero generi
$generi = $conn->query("SELECT * FROM generi");

// ➕ inserimento manga
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $titolo = $conn->real_escape_string($_POST['titolo']);
    $autore = $conn->real_escape_string($_POST['autore']);
    $descrizione = $conn->real_escape_string($_POST['descrizione']);
    $anno = $_POST['anno'];
    $stato = $_POST['stato'];

    // 🖼️ upload immagine
    $imgName = "";

    if (!empty($_FILES['immagine']['name'])) {
        $tmp = $_FILES['immagine']['tmp_name'];
        $imgName = time() . "_" . basename($_FILES['immagine']['name']);
        move_uploaded_file($tmp, "../assets/img/covers/" . $imgName);
    }

    // 💾 inserimento manga
    $conn->query("
        INSERT INTO manga (titolo, autore, descrizione, anno, stato, immagine)
        VALUES ('$titolo', '$autore', '$descrizione', '$anno', '$stato', '$imgName')
    ");

    $manga_id = $conn->insert_id;

    // 🔗 generi
    if (!empty($_POST['generi'])) {
        foreach ($_POST['generi'] as $g) {
            $conn->query("
                INSERT INTO manga_generi (id_manga, id_genere)
                VALUES ($manga_id, $g)
            ");
        }
    }

    header("Location: dashboard.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Aggiungi Manga</title>

    <!-- CSS semplice e sicuro -->
    <link rel="stylesheet" href="../assets/css/manga_add.css">
</head>
<body>

<div class="container">

    <h2>➕ Aggiungi Manga</h2>

    <form method="POST" enctype="multipart/form-data">

        <input type="text" name="titolo" placeholder="Titolo" required>

        <input type="text" name="autore" placeholder="Autore">

        <textarea name="descrizione" placeholder="Descrizione"></textarea>

        <input type="number" name="anno" placeholder="Anno di uscita">

        <select name="stato">
            <option value="In corso">In corso</option>
            <option value="Completato">Completato</option>
            <option value="In pausa">In pausa</option>
        </select>

        <h3>📚 Generi</h3>

        <div class="generi">
            <?php while($g = $generi->fetch_assoc()): ?>
                <label>
                    <input type="checkbox" name="generi[]" value="<?php echo $g['id']; ?>">
                    <?php echo $g['nome']; ?>
                </label>
            <?php endwhile; ?>
        </div>

        <br>

        <input type="file" name="immagine">

        <button type="submit">💾 Salva Manga</button>

    </form>

    <a href="dashboard.php">⬅ Torna alla Dashboard</a>

</div>

</body>
</html>