<?php
session_start();

// 🔐 sicurezza: verifica se esiste una sessione
if (isset($_SESSION)) {

    // svuota tutte le variabili di sessione
    $_SESSION = array();

    // elimina il cookie di sessione (più pulito)
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    // distrugge la sessione
    session_destroy();
}

// 🔁 redirect con messaggio
header("Location: index.php?logout=success");
exit();
?>