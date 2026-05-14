<?php
session_start();
require("config/db.php");

// 🔒 login obbligatorio
if (!isset($_SESSION['id'])) {
    header("Location: login.php");
    exit();
}

$id_utente = $_SESSION['id'];
$id_manga = (int) $_GET['id'];

// controllo se già nei preferiti
$check = $conn->query("
    SELECT * FROM preferiti
    WHERE id_utente = $id_utente
    AND id_manga = $id_manga
");

if ($check->num_rows > 0) {

    // rimuovi dai preferiti
    $conn->query("
        DELETE FROM preferiti
        WHERE id_utente = $id_utente
        AND id_manga = $id_manga
    ");

} else {

    // aggiungi ai preferiti
    $conn->query("
        INSERT INTO preferiti (id_utente, id_manga)
        VALUES ($id_utente, $id_manga)
    ");
}

header("Location: index.php");
exit();
?>