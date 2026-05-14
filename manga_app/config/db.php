<?php
// 🔌 Connessione al database
$conn = new mysqli("localhost", "root", "", "manga_app");

// ❌ controllo errori connessione
if ($conn->connect_error) {
    die("Errore connessione DB: " . $conn->connect_error);
}

// 🔧 charset corretto (importante per accenti)
$conn->set_charset("utf8mb4");
?>