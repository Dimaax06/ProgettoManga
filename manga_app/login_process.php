<?php
session_start();
require("config/db.php");

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM utenti WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows == 1) {

    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {

        // 🔐 SESSION CORRETTA
        $_SESSION['id'] = $user['id'];
        $_SESSION['username'] = $user['username']; // ⭐ QUESTO MANCAVA
        $_SESSION['ruolo'] = $user['ruolo'];

        header("Location: index.php");
        exit();

    } else {
        echo "Password errata";
    }

} else {
    echo "Utente non trovato";
}
?>