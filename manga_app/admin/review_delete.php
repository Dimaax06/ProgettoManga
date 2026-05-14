<?php
session_start();
require("../config/db.php");

// 🔒 controllo admin
if (!isset($_SESSION['ruolo']) || $_SESSION['ruolo'] != 'admin') {
    die("Accesso negato");
}

// 🔒 solo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $id = (int) $_POST['id'];

    $conn->query("DELETE FROM recensioni WHERE id = $id");
}

header("Location: reviews.php");
exit();