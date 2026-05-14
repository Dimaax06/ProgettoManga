<?php
session_start();
require("../config/db.php");

if (!isset($_SESSION['id']) || $_SESSION['ruolo'] !== 'admin') {
    header("Location: ../login.php");
    exit();
}

if (isset($_GET['id'])) {

    $id = (int) $_GET['id'];

    $conn->query("UPDATE utenti SET banned = 0 WHERE id = $id");
}

header("Location: users.php");
exit();