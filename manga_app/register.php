<?php session_start(); ?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Registrazione</title>

    <link rel="stylesheet" href="assets/css/auth.css">
</head>
<body>

<div class="auth-container">

    <div class="auth-box">

        <h2>Registrazione</h2>

        <form action="register_process.php" method="POST">

            <input type="text" name="username" placeholder="Username" required>

            <input type="password" name="password" placeholder="Password" required>

            <input type="password" name="confirm_password" placeholder="Conferma Password" required>

            <button type="submit">Registrati</button>

        </form>

        <div class="auth-link">
            Hai già un account?
            <a href="login.php">Login</a>
        </div>

    </div>

</div>

</body>
</html>