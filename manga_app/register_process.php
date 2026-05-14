<?php
require("config/db.php");

$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

// 🔍 Controllo se esiste già
$check = "SELECT * FROM utenti WHERE username = '$username'";
$result = $conn->query($check);

if ($result->num_rows > 0) {
    echo "Username già esistente!";
} else {
    // Inserimento
    $sql = "INSERT INTO utenti (username, password) 
            VALUES ('$username', '$password')";

    if ($conn->query($sql)) {
        header("Location: login.php");
    } else {
        echo "Errore registrazione";
    }
}
?>