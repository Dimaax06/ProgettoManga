<?php
session_start();
require("../config/db.php");

// 🔐 controllo admin
if (!isset($_SESSION['ruolo']) || $_SESSION['ruolo'] != 'admin') {
    header("Location: ../index.php");
    exit();
}

// 📌 id manga
$id = $_GET['id'];

// 📥 dati manga
$manga = $conn->query("SELECT * FROM manga WHERE id = $id")->fetch_assoc();

// 📚 tutti i generi
$generi = $conn->query("SELECT * FROM generi");

// 📚 generi già associati
$gen_manga = [];
$res = $conn->query("SELECT id_genere FROM manga_generi WHERE id_manga = $id");
while($row = $res->fetch_assoc()) {
    $gen_manga[] = $row['id_genere'];
}

// ✏️ UPDATE
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $titolo = $conn->real_escape_string($_POST['titolo']);
    $autore = $conn->real_escape_string($_POST['autore']);
    $descrizione = $conn->real_escape_string($_POST['descrizione']);
    $anno = $_POST['anno'];
    $stato = $_POST['stato'];

    $imgName = $manga['immagine'];

    // 🖼️ nuova immagine
    if (!empty($_FILES['immagine']['name'])) {

        $tmp = $_FILES['immagine']['tmp_name'];
        $imgName = time() . "_" . basename($_FILES['immagine']['name']);

        move_uploaded_file($tmp, "../assets/img/covers/" . $imgName);
    }

    // 💾 update manga
    $conn->query("
        UPDATE manga SET
        titolo='$titolo',
        autore='$autore',
        descrizione='$descrizione',
        anno='$anno',
        stato='$stato',
        immagine='$imgName'
        WHERE id=$id
    ");

    // 🔄 reset generi
    $conn->query("DELETE FROM manga_generi WHERE id_manga=$id");

    // 🔗 reinserisci generi
    if (!empty($_POST['generi'])) {
        foreach ($_POST['generi'] as $g) {
            $conn->query("
                INSERT INTO manga_generi (id_manga, id_genere)
                VALUES ($id, $g)
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
    <title>Modifica Manga</title>
    <link rel="stylesheet" href="../assets/css/manga_add.css">
</head>
<body>

<div class="container">

<h2>✏️ Modifica Manga</h2>

<form method="POST" enctype="multipart/form-data">

    <input type="text" name="titolo" value="<?php echo $manga['titolo']; ?>" required>

    <input type="text" name="autore" value="<?php echo $manga['autore']; ?>">

    <textarea name="descrizione"><?php echo $manga['descrizione']; ?></textarea>

    <input type="number" name="anno" value="<?php echo $manga['anno']; ?>">

    <select name="stato">
        <option <?php if($manga['stato']=="In corso") echo "selected"; ?>>In corso</option>
        <option <?php if($manga['stato']=="Completato") echo "selected"; ?>>Completato</option>
        <option <?php if($manga['stato']=="In pausa") echo "selected"; ?>>In pausa</option>
    </select>

    <h3>📚 Generi</h3>

    <div class="generi">
        <?php while($g = $generi->fetch_assoc()): ?>
            <label>
                <input type="checkbox" name="generi[]"
                       value="<?php echo $g['id']; ?>"
                       <?php if(in_array($g['id'], $gen_manga)) echo "checked"; ?>>
                <?php echo $g['nome']; ?>
            </label>
        <?php endwhile; ?>
    </div>

    <br>

    <!-- 📸 immagine attuale -->
    <?php if(!empty($manga['immagine'])): ?>
        <p>Immagine attuale:</p>
        <img src="../assets/img/covers/<?php echo $manga['immagine']; ?>" width="120"><br><br>
    <?php endif; ?>

    <input type="file" name="immagine">

    <button type="submit">💾 Salva modifiche</button>

</form>

<a href="dashboard.php">⬅ Torna alla Dashboard</a>

</div>

</body>
</html>