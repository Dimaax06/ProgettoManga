<?php session_start(); ?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Login</title>

    <link rel="stylesheet" href="assets/css/auth.css">
</head>
<body>

<div class="auth-container">

    <div class="auth-box">

        <h2>Login</h2>

        <form action="login_process.php" method="POST">

            <input type="text" name="username" placeholder="Username" required>

            <input type="password" name="password" placeholder="Password" required>

            <button type="submit">Accedi</button>

        </form>

        <div class="auth-link">
            Non hai un account?
            <a href="register.php">Registrati</a>
        </div>

    </div>

</div>

</body>
</html>