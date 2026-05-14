<?php
session_start();
require("../config/db.php");

if (!isset($_SESSION['ruolo']) || $_SESSION['ruolo'] != 'admin') {
    header("Location: ../index.php");
    exit();
}

$id = $_GET['id'];

// elimina manga
$conn->query("DELETE FROM manga WHERE id = $id");

// torna alla lista
header("Location: manga_list.php");
exit();
?>